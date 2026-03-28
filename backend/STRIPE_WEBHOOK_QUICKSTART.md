# Stripe Webhook Quickstart (Local Test Mode)

Purpose: Simple, step-by-step guide to receive Stripe test webhooks locally and verify your app marks a user as PRO.

Prerequisites
- `backend` running locally (Uvicorn): `uvicorn main:app --reload --host 127.0.0.1 --port 8000`
- Stripe account (test mode) and Stripe CLI installed (recommended)
- Your app uses `STRIPE_WEBHOOK_SECRET` from `backend/.env` to validate signatures

Quick flow (one line):
- Start Stripe listener -> copy `whsec_...` -> put into `backend/.env` -> restart backend -> trigger test event -> verify billing.

Steps

1) Install Stripe CLI (Windows PowerShell):
```powershell
choco install stripe
# or download from https://stripe.com/docs/stripe-cli
stripe login
```

2) Start a forwarder that sends Stripe events to your local webhook endpoint:
```bash
stripe listen --forward-to http://127.0.0.1:8000/api/v1/webhook/stripe
```
- The CLI prints a signing secret that looks like `whsec_XXXXXXXXXXXXXXXX` — copy it.

3) Add the signing secret to `backend/.env`:

Open `backend/.env` and add or update this line:

```
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXX
```

Save the file.

4) Restart your backend (stop and start Uvicorn). Example (PowerShell):
```powershell
# stop the running uvicorn process (Ctrl+C in that terminal)
# then start it again from backend folder
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

5) Trigger a test event (in another terminal):
```bash
stripe trigger checkout.session.completed
```
- The CLI will create the event objects and forward the webhook to your local endpoint.

6) Verify processing and billing update
- Watch backend logs in the Uvicorn terminal: you should see a `POST /api/v1/webhook/stripe` and processing messages (no signature errors).
- Check billing endpoint (replace `<USER_ID>` with the Clerk/your test user id):
```bash
curl http://127.0.0.1:8000/api/v1/billing/<USER_ID>
```
Response should show `plan: "pro"` and a payment history row.

Alternatives if you can't use Stripe CLI
- Use Stripe Dashboard: find the relevant event (`checkout.session.completed`) and click "Replay" or "Send test webhook" to your publicly reachable URL.
- Expose local server with `ngrok` and add a webhook endpoint in Stripe Dashboard:
```bash
ngrok http 8000
# take the https://... url and add: https://xxxx.ngrok.io/api/v1/webhook/stripe
```

Dev-only unsigned-webhook bypass (optional)
- If you want to skip signature checks for fast local mocks, I can add a dev-only bypass that accepts webhooks without verifying `whsec_...`. This is insecure and must never be used in production. Ask me and I'll add it.

Troubleshooting
- "Signature verification failed": your `STRIPE_WEBHOOK_SECRET` is wrong or missing. Re-run `stripe listen` and copy the `whsec_...` from the same terminal session.
- "No delivery attempts" in Dashboard: your CLI must be running or your endpoint must be public. Use `stripe listen` or `ngrok` to make it reachable.
- Wrong URL/port: confirm your app is listening on `127.0.0.1:8000` and webhook path is `/api/v1/webhook/stripe`.
- If you see other exceptions in backend logs, copy the stack trace and I can help debug.

Test cards and test mode notes
- Use Stripe test cards (e.g. `4242 4242 4242 4242`) only in test mode.
- Events created with `stripe trigger` are for test mode only and safe for development.

Done — follow these steps and the listener will forward Stripe test events into your local app, allowing billing persistence and UI updates to flip users to PRO.
