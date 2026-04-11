# FraudGuard AI

![FraudGuard AI Dashboard](snippets/dashboard.png)

An enterprise-grade, sub-85ms risk inference engine and B2B SaaS platform. FraudGuard AI combines a Python/XGBoost machine learning backend with a high-performance Next.js dashboard to detect, explain, and block fraudulent transactions in real-time.

### Tech Stack
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)

---

## Core Platform Capabilities

* **The Inference Engine:** Powered by XGBoost, the model evaluates hundreds of enriched parameters (velocity, geo-distance, temporal anomalies) to score payloads in under 85 milliseconds.
* **SHAP Explainability (White-box ML):** Moving beyond "black-box" AI, the dashboard utilizes SHAP (SHapley Additive exPlanations) to provide analysts with granular, per-factor driver breakdowns for every risk score.
* **Developer API Hub:** A self-serve portal for generating API keys, enabling clients to integrate the REST endpoint directly into their checkout flow.
* **Global Threat Map:** Real-time geospatial tracking of high-risk IPs and merchant location mismatches using custom Leaflet cartography.
* **Bulk CSV Auditing:** Dedicated tooling for risk teams to backtest rules by auditing up to 10,000 legacy transaction rows simultaneously.

## Model Validation & Adversarial Testing

To validate the robustness of the XGBoost model and the latency of the UI, the system underwent rigorous adversarial stress testing. 

This included injecting simulated high-velocity, high-dollar crypto transactions originating from high-risk geos (e.g., routing through Russian IPs via VPN at 3:00 AM local time). The model successfully flagged these edge-case vectors, demonstrating both its sensitivity to temporal/spatial anomalies and the dashboard's ability to render the resulting SHAP explanations under load without degrading the <85ms response SLA.

## System Architecture

* **Frontend (`/frontend`):** Next.js 14 (App Router), Tailwind CSS, Framer Motion, Recharts. Deployed on **Vercel** for edge-optimized delivery.
* **Backend (`/backend`):** Python, FastAPI, SQLAlchemy, XGBoost. Containerized and deployed on **Render** to ensure the ML model remains loaded in memory (preventing serverless cold-starts).
* **Auth & Billing:** Clerk (Authentication) and Stripe (Subscription Webhooks & Payment Processing).

---

## Local Development Setup

**Prerequisites:** Python 3.10+, Node.js 18+, PostgreSQL (or a hosted DB like Supabase).

### 1. Backend (FastAPI + ML)

```bash
cd backend
python -m venv .venv

# Windows: .\.venv\Scripts\Activate.ps1
# Mac/Linux: source .venv/bin/activate

pip install -r requirements.txt