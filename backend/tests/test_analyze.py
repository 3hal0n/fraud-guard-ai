import os
import json
import pytest
from fastapi.testclient import TestClient


def setup_module(module):
    # use SQLite in-memory for tests
    os.environ["DATABASE_URL"] = "sqlite:///:memory:"
    # create tables for in-memory SQLite
    _ensure_backend_on_path()
    from db import create_tables
    create_tables()


def _ensure_backend_on_path():
    import sys, os
    here = os.path.dirname(__file__)
    backend_dir = os.path.dirname(here)
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)




def test_analyze_no_user(monkeypatch):
    _ensure_backend_on_path()
    from main import app
    client = TestClient(app)

    payload = {"amount": 100.0, "merchant": "Test", "location": "Nowhere"}
    resp = client.post("/api/v1/analyze", json=payload)
    assert resp.status_code == 200
    body = resp.json()
    assert "risk_score" in body and "status" in body


def test_analyze_with_user(monkeypatch):
    _ensure_backend_on_path()
    from main import app
    # create a user first via webhook endpoint
    client = TestClient(app)
    user_payload = {"type": "user.created", "data": {"id": "test-user-1", "email": "a@b.com"}}
    resp = client.post("/api/v1/webhook/clerk", json=user_payload)
    assert resp.status_code == 200

    payload = {"amount": 50.0, "merchant": "Shop", "location": "X", "user_id": "test-user-1"}
    resp = client.post("/api/v1/analyze", json=payload)
    assert resp.status_code == 200
    body = resp.json()
    assert "risk_score" in body
