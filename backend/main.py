from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from predict import predict_fraud
import uuid
import os
from db import SessionLocal, create_tables, get_user, increment_usage, save_transaction
import logging

logger = logging.getLogger("fraudguard")


# NOTE: avoid creating DB tables at import-time to prevent startup failures

class Transaction(BaseModel):
    amount: float
    merchant: str
    category: str | None = None
    location: str | None = None
    time: str | None = None
    user_id: str | None = None

app = FastAPI(title="FraudGuard AI - Backend")


@app.on_event("startup")
def _ensure_tables():
    # Migrations should be used in production; keep import-time safety.
    try:
        # keep behavior non-fatal for dev if DB is unreachable
        logger.info("Skipping create_tables at startup; use Alembic to manage migrations")
    except Exception:
        pass


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


@app.on_event("startup")
def _start_background_jobs():
    try:
        _schedule_daily_reset()
        logger.info("Scheduled daily reset job")
    except Exception:
        logger.exception("Failed to start background jobs")

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

@app.post("/api/v1/analyze")
async def analyze(transaction: Transaction):
    db = SessionLocal()
    try:
        user_id = transaction.user_id
        # If user_id provided, enforce guardrail
        if user_id:
            user = get_user(db, user_id)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            # FREE plan guardrail
            if (user.plan or "FREE").upper() == "FREE" and (user.daily_usage or 0) >= 5:
                raise HTTPException(status_code=402, detail="Daily usage limit exceeded for FREE plan")

        # Run prediction
        score, status = predict_fraud(transaction.dict())

        # Persist transaction and increment usage if user exists
        tx_id = str(uuid.uuid4())
        save_transaction(db, tx_id, user_id, float(transaction.amount), int(score))
        if user_id:
            user = get_user(db, user_id)
            increment_usage(db, user, 1)

        return {"risk_score": score, "status": status}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
