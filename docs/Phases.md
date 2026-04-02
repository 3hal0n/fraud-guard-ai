Phase 1: The Core Engine (AI & Backend Skeleton)
Goal: Get a Python API running locally that can accept data and return a prediction.

1.1 Data & Model (The "Brain")

[ ] Download Data: Get the "Credit Card Fraud Detection" dataset from Kaggle (it’s the standard for this).

[ ] Train Model: Create a Jupyter Notebook. Train a simple XGBoost or RandomForest model.

[ ] Export: Save the trained model as fraud_model.pkl using Python's pickle or joblib library.

[ ] Write Wrapper: Write a simple Python function predict_fraud(input_data) that loads the file and returns a score.

1.2 FastAPI Setup (The "Nerves")

[ ] Init Repo: Create backend/ folder. Initialize a virtual environment.

[ ] Install: pip install fastapi uvicorn scikit-learn xgboost.

[ ] Hello World: Create main.py with a basic GET / endpoint.

[ ] Prediction Endpoint: Create POST /api/v1/analyze. Connect it to your predict_fraud function.

[ ] Test: Use Postman or curl to send fake transaction data and see if you get a JSON response.

Phase 2: The SaaS Infrastructure (Data & Auth)
Goal: Set up the systems that make this a "real" product, not just a script.

2.1 Database (Supabase)

[ ] Create Project: Go to Supabase, create a new project "FraudGuard".

[ ] Table 1 (users): Columns: id (text, PK), email, plan (default 'FREE'), daily_usage (int, default 0).

[ ] Table 2 (transactions): Columns: id, user_id, amount, risk_score, timestamp.

2.2 Authentication (Clerk)

[ ] Setup: Create a Clerk application.

[ ] Sync: (Optional but good) Set up a Webhook so when a user signs up in Clerk, it automatically adds a row to your Supabase users table.

2.3 Backend Logic

[ ] Connect DB: Install sqlalchemy or prisma-client-py in your backend. Connect to Supabase.

[ ] The Guardrail: Add logic to the /analyze endpoint:

If user is FREE and daily_usage > 5 -> Return Error 402.

Else -> Run Model -> Save Result -> Increment Usage.

Phase 3: The Frontend (Next.js + Lovable)
Goal: Create the user interface.

3.1 Setup

[ ] Init: npx create-next-app@latest frontend.

[ ] Install: npm install @clerk/nextjs axios.

[ ] Lovable: Use the prompt we designed to generate the UI components. Copy the code into your Next.js project.

3.2 Integration

[ ] Auth: Wrap your app in the <ClerkProvider>. Protect the /dashboard route so only logged-in users can see it.

[ ] API Connection: In your "Scan Transaction" button, make it call your FastAPI backend (http://localhost:8000/api/v1/analyze).

[ ] Display: Show the returned Risk Score on the gauge chart.

Phase 4: Monetization (The "Fake" Paid Tier)
Goal: Show you understand payments integration.

4.1 Stripe Setup

[ ] Account: Create a Stripe account. Toggle "Test Mode" ON.

[ ] Product: Create a dummy product "Pro Plan" for $29. Copy the price_id.

4.2 The Upgrade Flow

[ ] Checkout Endpoint: In FastAPI, create /create-checkout-session. It should return a Stripe URL.

[ ] Frontend Button: Make the "Upgrade" button call this endpoint and redirect the user to the Stripe URL.

[ ] Success Page: Create a /dashboard?success=true state that celebrates the upgrade.

[ ] Webhook (The Real Magic): Listen for Stripe's checkout.session.completed event in FastAPI to update the Supabase user from 'FREE' to 'PRO'.

Phase 5: Deployment (Go Live)
Goal: Get URLs you can put on your CV.

5.1 Backend (Render)

[ ] Dockerfile: Create a simple Dockerfile for Python.

[ ] Deploy: Push to GitHub. Connect Render to the backend folder.

[ ] Env Vars: Add your Supabase URL, Stripe Keys, and Clerk Keys to Render.

5.2 Frontend (Vercel)

[ ] Deploy: Connect Vercel to the frontend folder.

[ ] Env Vars: Add NEXT_PUBLIC_CLERK_KEY and your Backend URL.

5.3 Final Polish

[ ] The "Wake Up" Ping: Set up UptimeRobot to ping your Render backend so it doesn't sleep.

[ ] Readme: Write the "Senior Engineer" style README we discussed.

Phase 6: B2B Enterprise Additions (Post-Launch)
Goal: Upgrade the app from a tool to a full SaaS platform.

[ ] Telemetry Dashboard: Update the /dashboard home page to fetch actual row counts from Supabase (e.g., "Total Scans: 42", "High Risk Detected: 3").

[ ] Developer API Hub: Create a page where users can click "Generate API Key" (save a random UUID to their Supabase profile) so they can bypass the UI and hit your FastAPI endpoint directly via code.

[ ] Bulk CSV Audit: Add a drag-and-drop zone where users can upload a CSV of 100 transactions, have FastAPI process them in a loop, and return the flagged rows.

[ ] Senior README: Write a comprehensive README detailing the ML pipeline, the deterministic hash bridge, the SaaS architecture, and the database schema.
### `backend/app/services/explainer.py`
```python
from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
import shap

# Must match training-time feature order exactly
EXPECTED_FEATURES = ["Time", "Amount"] + [f"V{i}" for i in range(1, 29)]

# Human-readable mapping for anonymized PCA features
FEATURE_LABELS = {
    "Time": "Unusual transaction timing",
    "Amount": "Unusual transaction amount",
    "V12": "Merchant/Location Inconsistency",
    "V14": "Merchant/Location Inconsistency",
    "V10": "Behavioral velocity anomaly",
    "V17": "Behavioral velocity anomaly",
    "V4": "Cardholder pattern deviation",
    "V11": "Cardholder pattern deviation",
}

MODEL_PATH = Path("backend/app/models/fraud_model.pkl")


@lru_cache(maxsize=1)
def _load_model() -> Any:
    model = joblib.load(MODEL_PATH)
    return model


@lru_cache(maxsize=1)
def _get_explainer() -> shap.TreeExplainer:
    model = _load_model()
    return shap.TreeExplainer(model)


def _normalize_input(input_df: pd.DataFrame) -> pd.DataFrame:
    missing = [c for c in EXPECTED_FEATURES if c not in input_df.columns]
    extra = [c for c in input_df.columns if c not in EXPECTED_FEATURES]
    if missing or extra:
        raise ValueError(
            f"Feature mismatch. Missing={missing}, Extra={extra}. "
            "Ensure training and inference feature names are identical."
        )
    return input_df[EXPECTED_FEATURES].copy()


def get_prediction_explanation(input_df: pd.DataFrame) -> list[dict[str, float | str]]:
    """
    Returns top 3 SHAP contributors for a single transaction row.
    Output: [{"feature": "Amount", "contribution": 0.45}, ...]
    """
    x = _normalize_input(input_df)
    if len(x) != 1:
        raise ValueError("get_prediction_explanation expects a single transaction row.")

    explainer = _get_explainer()
    shap_values = explainer.shap_values(x)

    # Binary XGBoost can return ndarray or list depending on config/version
    if isinstance(shap_values, list):
        sv = np.array(shap_values[-1])[0]  # positive/fraud class
    else:
        sv = np.array(shap_values)[0]

    ranked_idx = np.argsort(np.abs(sv))[::-1][:3]

    factors: list[dict[str, float | str]] = []
    for idx in ranked_idx:
        col = EXPECTED_FEATURES[idx]
        factors.append(
            {
                "feature": FEATURE_LABELS.get(col, f"Latent anomaly signal ({col})"),
                "contribution": float(round(float(sv[idx]), 4)),  # signed for UI color
            }
        )

    return factors
```

---

### `backend/main.py` (update endpoint)
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd

from app.services.explainer import EXPECTED_FEATURES, get_prediction_explanation

app = FastAPI()
model = joblib.load("backend/app/models/fraud_model.pkl")


class TransactionInput(BaseModel):
    Time: float
    Amount: float
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float


@app.post("/api/v1/analyze")
def analyze_transaction(payload: TransactionInput):
    try:
        row = payload.model_dump()
        input_df = pd.DataFrame([row])[EXPECTED_FEATURES]  # strict feature order

        proba = model.predict_proba(input_df)[0][1]
        risk_score = round(float(proba * 100), 2)

        risk_factors = get_prediction_explanation(input_df)

        return {
            "risk_score": risk_score,
            "risk_factors": risk_factors,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
```

---

### `frontend/components/ScanResults.tsx`
```tsx
import React from "react";

type RiskFactor = {
  feature: string;
  contribution: number; // signed SHAP value
};

type ScanResultsProps = {
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
};

const CORAL_RED = "#FF6B6B";
const ELECTRIC_TEAL = "#2DE2E6";

export default function ScanResults({ riskScore, riskFactors }: ScanResultsProps) {
  const maxAbs =
    Math.max(...riskFactors.map((f) => Math.abs(f.contribution)), 0.0001);

  return (
    <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      {/* Existing risk dial remains above this component */}

      <h3 className="text-sm font-semibold tracking-wide text-slate-200">
        Why was this flagged?
      </h3>

      {riskScore < 20 ? (
        <p className="mt-3 text-sm text-slate-400">
          No significant risk factors detected.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {riskFactors.map((factor, i) => {
            const isPositiveRisk = factor.contribution > 0;
            const widthPct = Math.max(
              8,
              Math.round((Math.abs(factor.contribution) / maxAbs) * 100)
            );

            return (
              <div key={`${factor.feature}-${i}`} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{factor.feature}</span>
                  <span
                    className="font-medium"
                    style={{ color: isPositiveRisk ? CORAL_RED : ELECTRIC_TEAL }}
                  >
                    {factor.contribution > 0 ? "+" : ""}
                    {factor.contribution.toFixed(3)}
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: isPositiveRisk ? CORAL_RED : ELECTRIC_TEAL,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
```