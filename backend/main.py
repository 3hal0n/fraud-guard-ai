from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import predict_fraud, load_models
import uuid
import os
from db import SessionLocal, create_tables, get_user, increment_usage, save_transaction, Transaction as TxModel
import logging

logger = logging.getLogger("fraudguard")


# NOTE: avoid creating DB tables at import-time to prevent startup failures

class TransactionRequest(BaseModel):
    """Validated payload from the Next.js frontend."""
    amount: float
    merchant: str
    category: str | None = None
    location: str | None = None
    time: str | None = None          # e.g. "2026-02-26 13:13"
    user_id: str | None = None

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


@app.post("/api/v1/analyze")
async def analyze(transaction: TransactionRequest):
    # SessionLocal() is lazy — the actual TCP connection happens on first query.
    # We therefore wrap individual DB operations (not SessionLocal) in try/except.
    db = SessionLocal()
    try:
        user_id = transaction.user_id
        db_ok = True

        # ── Guardrail (requires DB) ─────────────────────────────────────────
        if user_id:
            try:
                user = get_user(db, user_id)
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
                    user = get_user(db, user_id)
                    increment_usage(db, user, 1)
            except Exception as persist_exc:
                logger.warning("Failed to persist transaction: %s", persist_exc)

        return {"risk_score": round(score / 100, 4), "is_fraud": is_fraud, "status": status, "db_available": db_ok}
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
