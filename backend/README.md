# Backend — FraudGuard AI

This document explains how to set up and run the backend FastAPI service locally.

## Prerequisites
- Python 3.10+ installed
- Git (optional)
- PostgreSQL (or a compatible database). The app reads `DATABASE_URL` or `SUPABASE_DB_URL`.

## Quickstart (Windows PowerShell)

1. Create and activate a virtual environment

```powershell
python -m venv .venv
& .venv\Scripts\Activate.ps1
```

2. Install dependencies

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

3. Configure environment

- Create a `backend/.env` file or set env vars in your shell. Minimal example (`.env`):

```
DATABASE_URL=postgresql://<user>:<pass>@localhost:5432/<db_name>
ALLOWED_ORIGINS=http://localhost:3000
```

- The app will also accept `SUPABASE_DB_URL` as an alternative to `DATABASE_URL`.

4. Prepare the database

- Recommended: run Alembic migrations (from the `backend/` directory):

```powershell
alembic upgrade head
```

- As a quick fallback (not recommended for production), you can run a script that uses SQLAlchemy metadata to create tables:

```powershell
python -c "from db import create_tables; create_tables(); print('tables created')"
```

5. Ensure ML artefacts exist

- The backend expects two artefacts inside `backend/ml-models/`:
  - `fraud_model.pkl`
  - `scaler.pkl`

If those files are missing, `load_models()` will raise FileNotFoundError at startup and inference endpoints will return 500.

6. Run the app (development)

From the `backend/` directory:

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Or equivalently:

```powershell
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Visit `http://127.0.0.1:8000/` to verify the server is running.

7. Useful maintenance commands

- Test DB connectivity

```powershell
python check_db.py
```

- Run the test suite

```powershell
pytest
```

## Environment variables reference

- `DATABASE_URL` / `SUPABASE_DB_URL` — SQLAlchemy DB URL (Postgres expected in production).
- `ALLOWED_ORIGINS` — comma-separated origins for CORS (default: `http://localhost:3000`).
- `STRIPE_SECRET_KEY` — Stripe secret API key (e.g. `sk_test_...`).
- `STRIPE_WEBHOOK_SECRET` — webhook signing secret for `/api/v1/webhook/stripe` (e.g. `whsec_...`).
- `STRIPE_PRICE_ID` — recurring price ID used for checkout (e.g. `price_...`).
- `STRIPE_SUCCESS_URL` — URL to redirect after successful checkout.
- `STRIPE_CANCEL_URL` — URL to redirect when checkout is canceled.

## Notes
- The FastAPI `lifespan` hook loads ML models at startup. If models are absent the server will still start but inference endpoints may fail.
- Alembic reads `DATABASE_URL` from the environment via `alembic/env.py`.
- For local development it's convenient to put variables in `backend/.env` (the code loads this file as a fallback).

If you want, I can also:
- Add a sample `.env.example` file
- Add a `Makefile` or `invoke` tasks for common commands
