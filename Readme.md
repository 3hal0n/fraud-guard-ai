# Fraud Guard AI

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

## Where to look next
- API routes and prediction logic: `backend/`.
- Frontend pages and components: `frontend/src/app` and `frontend/src/components`.
- Architecture notes: `docs/TechnicalArchitecture.md`.

If you want, I can (a) refine the feature descriptions using recent commits, (b) add badges or CI instructions, or (c) create a changelog file. Which would you prefer?

