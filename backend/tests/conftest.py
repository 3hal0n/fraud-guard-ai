"""
conftest.py — sets up an in-memory SQLite engine for all tests BEFORE main.py is imported.
This must run before any import of `db` or `main` so the module-level engine is patched.
"""
import os
import sys

# Ensure backend dir is importable
_BACKEND = os.path.dirname(os.path.dirname(__file__))
if _BACKEND not in sys.path:
    sys.path.insert(0, _BACKEND)

# Override DATABASE_URL BEFORE db.py module is loaded
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

# Now import db and forcibly replace the engine + session with SQLite
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import db as _db

# StaticPool ensures all sessions share the SAME in-memory connection
# so tables created here are visible to all subsequent queries in tests.
_sqlite_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Patch module globals so every import of db sees SQLite
_db.engine = _sqlite_engine
_db.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_sqlite_engine)

# Create all tables in the in-memory DB
_db.Base.metadata.create_all(bind=_sqlite_engine)
