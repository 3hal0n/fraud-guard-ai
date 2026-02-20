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
