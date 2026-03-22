from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, UploadFile, File, Header, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import predict_fraud, load_models
import uuid
import os
import csv
import importlib
from db import (
    SessionLocal,
    create_tables,
    get_user,
    get_user_by_api_key,
    get_user_telemetry_counts,
    increment_usage,
    save_transaction,
    set_user_api_key,
    set_user_plan,
    Transaction as TxModel,
)
import logging

logger = logging.getLogger("fraudguard")
# Optional module-level Stripe override (used by tests and local stubs).
stripe = None


# NOTE: avoid creating DB tables at import-time to prevent startup failures

class TransactionRequest(BaseModel):
    """Validated payload from the Next.js frontend."""
    amount: float
    merchant: str
    category: str | None = None
    location: str | None = None
    time: str | None = None          # e.g. "2026-02-26 13:13"
    user_id: str | None = None


class CheckoutSessionRequest(BaseModel):
    user_id: str

# ---------------------------------------------------------------------------
# Lifespan: load ML models + start background jobs once at startup
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs startup logic before the server starts accepting requests,
    and teardown logic when it shuts down."""
    # ---- startup ----
    try:
        load_models()
        logger.info("ML models loaded successfully via lifespan")
    except Exception as exc:
        # Log but do NOT crash the server; /analyze will return 500 with a
        # clear message if the models are unavailable.
        logger.error("Failed to load ML models at startup: %s", exc)

    try:
        _schedule_daily_reset()
        logger.info("Scheduled daily usage-reset job")
    except Exception:
        logger.exception("Failed to start background jobs")

    yield  # <- server is live and handling requests

    # ---- shutdown (nothing to tear down currently) ----


app = FastAPI(title="FraudGuard AI - Backend", lifespan=lifespan)

_ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_stripe_client():
    secret_key = os.environ.get("STRIPE_SECRET_KEY")
    if not secret_key:
        raise HTTPException(status_code=500, detail="Stripe is not configured")

    stripe_module = stripe
    if stripe_module is None:
        try:
            stripe_module = importlib.import_module("stripe")
        except ModuleNotFoundError:
            raise HTTPException(status_code=500, detail="Stripe SDK is not installed on backend")

    stripe_module.api_key = secret_key
    return stripe_module


@app.post("/api/v1/webhook/clerk")
async def clerk_webhook(request: dict):
    """Simple Clerk webhook receiver to create/sync users.
    Expected JSON shape: {"type":"user.created", "data": {"id": "user_...", "email": "..."}}
    This endpoint does NOT currently validate webhook signatures — add verification in production.
    """
    try:
        ev_type = request.get("type")
        data = request.get("data") or request.get("user") or {}
        if not data:
            raise HTTPException(status_code=400, detail="Missing user data")

        if ev_type and ev_type.startswith("user") or data.get("id"):
            user_id = data.get("id")
            email = data.get("email") or data.get("primary_email_address")
            if not user_id:
                raise HTTPException(status_code=400, detail="Missing user id")
            db = SessionLocal()
            try:
                # create or update user
                from db import create_user_if_not_exists
                u = create_user_if_not_exists(db, user_id, email)
                return {"ok": True, "user_id": u.id}
            finally:
                db.close()
        else:
            return {"ok": True, "message": "ignored event"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/create-checkout-session")
async def create_checkout_session(payload: CheckoutSessionRequest):
    """Create a Stripe Checkout Session for subscription upgrade."""
    user_id = (payload.user_id or "").strip()
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    db = SessionLocal()
    try:
        user = get_user(db, user_id)
        if not user:
            from db import create_user_if_not_exists
            user = create_user_if_not_exists(db, user_id)

        if (user.plan or "FREE").upper() == "PRO":
            raise HTTPException(status_code=409, detail="User is already on the PRO plan")

        stripe_client = _get_stripe_client()
        price_id = os.environ.get("STRIPE_PRICE_ID")
        success_url = os.environ.get(
            "STRIPE_SUCCESS_URL",
            "http://localhost:3000/dashboard/billing?upgrade=success",
        )
        cancel_url = os.environ.get(
            "STRIPE_CANCEL_URL",
            "http://localhost:3000/dashboard/billing?upgrade=cancel",
        )

        if not price_id:
            raise HTTPException(status_code=500, detail="STRIPE_PRICE_ID is not configured")

        session = stripe_client.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=success_url,
            cancel_url=cancel_url,
            client_reference_id=user_id,
            metadata={"user_id": user_id},
            allow_promotion_codes=True,
        )

        checkout_url = session.get("url")
        if not checkout_url:
            raise HTTPException(status_code=502, detail="Stripe did not return a checkout URL")

        return {"checkout_url": checkout_url}
    except HTTPException:
        raise
    except Exception as exc:
        # Stripe exceptions vary across SDK versions; treat all provider errors as bad gateway.
        logger.exception("Checkout session creation failed: %s", exc)
        raise HTTPException(status_code=502, detail="Failed to create Stripe checkout session")
    finally:
        db.close()

@app.post("/api/v1/webhook/stripe")
async def stripe_webhook(request: Request, stripe_signature: str | None = Header(default=None, alias="Stripe-Signature")):
    """Handle Stripe events and upgrade users after successful checkout."""
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")
    if not webhook_secret:
        raise HTTPException(status_code=500, detail="Stripe webhook is not configured")
    if not stripe_signature:
        raise HTTPException(status_code=400, detail="Missing Stripe-Signature header")

    payload = await request.body()
    stripe_client = _get_stripe_client()

    try:
        event = stripe_client.Webhook.construct_event(payload, stripe_signature, webhook_secret)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid webhook payload")
    except Exception as exc:
        # Handle signature verification differences across Stripe SDK versions.
        if exc.__class__.__name__ == "SignatureVerificationError":
            raise HTTPException(status_code=400, detail="Invalid Stripe signature")
        raise
    event_type = event.get("type")
    if event_type == "checkout.session.completed":
        session_obj = event.get("data", {}).get("object", {})
        user_id = (
            (session_obj.get("metadata") or {}).get("user_id")
            or session_obj.get("client_reference_id")
        )

        if not user_id:
            logger.warning("checkout.session.completed without user_id metadata")
            return {"received": True, "ignored": True}

        db = SessionLocal()
        try:
            user = get_user(db, user_id)
            if not user:
                from db import create_user_if_not_exists
                user = create_user_if_not_exists(db, user_id)
            set_user_plan(db, user, "PRO")
        finally:
            db.close()

    return {"received": True}


def _seconds_until_next_utc_midnight():
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    tomorrow = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    return int((tomorrow - now).total_seconds())


def _schedule_daily_reset():
    import threading
    def _reset_and_reschedule():
        db = SessionLocal()
        try:
            from db import reset_daily_usage_all
            reset_daily_usage_all(db)
            logger.info("daily_usage reset performed")
        except Exception as e:
            logger.exception("Failed to reset daily usage: %s", e)
        finally:
            db.close()
        # schedule next run
        t = threading.Timer(24 * 3600, _reset_and_reschedule)
        t.daemon = True
        t.start()

    # initial schedule to next midnight UTC
    initial = _seconds_until_next_utc_midnight()
    t0 = threading.Timer(initial, _reset_and_reschedule)
    t0.daemon = True
    t0.start()


@app.get("/")
async def root():
    return {"message": "FraudGuard AI backend is running"}


@app.get("/api/v1/db-status")
async def db_status():
    """Check DB connectivity and return status."""
    try:
        from check_db import test_connection
        ok, msg = test_connection()
        if ok:
            return {"db": "ok", "message": msg}
        else:
            raise HTTPException(status_code=500, detail=f"DB error: {msg}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/user/{user_id}")
async def get_user_info(user_id: str):
    """Return plan and daily_usage for a given user.

    Falls back to a default FREE-plan stub when the DB is unreachable
    so the frontend can still render without a 500 error.
    """
    db = SessionLocal()
    try:
        user = get_user(db, user_id)
        if not user:
            from db import create_user_if_not_exists
            user = create_user_if_not_exists(db, user_id)
        daily_limit = 5 if (user.plan or "FREE").upper() == "FREE" else None
        return {
            "user_id": user.id,
            "email": user.email,
            "plan": user.plan or "FREE",
            "daily_usage": user.daily_usage or 0,
            "daily_limit": daily_limit,
            "db_available": True,
        }
    except HTTPException:
        raise
    except Exception as e:
        # DB unreachable — return a safe default so the frontend doesn't break
        logger.warning("get_user_info DB error for %s: %s", user_id, e)
        return {
            "user_id": user_id,
            "email": None,
            "plan": "FREE",
            "daily_usage": 0,
            "daily_limit": 5,
            "db_available": False,
        }
    finally:
        try:
            db.close()
        except Exception:
            pass


@app.get("/api/v1/transactions/{user_id}")
async def get_transactions(user_id: str, limit: int = 20):
    """Return recent transactions for a user, newest first.

    Returns an empty list when DB is unreachable so the frontend
    renders gracefully instead of crashing.
    """
    db = SessionLocal()
    try:
        txns = (
            db.query(TxModel)
            .filter(TxModel.user_id == user_id)
            .order_by(TxModel.created_at.desc())
            .limit(limit)
            .all()
        )
        return [
            {
                "id": t.id,
                "amount": float(t.amount),
                "risk_score": float(t.risk_score),  # already 0-1 in DB
                "status": "risk" if float(t.risk_score) >= 0.50 else "safe",
                "timestamp": t.created_at.isoformat() if t.created_at else None,
            }
            for t in txns
        ]
    except Exception as e:
        logger.warning("get_transactions DB error for %s: %s", user_id, e)
        return []  # empty list — frontend handles this gracefully
    finally:
        try:
            db.close()
        except Exception:
            pass


@app.get("/api/v1/telemetry/{user_id}")
async def get_telemetry(user_id: str):
    """Return telemetry counters sourced from the transactions table."""
    db = SessionLocal()
    try:
        user = get_user(db, user_id)
        if not user:
            from db import create_user_if_not_exists
            create_user_if_not_exists(db, user_id)
        counts = get_user_telemetry_counts(db, user_id)
        return {
            "user_id": user_id,
            "total_scans": counts["total_scans"],
            "high_risk_detected": counts["high_risk_detected"],
            "db_available": True,
        }
    except Exception as e:
        logger.warning("get_telemetry DB error for %s: %s", user_id, e)
        return {
            "user_id": user_id,
            "total_scans": 0,
            "high_risk_detected": 0,
            "db_available": False,
        }
    finally:
        try:
            db.close()
        except Exception:
            pass


@app.get("/api/v1/user/{user_id}/api-key")
async def get_user_api_key(user_id: str):
    db = SessionLocal()
    try:
        user = get_user(db, user_id)
        if not user:
            from db import create_user_if_not_exists
            user = create_user_if_not_exists(db, user_id)
        if (user.plan or "FREE").upper() != "PRO":
            raise HTTPException(status_code=403, detail="API keys are available on the PRO plan")
        return {
            "user_id": user.id,
            "api_key": user.api_key,
            "has_api_key": bool(user.api_key),
        }
    finally:
        db.close()


@app.post("/api/v1/user/{user_id}/api-key")
async def generate_user_api_key(user_id: str):
    db = SessionLocal()
    try:
        user = get_user(db, user_id)
        if not user:
            from db import create_user_if_not_exists
            user = create_user_if_not_exists(db, user_id)

        if (user.plan or "FREE").upper() != "PRO":
            raise HTTPException(status_code=403, detail="API keys are available on the PRO plan")

        api_key = str(uuid.uuid4())
        user = set_user_api_key(db, user, api_key)
        return {
            "user_id": user.id,
            "api_key": user.api_key,
            "generated": True,
        }
    finally:
        db.close()


@app.post("/api/v1/analyze")
async def analyze(
    transaction: TransactionRequest,
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
):
    # SessionLocal() is lazy — the actual TCP connection happens on first query.
    # We therefore wrap individual DB operations (not SessionLocal) in try/except.
    db = SessionLocal()
    try:
        user_id = transaction.user_id
        db_ok = True
        user = None

        # Accept direct API usage via X-API-Key for automation clients.
        if x_api_key:
            try:
                user = get_user_by_api_key(db, x_api_key)
                if not user:
                    raise HTTPException(status_code=401, detail="Invalid API key")
                user_id = user.id
            except HTTPException:
                raise
            except Exception as key_exc:
                logger.warning("API key lookup failed: %s", key_exc)
                raise HTTPException(status_code=500, detail="Failed to validate API key")

        # ── Guardrail (requires DB) ─────────────────────────────────────────
        if user_id:
            try:
                user = user or get_user(db, user_id)
                if not user:
                    # Auto-create the user row on first scan (Clerk is the auth
                    # source of truth; we just need a DB record for quota tracking)
                    from db import create_user_if_not_exists
                    user = create_user_if_not_exists(db, user_id)
                if (user.plan or "FREE").upper() == "FREE" and (user.daily_usage or 0) >= 5:
                    raise HTTPException(status_code=402, detail="Daily usage limit exceeded for FREE plan")
            except HTTPException:
                raise  # propagate 402 as intended
            except Exception as guard_exc:
                # DB unreachable — skip guardrail, log, continue with inference
                logger.warning("Guardrail DB lookup failed; skipping: %s", guard_exc)
                db_ok = False

        # ── Inference ───────────────────────────────────────────────────────
        score, is_fraud = predict_fraud(
            amount=transaction.amount,
            merchant=transaction.merchant,
            location=transaction.location or "",
            time_str=transaction.time or "",
        )
        status = "risk" if is_fraud else "safe"

        # ── Persist (best-effort; failure must not mask the result) ─────────
        if db_ok:
            try:
                tx_id = str(uuid.uuid4())
                save_transaction(db, tx_id, user_id, float(transaction.amount), int(score))
                if user_id:
                    user = user or get_user(db, user_id)
                    increment_usage(db, user, 1)
            except Exception as persist_exc:
                logger.warning("Failed to persist transaction: %s", persist_exc)

        return {"risk_score": int(score), "is_fraud": is_fraud, "status": status, "db_available": db_ok}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unhandled error in /api/v1/analyze: %s", e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        try:
            db.close()
        except Exception:
            pass


@app.post("/api/v1/analyze/bulk-csv")
async def analyze_bulk_csv(user_id: str = Form(...), file: UploadFile = File(...)):
    """Process up to 100 transactions from CSV and return only flagged rows."""
    db = SessionLocal()
    try:
        user = get_user(db, user_id)
        if not user:
            from db import create_user_if_not_exists
            user = create_user_if_not_exists(db, user_id)

        if (user.plan or "FREE").upper() != "PRO":
            raise HTTPException(status_code=403, detail="Bulk CSV audit is available on the PRO plan")

        raw = await file.read()
        try:
            text = raw.decode("utf-8-sig")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="CSV must be UTF-8 encoded")

        reader = csv.DictReader(text.splitlines())
        if not reader.fieldnames:
            raise HTTPException(status_code=400, detail="CSV is missing a header row")

        required_columns = {"amount", "merchant"}
        missing = [col for col in required_columns if col not in set(reader.fieldnames)]
        if missing:
            raise HTTPException(status_code=400, detail=f"CSV missing required columns: {', '.join(missing)}")

        rows = list(reader)
        if len(rows) == 0:
            return {
                "processed_rows": 0,
                "flagged_rows": [],
            }
        if len(rows) > 100:
            raise HTTPException(status_code=400, detail="CSV limit is 100 transactions per upload")

        flagged_rows = []
        processed = 0

        for idx, row in enumerate(rows, start=1):
            try:
                amount = float(row.get("amount", "").strip())
                merchant = (row.get("merchant") or "").strip()
                if not merchant:
                    raise ValueError("merchant is required")

                location = (row.get("location") or "").strip()
                time_str = (row.get("time") or "").strip()

                score, is_fraud = predict_fraud(
                    amount=amount,
                    merchant=merchant,
                    location=location,
                    time_str=time_str,
                )
                status = "risk" if is_fraud else "safe"
                processed += 1

                tx_id = str(uuid.uuid4())
                try:
                    save_transaction(db, tx_id, user_id, amount, int(score))
                except Exception as persist_exc:
                    logger.warning("Bulk persist failed for row %s: %s", idx, persist_exc)

                normalized_score = int(score)
                if status == "risk":
                    flagged_rows.append(
                        {
                            "row_number": idx,
                            "amount": amount,
                            "merchant": merchant,
                            "location": location,
                            "time": time_str or None,
                            "risk_score": normalized_score,
                            "status": status,
                        }
                    )
            except Exception as row_exc:
                flagged_rows.append(
                    {
                        "row_number": idx,
                        "status": "invalid",
                        "error": str(row_exc),
                    }
                )

        try:
            increment_usage(db, user, processed)
        except Exception as usage_exc:
            logger.warning("Bulk usage increment failed for %s: %s", user_id, usage_exc)

        return {
            "processed_rows": processed,
            "total_rows": len(rows),
            "flagged_rows": flagged_rows,
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unhandled error in /api/v1/analyze/bulk-csv: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        try:
            db.close()
        except Exception:
            pass
