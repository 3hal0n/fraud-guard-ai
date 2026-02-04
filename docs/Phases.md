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