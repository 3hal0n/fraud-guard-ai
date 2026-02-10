from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from predict import predict_fraud

class Transaction(BaseModel):
    amount: float
    merchant: str
    category: str | None = None
    location: str | None = None
    time: str | None = None
    user_id: str | None = None

app = FastAPI(title="FraudGuard AI - Backend")

@app.get("/")
async def root():
    return {"message": "FraudGuard AI backend is running"}

@app.post("/api/v1/analyze")
async def analyze(transaction: Transaction):
    try:
        score, status = predict_fraud(transaction.dict())
        return {"risk_score": score, "status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
