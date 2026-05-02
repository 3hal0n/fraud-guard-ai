"""Tests for the Stripe checkout flow used by the billing page."""

import sys
import types

from fastapi.testclient import TestClient

# main.py imports the explainer module, which imports shap. The local test
# environment does not always have shap installed, so stub the minimal surface
# needed for module import before loading the app.
sys.modules.setdefault(
    "shap",
    types.SimpleNamespace(TreeExplainer=type("TreeExplainer", (), {})),
)

import main


client = TestClient(main.app)


class FakeStripeClient:
    api_key = None

    class Price:
        @staticmethod
        def retrieve(price_id):
            return {"id": price_id, "recurring": {"interval": "month"}}

    class checkout:
        class Session:
            @staticmethod
            def create(**kwargs):
                return {"url": "https://checkout.stripe.test/session"}


def test_create_checkout_session_uses_checkout_creation(monkeypatch):
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_123")
    monkeypatch.setenv("STRIPE_PRICE_ID", "price_123")
    monkeypatch.setattr(main, "stripe", FakeStripeClient)

    client.post(
        "/api/v1/webhook/clerk",
        json={"type": "user.created", "data": {"id": "billing-checkout-user", "email": "billing@example.com"}},
    )

    response = client.post(
        "/api/v1/create-checkout-session",
        json={"user_id": "billing-checkout-user"},
    )

    assert response.status_code == 200, response.text
    assert response.json()["checkout_url"] == "https://checkout.stripe.test/session"


def test_create_checkout_session_returns_stripe_price_error(monkeypatch):
    class MissingPriceStripeClient(FakeStripeClient):
        class Price:
            @staticmethod
            def retrieve(price_id):
                raise RuntimeError("No such price: %s" % price_id)

    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_123")
    monkeypatch.setenv("STRIPE_PRICE_ID", "price_missing")
    monkeypatch.setattr(main, "stripe", MissingPriceStripeClient)

    response = client.post(
        "/api/v1/create-checkout-session",
        json={"user_id": "billing-checkout-user"},
    )

    assert response.status_code == 400, response.text
    assert "No such price" in response.json()["detail"]