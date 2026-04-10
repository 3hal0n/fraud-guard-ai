# Fraud Guard AI

![FraudGuard AI dashboard screenshot](snippets/dashboard.png)

Lightweight fraud detection platform combining a Python backend, ML models, and a Next.js frontend dashboard.

**Quick overview**
- **Backend:** Python FastAPI app providing prediction endpoints and webhook handling (see `backend/`).
- **Frontend:** Next.js app with dashboard, analysis, billing, bulk-audit and history pages (see `frontend/`).
- **ML models:** Stored under `ml-models/` with utilities in `backend/`.
- **Tests & scripts:** Tests live in `tests/`. Example scripts and sample data in `scripts/`.

**New Features (2026-04-02)**
- Dashboard pages: `analyze`, `api-hub`, `billing`, `bulk-audit`, and `history` for operational workflows.
- Backend prediction endpoint and a dedicated Stripe webhook quickstart for billing events.
- Bulk audit tooling and sample CSV (`scripts/fraud_test.csv`) for offline analysis.
- Project docs expanded: see `docs/TechnicalArchitecture.md` and `docs/Phases.md`.
- Basic test coverage added under `tests/` with a test harness in `tests/conftest.py`.

## Getting started

1. Backend (Python):

	 - Create a virtual environment and activate it.
	 - Install dependencies:

		 ```powershell
		 cd backend
		 python -m venv .venv
		 .\.venv\\Scripts\\Activate.ps1
		 pip install -r requirements.txt
		 ```

	 - Run the API:

		 ```powershell
		 uvicorn main:app --reload
		 ```

2. Frontend (Next.js):

	 - From project root:

		 ```bash
		 cd frontend
		 npm install
		 npm run dev
		 ```

3. Tests:

	 - From the project root run the test suite (uses pytest):

		 ```bash
		 pytest -q
		 ```

	---

	### Tech Stack

	- ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
	- ![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
	- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white)
	- ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
	- ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)

	### Robustness testing (high level)

	We perform controlled adversarial simulations to validate model robustness and reduce false positives. These tests replay high-volume, synthetic traffic across diverse IP ranges and payload shapes during isolated test windows. The goal is to exercise edge cases (rate spikes, unusual geo-distribution, malformed payloads) and measure detection thresholds, latency, and alerting behavior. All testing is performed in a controlled, ethical environment with monitoring and rollback; no production data is exposed.

	### Running locally (expanded)

	Prerequisites: Python 3.10+, Node.js 18+, PostgreSQL (or use a hosted DB), and `npm`.

	1) Backend

	```powershell
	cd backend
	python -m venv .venv
	.\.venv\Scripts\Activate.ps1
	pip install -r requirements.txt
	# configure local env (example .env):
	# DATABASE_URL=postgresql://user:pass@localhost:5432/postgres
	# STRIPE_SECRET_KEY=sk_test_...
	# STRIPE_WEBHOOK_SECRET=whsec_...
	alembic upgrade head
	# run in dev mode:
	uvicorn main:app --reload --host 0.0.0.0 --port 8000
	```

	2) Frontend

	```bash
	cd frontend
	npm install
	# point the frontend to the local backend in .env.local
	# NEXT_PUBLIC_API_URL=http://localhost:8000
	npm run dev
	```

	3) Notes
	- Use Render/Vercel dashboards to store production secrets (do NOT commit them to git).
	- To run the backend in production mode locally, use the `gunicorn` start command used on Render:

	```bash
	gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
	```

	---

© 2026 Shalon Fernando. All Rights Reserved.