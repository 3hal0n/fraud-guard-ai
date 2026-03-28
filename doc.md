# FraudGuard API Key Guide (Simple + Secure)

This guide shows the easiest way to test API keys and verify project-based key management.

## What Changed

- API keys are now stored securely (hashed), not in plaintext.
- Every key is tied to a `project_name`.
- You only see the full key once, at creation time.
- You can list keys (metadata only) and revoke keys.

## Security Defaults

1. Keep using Stripe/test mode for payment testing (already configured).
2. Add an app-level pepper for API key hashes in `backend/.env`:

```env
API_KEY_PEPPER=change-this-to-a-long-random-secret
```

3. Restart backend after any `.env` change.

## 1) Generate a Project API Key

Use your PRO user ID in API Hub, enter a project name, and click **Generate API Key**.

Example project names:
- `Fraud Dashboard`
- `CSV Processor`
- `Internal Automation`

You will receive a key like:
- `fg_live_xxxxxxxxxxxxxxxxx...`

Copy it immediately. It is not retrievable later.

## 2) Easiest API Test (PowerShell)

Run this from project root (replace placeholders):

```powershell
$apiKey = "PASTE_GENERATED_KEY"
$body = @{
  amount = 199.99
  merchant = "electronics"
  location = "Austin"
  time = "2026-03-28 14:00"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/api/v1/analyze" `
  -Headers @{ "X-API-Key" = $apiKey; "Content-Type" = "application/json" } `
  -Body $body
```

Expected result:
- HTTP 200
- JSON includes `risk_score` and `status`

## 3) cURL API Test

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: PASTE_GENERATED_KEY" \
  -d '{
    "amount": 199.99,
    "merchant": "electronics",
    "location": "Austin",
    "time": "2026-03-28 14:00"
  }'
```

## 4) List Keys for a User (Metadata Only)

```bash
curl "http://127.0.0.1:8000/api/v1/user/<USER_ID>/api-keys"
```

You should see each key with:
- `id`
- `project_name`
- `key_prefix`
- `is_active`
- `last_used_at`

## 5) Revoke a Key

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/user/<USER_ID>/api-keys/<KEY_ID>/revoke"
```

After revocation, requests with that key should fail with:
- HTTP 401
- `Invalid API key`

## 6) Quick Validation Checklist

- Backend is running on `http://127.0.0.1:8000`
- User is on `PRO` plan
- You used the new key format (`fg_live_...`)
- `API_KEY_PEPPER` is set in `backend/.env`
- Reused revoked key returns 401 (good)

## Notes

- Existing old UUID-like keys may still work temporarily for backward compatibility.
- Best practice: generate new project-named keys and revoke old keys.
