"""Integration tests for POST /api/v1/analyze.
Database is patched to in-memory SQLite via conftest.py.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_analyze_no_user():
    """Submission without a user_id should return risk_score and status."""
    resp = client.post("/api/v1/analyze", json={
        "amount": 100.0,
        "merchant": "Test Store",
        "location": "New York",
    })
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert "risk_score" in body
    assert "status" in body
    assert body["status"] in ("risk", "safe")


def test_analyze_high_amount():
    """High amount + unknown merchant should produce a risk status."""
    resp = client.post("/api/v1/analyze", json={
        "amount": 5000.0,
        "merchant": "unknown",
        "location": "Unknown",
    })
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["risk_score"] > 50
    assert body["status"] == "risk"


def test_clerk_webhook_creates_user():
    """POSTing a Clerk user.created event should create a user row."""
    resp = client.post("/api/v1/webhook/clerk", json={
        "type": "user.created",
        "data": {"id": "clerk-test-1", "email": "test@example.com"},
    })
    assert resp.status_code == 200, resp.text
    assert resp.json()["user_id"] == "clerk-test-1"


def test_analyze_with_known_user():
    """Analyze for a known user should succeed and track usage."""
    client.post("/api/v1/webhook/clerk", json={
        "type": "user.created",
        "data": {"id": "clerk-test-2", "email": "user2@example.com"},
    })
    resp = client.post("/api/v1/analyze", json={
        "amount": 50.0,
        "merchant": "Shop",
        "location": "London",
        "user_id": "clerk-test-2",
    })
    assert resp.status_code == 200, resp.text
    assert "risk_score" in resp.json()


def test_analyze_free_limit_exceeded():
    """FREE plan user with daily_usage >= 5 should receive 402."""
    client.post("/api/v1/webhook/clerk", json={
        "type": "user.created",
        "data": {"id": "clerk-limit-user", "email": "limit@example.com"},
    })
    # bump usage to 5 directly via DB
    from db import SessionLocal, get_user
    db = SessionLocal()
    try:
        u = get_user(db, "clerk-limit-user")
        u.daily_usage = 5
        db.add(u)
        db.commit()
    finally:
        db.close()

    resp = client.post("/api/v1/analyze", json={
        "amount": 10.0,
        "merchant": "Any",
        "location": "Anywhere",
        "user_id": "clerk-limit-user",
    })
    assert resp.status_code == 402, resp.text


def test_telemetry_counts():
    client.post("/api/v1/webhook/clerk", json={
        "type": "user.created",
        "data": {"id": "clerk-telemetry-user", "email": "telemetry@example.com"},
    })

    client.post("/api/v1/analyze", json={
        "amount": 45.0,
        "merchant": "grocery",
        "location": "Austin",
        "user_id": "clerk-telemetry-user",
    })
    client.post("/api/v1/analyze", json={
        "amount": 8000.0,
        "merchant": "unknown",
        "location": "Unknown",
        "user_id": "clerk-telemetry-user",
    })

    resp = client.get("/api/v1/telemetry/clerk-telemetry-user")
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["total_scans"] >= 2
    assert body["high_risk_detected"] >= 1


def test_api_key_generation_and_direct_analyze():
    client.post("/api/v1/webhook/clerk", json={
        "type": "user.created",
        "data": {"id": "clerk-api-user", "email": "api@example.com"},
    })

    from db import SessionLocal, get_user
    db = SessionLocal()
    try:
        u = get_user(db, "clerk-api-user")
        u.plan = "PRO"
        db.add(u)
        db.commit()
    finally:
        db.close()

    key_resp = client.post("/api/v1/user/clerk-api-user/api-key")
    assert key_resp.status_code == 200, key_resp.text
    api_key = key_resp.json()["api_key"]
    assert api_key

    analyze_resp = client.post(
        "/api/v1/analyze",
        headers={"X-API-Key": api_key},
        json={
            "amount": 80.0,
            "merchant": "retail",
            "location": "Boston",
            "time": "2026-03-22 11:00",
        },
    )
    assert analyze_resp.status_code == 200, analyze_resp.text
    assert "status" in analyze_resp.json()


def test_api_key_project_name_list_and_revoke_flow():
    client.post("/api/v1/webhook/clerk", json={
        "type": "user.created",
        "data": {"id": "clerk-api-proj-user", "email": "apiproj@example.com"},
    })

    from db import SessionLocal, get_user
    db = SessionLocal()
    try:
        u = get_user(db, "clerk-api-proj-user")
        u.plan = "PRO"
        db.add(u)
        db.commit()
    finally:
        db.close()

    create_resp = client.post(
        "/api/v1/user/clerk-api-proj-user/api-key",
        json={"project_name": "Billing Service"},
    )
    assert create_resp.status_code == 200, create_resp.text
    created = create_resp.json()
    assert created["project_name"] == "Billing Service"
    assert created["api_key"].startswith("fg_live_")
    key_id = created["key_id"]
    raw_key = created["api_key"]

    list_resp = client.get("/api/v1/user/clerk-api-proj-user/api-keys")
    assert list_resp.status_code == 200, list_resp.text
    listed = list_resp.json()["keys"]
    assert any(k["project_name"] == "Billing Service" for k in listed)

    ok_before_revoke = client.post(
        "/api/v1/analyze",
        headers={"X-API-Key": raw_key},
        json={"amount": 40.0, "merchant": "bookstore", "location": "Dallas"},
    )
    assert ok_before_revoke.status_code == 200, ok_before_revoke.text

    revoke_resp = client.post(f"/api/v1/user/clerk-api-proj-user/api-keys/{key_id}/revoke")
    assert revoke_resp.status_code == 200, revoke_resp.text
    assert revoke_resp.json()["revoked"] is True

    denied_after_revoke = client.post(
        "/api/v1/analyze",
        headers={"X-API-Key": raw_key},
        json={"amount": 41.0, "merchant": "bookstore", "location": "Dallas"},
    )
    assert denied_after_revoke.status_code == 401, denied_after_revoke.text


def test_bulk_csv_requires_pro_and_returns_rows():
    client.post("/api/v1/webhook/clerk", json={
        "type": "user.created",
        "data": {"id": "clerk-bulk-user", "email": "bulk@example.com"},
    })

    csv_body = "amount,merchant,location,time\n25.0,coffee,Austin,2026-03-22 09:00\n9000,unknown,Unknown,2026-03-22 02:00\n"

    free_resp = client.post(
        "/api/v1/analyze/bulk-csv",
        files={"file": ("test.csv", csv_body, "text/csv")},
        data={"user_id": "clerk-bulk-user"},
    )
    assert free_resp.status_code == 403, free_resp.text

    from db import SessionLocal, get_user
    db = SessionLocal()
    try:
        u = get_user(db, "clerk-bulk-user")
        u.plan = "PRO"
        db.add(u)
        db.commit()
    finally:
        db.close()

    pro_resp = client.post(
        "/api/v1/analyze/bulk-csv",
        files={"file": ("test.csv", csv_body, "text/csv")},
        data={"user_id": "clerk-bulk-user"},
    )
    assert pro_resp.status_code == 200, pro_resp.text
    body = pro_resp.json()
    assert body["processed_rows"] == 2
    assert any(row["status"] == "risk" for row in body["flagged_rows"])


def test_create_checkout_session_returns_url(monkeypatch):
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_dummy")
    monkeypatch.setenv("STRIPE_PRICE_ID", "price_test_dummy")
    monkeypatch.setenv("STRIPE_SUCCESS_URL", "http://localhost:3000/dashboard/billing?upgrade=success")
    monkeypatch.setenv("STRIPE_CANCEL_URL", "http://localhost:3000/dashboard/billing?upgrade=cancel")

    class _CheckoutSession:
        @staticmethod
        def create(**kwargs):
            assert kwargs["metadata"]["user_id"] == "clerk-stripe-user"
            return {"url": "https://checkout.stripe.test/session_123"}

    class _Checkout:
        Session = _CheckoutSession

    class _Price:
        @staticmethod
        def retrieve(_price_id):
            return {"id": _price_id, "recurring": {"interval": "month"}}

    class _StripeStub:
        api_key = None
        checkout = _Checkout
        Price = _Price

    import main as _main
    monkeypatch.setattr(_main, "stripe", _StripeStub)

    client.post("/api/v1/webhook/clerk", json={
        "type": "user.created",
        "data": {"id": "clerk-stripe-user", "email": "stripe@example.com"},
    })

    resp = client.post("/api/v1/create-checkout-session", json={"user_id": "clerk-stripe-user"})
    assert resp.status_code == 200, resp.text
    assert resp.json()["checkout_url"].startswith("https://")


def test_create_checkout_session_requires_recurring_price(monkeypatch):
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_dummy")
    monkeypatch.setenv("STRIPE_PRICE_ID", "price_test_one_time")

    class _CheckoutSession:
        @staticmethod
        def create(**kwargs):
            return {"url": "https://checkout.stripe.test/session_123"}

    class _Checkout:
        Session = _CheckoutSession

    class _Price:
        @staticmethod
        def retrieve(_price_id):
            return {"id": _price_id, "recurring": None}

    class _StripeStub:
        api_key = None
        checkout = _Checkout
        Price = _Price

    import main as _main
    monkeypatch.setattr(_main, "stripe", _StripeStub)

    client.post(
        "/api/v1/webhook/clerk",
        json={"type": "user.created", "data": {"id": "clerk-nonrecurring-user", "email": "x@example.com"}},
    )

    resp = client.post("/api/v1/create-checkout-session", json={"user_id": "clerk-nonrecurring-user"})
    assert resp.status_code == 400, resp.text


def test_billing_overview_returns_next_payment_and_history(monkeypatch):
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_dummy")
    monkeypatch.setenv("STRIPE_WEBHOOK_SECRET", "whsec_test_dummy")

    class _Webhook:
        @staticmethod
        def construct_event(payload, sig, secret):
            assert sig == "t=1,v1=abc"
            assert secret == "whsec_test_dummy"
            return {
                "type": "checkout.session.completed",
                "data": {
                    "object": {
                        "metadata": {"user_id": "clerk-billing-user"},
                        "subscription": "sub_123",
                        "customer": "cus_123",
                        "amount_total": 2900,
                        "currency": "usd",
                        "invoice": "in_123",
                        "payment_intent": "pi_123",
                    }
                },
            }

    class _Subscription:
        @staticmethod
        def retrieve(_sub_id):
            return {
                "id": "sub_123",
                "status": "active",
                "current_period_end": 1893456000,
                "cancel_at_period_end": False,
            }

    class _StripeStub:
        api_key = None
        Webhook = _Webhook
        Subscription = _Subscription

    import main as _main
    monkeypatch.setattr(_main, "stripe", _StripeStub)

    client.post(
        "/api/v1/webhook/clerk",
        json={"type": "user.created", "data": {"id": "clerk-billing-user", "email": "billing@example.com"}},
    )

    webhook_resp = client.post(
        "/api/v1/webhook/stripe",
        headers={"Stripe-Signature": "t=1,v1=abc", "Content-Type": "application/json"},
        data="{}",
    )
    assert webhook_resp.status_code == 200, webhook_resp.text

    billing_resp = client.get("/api/v1/billing/clerk-billing-user")
    assert billing_resp.status_code == 200, billing_resp.text
    billing = billing_resp.json()
    assert billing["plan"] == "PRO"
    assert billing["subscription"]["next_payment_at"] is not None
    assert len(billing["history"]) >= 1


def test_subscription_deleted_downgrades_plan(monkeypatch):
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_dummy")
    monkeypatch.setenv("STRIPE_WEBHOOK_SECRET", "whsec_test_dummy")

    class _Webhook:
        @staticmethod
        def construct_event(payload, sig, secret):
            assert sig == "t=1,v1=abc"
            assert secret == "whsec_test_dummy"
            return {
                "type": "customer.subscription.deleted",
                "data": {
                    "object": {
                        "id": "sub_delete_123",
                        "status": "canceled",
                        "current_period_end": 1700000000,
                        "cancel_at_period_end": True,
                        "customer": "cus_del_1",
                    }
                },
            }

    class _StripeStub:
        api_key = None
        Webhook = _Webhook

    from db import SessionLocal, create_user_if_not_exists, upsert_subscription, get_user
    db = SessionLocal()
    try:
        u = create_user_if_not_exists(db, "clerk-sub-delete", "delete@example.com", plan="PRO")
        upsert_subscription(
            db,
            user_id=u.id,
            stripe_customer_id="cus_del_1",
            stripe_subscription_id="sub_delete_123",
            status="active",
            current_period_end=None,
        )
    finally:
        db.close()

    import main as _main
    monkeypatch.setattr(_main, "stripe", _StripeStub)

    resp = client.post(
        "/api/v1/webhook/stripe",
        headers={"Stripe-Signature": "t=1,v1=abc", "Content-Type": "application/json"},
        data="{}",
    )
    assert resp.status_code == 200, resp.text

    db = SessionLocal()
    try:
        u = get_user(db, "clerk-sub-delete")
        assert (u.plan or "").upper() == "FREE"
    finally:
        db.close()


def test_stripe_webhook_checkout_completed_upgrades_user(monkeypatch):
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_dummy")
    monkeypatch.setenv("STRIPE_WEBHOOK_SECRET", "whsec_test_dummy")

    class _Webhook:
        @staticmethod
        def construct_event(payload, sig, secret):
            assert sig == "t=1,v1=abc"
            assert secret == "whsec_test_dummy"
            return {
                "type": "checkout.session.completed",
                "data": {
                    "object": {
                        "metadata": {"user_id": "clerk-webhook-user"},
                    }
                },
            }

    class _StripeStub:
        api_key = None
        Webhook = _Webhook

        class error:
            class SignatureVerificationError(Exception):
                pass

    import main as _main
    monkeypatch.setattr(_main, "stripe", _StripeStub)

    client.post("/api/v1/webhook/clerk", json={
        "type": "user.created",
        "data": {"id": "clerk-webhook-user", "email": "webhook@example.com"},
    })

    resp = client.post(
        "/api/v1/webhook/stripe",
        headers={"Stripe-Signature": "t=1,v1=abc", "Content-Type": "application/json"},
        data="{}",
    )
    assert resp.status_code == 200, resp.text

    from db import SessionLocal, get_user
    db = SessionLocal()
    try:
        u = get_user(db, "clerk-webhook-user")
        assert (u.plan or "").upper() == "PRO"
    finally:
        db.close()
