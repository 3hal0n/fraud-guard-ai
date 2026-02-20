import os
from pathlib import Path
import re
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

def _load_local_env(env_path: str = None):
    """Attempt to load a simple .env-style file into os.environ.
    Supports lines like `KEY=VALUE` and allows spaces around `=`.
    Ignores lines starting with `#` or `//`.
    This is a lightweight fallback so developers can run scripts locally without exporting env vars.
    """
    if env_path is None:
        env_path = Path(__file__).parent / ".env"
    p = Path(env_path)
    if not p.exists():
        return
    pattern = re.compile(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$")
    try:
        for raw in p.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or line.startswith("//"):
                continue
            m = pattern.match(line)
            if not m:
                continue
            k = m.group(1)
            v = m.group(2).strip()
            # remove surrounding quotes if present
            if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
                v = v[1:-1]
            # do not override existing environment variables
            if k not in os.environ:
                os.environ[k] = v
    except Exception:
        # best-effort only; nothing to do on failure
        return


# ensure local .env is loaded as a fallback for local dev runs
_load_local_env()

DATABASE_URL = os.environ.get("DATABASE_URL") or os.environ.get("SUPABASE_DB_URL")
if not DATABASE_URL:
    # leave engine None; caller should handle missing config
    engine = None
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    plan = Column(String, default="FREE")
    daily_usage = Column(Integer, default=0)


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    amount = Column(Float, nullable=False)
    risk_score = Column(Integer, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


def create_tables():
    if engine is None:
        return
    Base.metadata.create_all(bind=engine)


def get_user(db, user_id: str):
    return db.query(User).filter(User.id == user_id).first()


def increment_usage(db, user: User, amount: int = 1):
    user.daily_usage = (user.daily_usage or 0) + amount
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def save_transaction(db, tx_id: str, user_id: str | None, amount: float, risk_score: int):
    tx = Transaction(id=tx_id, user_id=user_id, amount=amount, risk_score=risk_score, timestamp=datetime.utcnow())
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


def create_user_if_not_exists(db, user_id: str, email: str | None = None, plan: str = "FREE"):
    user = get_user(db, user_id)
    if user:
        # update email if provided
        if email and user.email != email:
            user.email = email
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    # create new user
    new = User(id=user_id, email=email, plan=(plan or "FREE"), daily_usage=0)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


def reset_daily_usage_all(db):
    """Set daily_usage to 0 for all users."""
    db.query(User).update({User.daily_usage: 0})
    db.commit()
