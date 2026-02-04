## 1. High-Level Architecture
We will use a Service-Oriented Architecture (SOA) approach within a modular monolith. This keeps the codebase simple (easy to deploy on Render) but structured enough to scale or split later.

Runtime: Python 3.11+

Framework: FastAPI (Async, Typed, Fast)

Database: PostgreSQL (via Supabase)

ORM: SQLAlchemy (Async) or Prisma Client Python

ML Engine: Scikit-learn / XGBoost

## 2. Directory Structure

Plaintext
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py         # Clerk Webhooks (user sync)
│   │   │   │   ├── fraud.py        # The core ML prediction endpoint
│   │   │   │   └── billing.py      # Stripe checkout & webhooks
│   │   │   └── api.py              # Router aggregator
│   ├── core/
│   │   ├── config.py               # Env variables (Pydantic Settings)
│   │   ├── security.py             # API Key validation / Clerk Token verification
│   │   └── exceptions.py           # Custom error handlers
│   ├── db/
│   │   ├── session.py              # Database connection logic
│   │   └── base.py                 # SQLAlchemy declarative base
│   ├── models/
│   │   ├── user.py                 # User table (quota tracking)
│   │   └── transaction.py          # History of scans
│   ├── schemas/                    # Pydantic models (Request/Response validation)
│   │   ├── fraud_schema.py
│   │   └── user_schema.py
│   ├── services/
│   │   ├── ml_service.py           # *CRITICAL* Loads .pkl model, runs inference
│   │   ├── stripe_service.py       # Handles Stripe logic
│   │   └── usage_service.py        # Checks/Updates free tier limits
│   └── main.py                     # App entry point
├── ml_models/
│   └── fraud_model_v1.pkl          # Your trained model artifact
├── requirements.txt
└── Dockerfile                      # For Render deployment

## 3. Key Components & Logic flow

### A. The ML Service (ml_service.py)
This is the "Brain." We don't want to load the heavy ML model on every request.

Pattern: Singleton Pattern. Load the model once into memory when the app starts (in main.py using FastAPI lifespan events) and reuse it.

Logic:

Pre-process input (One-Hot Encoding, Scaling) to match training data.

model.predict_proba() to get the risk score.

Return { "is_fraud": bool, "risk_score": float }.

### B. The "SaaS" Guardrails (usage_service.py)
This is where the "Fake/Real" business logic lives.

The Check: Before running the ML model, the endpoint checks the user's quota in Supabase.

Logic:

Python
async def check_quota(user_id: str, db: Session):
    user = await get_user(db, user_id)
    if user.plan == "FREE" and user.daily_requests >= 5:
        raise HTTPException(402, detail="Daily quota exceeded. Upgrade to Pro.")
    return True

### C. Database Schema (PostgreSQL)
You need two main tables to make the SaaS logic work.

1. Users Table

id (String, PK): Matches Clerk ID.

email (String).

plan_tier (Enum): 'FREE', 'PRO'.

daily_usage_count (Int): Reset this via a scheduled job or logic on first request of the day.

stripe_customer_id (String).

2. Transactions Table (History)

id (UUID).

user_id (FK).

amount (Float).

risk_score (Float).

verdict (String): 'SAFE', 'FRAUD'.

created_at (Timestamp).

## 4. API Endpoints (The Contract)

---

1. POST /api/v1/fraud/analyze

Input:

JSON
{
  "amount": 450.00,
  "merchant": "TechStore",
  "location": "NY",
  "ip_address": "192.168.1.1"
}
Process:

Verify Auth Token (Clerk).

UsageService.check_limit(user).

MLService.predict(data).

DB.save_transaction(result).

UsageService.increment_count(user).

Output:

JSON
{
  "risk_score": 0.87,
  "verdict": "HIGH_RISK",
  "remaining_quota": 2
}
2. POST /api/v1/billing/create-checkout-session

Process: Calls Stripe API to create a payment link for the "Pro Plan."

Output: Returns a URL to redirect the frontend to Stripe.

3. POST /api/v1/billing/webhook

Process: Listens for Stripe events (checkout.session.completed). When payment succeeds, it updates the user's plan_tier to 'PRO' in Supabase.

## 5. Deployment Strategy (Render.com)
Build Command: pip install -r requirements.txt

Start Command: uvicorn app.main:app --host 0.0.0.0 --port 10000

Environment Variables:

DATABASE_URL: (From Supabase)

CLERK_SECRET_KEY: (For Auth)

STRIPE_API_KEY: (For Payments)