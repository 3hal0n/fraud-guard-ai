# FraudGuard AI — Architecture Overview

This document describes the architecture of the FraudGuard AI application, the main components, the tech choices, and the AI fraud-detection pipeline (training, serving, and explainability). It explains how data flows through the system and provides recommendations for production hardening, monitoring, and model lifecycle management.

---

## 1. System Summary

FraudGuard AI is a full-stack web application that provides real-time fraud scoring and explainability for payment / transaction events. It contains:
- A modern Next.js frontend for marketing pages and an authenticated dashboard.
- A Python FastAPI backend that exposes REST endpoints for inference, audit history, and admin operations.
- An ML model (XGBoost / tree-based model) served as a serialized artifact for fast prediction.
- Explainability (SHAP TreeExplainer) to provide per-transaction feature attributions returned to the UI.
- A small relational database (SQLAlchemy-managed + Alembic migrations) for users, transactions and audit trail.

Key design goals: low-latency inference, reproducible model behavior, explainable predictions, and a developer-friendly frontend.

---

## 2. High-level Components

### Frontend
- Framework: Next.js 16 (app router), React 19
- UI: TypeScript, Tailwind-like utility classes, Framer Motion for micro-interactions
- Auth: Clerk for authentication + hosted sign-in/up flows
- Charts: Recharts for dashboards (ComposedChart / Bar + Line)
- Responsibilities:
  - Marketing pages (public)
  - Auth-protected dashboard (analyze, history, billing, API hub)
  - Calls backend endpoints for model inference and transaction history
  - Renders `risk_factors` & Shap-driven explanations in the "Why was this flagged?" UI

### Backend
- Framework: FastAPI (Python)
- Model artifact loading: joblib / native XGBoost load (artifact stored in repo `ml-models/` or external storage)
- Data access: SQLAlchemy + Alembic migrations (DB configurable, typically Postgres in production)
- Services:
  - /api/v1/analyze — accepts transaction payload, returns `risk_score`, `status`, and `risk_factors`
  - Transaction and audit APIs — create/read historical scan results
  - Explainer service (loaded alongside model) — computes SHAP TreeExplainer values, groups PCA-like features into human-friendly labels and returns top N drivers

### ML Components
- Model: tree-based model (XGBoost / LightGBM or similar) trained offline
- Preprocessing: stored scaler/feature pipeline ensures input features are in the canonical order (FEATURE_COLUMNS)
- Explainability: SHAP TreeExplainer (fast for tree models) used at inference time to create per-feature attributions; downstream code groups V1–V28 PCA features into human-friendly buckets for UI consumption
- Persistence: models and scalers saved with joblib or model-specific save and deployed with the backend

### Data & Storage
- Primary DB: relational DB (SQLAlchemy) for users, transactions, audit logs, API keys
- ML artifacts: stored in `ml-models/` in repo for dev; production should use object storage (S3, Azure Blob) with versioning
- Logs & metrics: application logs, structured events, and metrics (Prometheus / Grafana recommended)

---

## 3. AI Fraud-Detection Pipeline (detailed)

1. Data collection
   - Transaction events (amount, time, anonymized features V1..V28, etc.) are recorded or streamed to the backend.
   - A normalized feature vector is prepared using the same preprocessing pipeline used at training.

2. Feature preparation
   - `FEATURE_COLUMNS` enforces a canonical order.
   - Numeric normalization (scaler) and any derived features are applied identically to training-time processing.

3. Model inference
   - Backend loads the trained tree model on startup and keeps it in memory.
   - For each /analyze request: the cleaned feature vector is passed to the model to produce a probability/risk score.
   - A simple threshold mapping is applied to convert the score to an application `status` (e.g., <30 → APPROVED, 30–70 → PENDING_REVIEW, >70 → BLOCK_TRANSACTION).

4. Explainability (SHAP)
   - For tree-based models, `shap.TreeExplainer(model)` is used; SHAP values for the feature vector are computed at inference time.
   - SHAP values are grouped/mapped into human-readable drivers (e.g., grouping `V1..V5` as "Velocity", `V6..V10` as "Payment Behavior").
   - The API returns the top-3 contributing drivers and their relative magnitudes as `risk_factors` alongside the `risk_score`.
   - The frontend visualizes these as horizontal bars with color mapping (teal/amber/red) matching the `status`.

5. Persistence & auditing
   - Each scan is optionally recorded in the DB for the ledger / history view with the score, status, and explanation metadata for later review and training.

6. Retraining & feedback loop (recommended)
   - Periodically re-train models using recent labeled data (confirmed fraud / cleared transactions).
   - Store training metadata, dataset versions, and model versions.
   - Consider incremental retraining or nightly batch jobs.

---

## 4. Operational Concerns & Best Practices

- Model reproducibility
  - Keep the `FEATURE_COLUMNS` and preprocessing pipeline versioned and stored with each model artifact.
  - Tag model artifacts with semantic versioning and training dataset identifiers.

- Latency & scaling
  - Keep model in-process for very low-latency inference.
  - For heavy load, use a dedicated model-serving layer (TF-Serving, TorchServe, or a containerized microservice) and autoscale.

- Explainability cost
  - SHAP for tree models is efficient but still has CPU cost — cache or sample SHAP computations if throughput is very high, or compute full SHAP only for user-triggered requests.

- Security
  - Use Clerk for authentication and secure sessions.
  - Validate input on the backend and rate-limit inference APIs to prevent abuse.
  - Store API keys and secrets in environment variables or a secrets store (Key Vault / AWS Secrets Manager).

- Observability
  - Metrics: request latency, model inference time, SHAP computation time, traffic, error rates.
  - Logging: structured JSON logs containing request id, user id, transaction id, model version, and score (avoid logging PII).
  - Alerts: high error rate, model drift indicators (e.g., sudden change in score distribution), high latency.

- Testing
  - Unit tests for preprocessing, API contract tests for `/api/v1/analyze`.
  - Integration tests for end-to-end inference & SHAP output (existing pytest suite covers backend basics).

---

## 5. Deployment & CI/CD

- Frontend: Next.js app — deploy static pages and server components via Vercel, Netlify, or containerized Node server.
- Backend: Containerize the FastAPI service (Docker) and deploy to Kubernetes / AWS ECS / Azure Container Instances with environment-specific config.
- Model artifacts: store in an artifact registry or object storage and pull at deployment time.
- CI/CD pipeline should run linting, tests, build artifacts, and publish the frontend and backend images.

---

## 6. Suggested Improvements & Roadmap

- Productionize the model lifecycle:
  - Introduce a model registry (e.g., MLflow or a simple artifact naming scheme).
  - Automate retraining, validation, and canary rollout of new model versions.

- Observability & drift detection:
  - Track input feature distributions and label distributions to detect drift.
  - Run offline calibration and performance tracking dashboards.

- Feature store / feature pipelines:
  - Centralize feature transformations in a feature store to ensure parity between training and serving.

- Scalability:
  - If inference throughput grows, move SHAP computation to async workers or provide a sampled explainability endpoint for on-demand deep explainability.

- Security & compliance:
  - Add data retention policies and encryption-at-rest for the DB and model artifacts.
  - Add audit trails for model changes and approvals.

---

## 7. Files & Entry Points (important repo locations)
- Frontend: `frontend/src/` (Next.js app)
- Backend: `backend/main.py` (API), `backend/app/services/explainer.py` (SHAP explainer service)
- ML artifacts: `ml-models/` (training artifacts stored for development)
- DB migrations: `backend/alembic/` and `alembic.ini`
- Tests: `backend/tests/` (pytest)

---

## 8. Contact & Ownership
- Engineering: application owners and ML engineers should share ownership of model validation, deployment, and monitoring.
- Security & compliance: ensure legal/regulatory review for data retention and explainability features when used in production.

---

This document is a living artifact — update it as architecture or operational practices change.
