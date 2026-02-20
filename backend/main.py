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
    try:
        create_tables()
        logger.info("DB tables ensured at startup")
    except Exception as e:
        logger.warning("Could not create DB tables at startup: %s", e)

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
