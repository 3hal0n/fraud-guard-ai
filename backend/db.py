import os
from pathlib import Path
import re
from sqlalchemy import create_engine, Column, Integer, String, Numeric, DateTime, ForeignKey, func, Boolean
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
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

IS_SQLITE = bool(DATABASE_URL and DATABASE_URL.startswith("sqlite"))
DB_SCHEMA = None if IS_SQLITE else "fraudguard"
TX_ID_TYPE = String if IS_SQLITE else PG_UUID(as_uuid=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": DB_SCHEMA} if DB_SCHEMA else {}
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    plan = Column(String, default="FREE")
    daily_usage = Column(Integer, default=0)
    api_key = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Transaction(Base):
    __tablename__ = "transactions"
    __table_args__ = {"schema": DB_SCHEMA} if DB_SCHEMA else {}
    id = Column(TX_ID_TYPE, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id" if IS_SQLITE else "fraudguard.users.id"), nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)
    risk_score = Column(Numeric(5, 4), nullable=False)  # 0-1 float, e.g. 0.9000
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Subscription(Base):
    __tablename__ = "subscriptions"
    __table_args__ = {"schema": DB_SCHEMA} if DB_SCHEMA else {}
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id" if IS_SQLITE else "fraudguard.users.id"), nullable=False, unique=True, index=True)
    stripe_customer_id = Column(String, nullable=True, index=True)
    stripe_subscription_id = Column(String, nullable=True, unique=True, index=True)
    status = Column(String, default="inactive", index=True)
    cancel_at_period_end = Column(Boolean, default=False)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Payment(Base):
    __tablename__ = "payments"
    __table_args__ = {"schema": DB_SCHEMA} if DB_SCHEMA else {}
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id" if IS_SQLITE else "fraudguard.users.id"), nullable=False, index=True)
    stripe_invoice_id = Column(String, nullable=True, unique=True, index=True)
    stripe_payment_intent_id = Column(String, nullable=True, index=True)
    amount = Column(Numeric(12, 2), nullable=False, default=0)
    currency = Column(String, nullable=False, default="usd")
    status = Column(String, nullable=False, default="paid", index=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


def create_tables():
    if engine is None:
        return
    Base.metadata.create_all(bind=engine)


def get_user(db, user_id: str):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_api_key(db, api_key: str):
    return db.query(User).filter(User.api_key == api_key).first()


def increment_usage(db, user: User, amount: int = 1):
    user.daily_usage = (user.daily_usage or 0) + amount
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def save_transaction(db, tx_id: str, user_id: str | None, amount: float, risk_score: int):
    # risk_score arrives as 0-100 int; DB column is numeric(5,4) so store as 0-1 float
    score_float = round(risk_score / 100, 4)
    tx = Transaction(id=tx_id, user_id=user_id, amount=amount, risk_score=score_float, created_at=datetime.utcnow())
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
    # Supabase has NOT NULL on email — use a placeholder when none is provided
    effective_email = email or f"{user_id}@placeholder.local"
    # create new user
    new = User(id=user_id, email=effective_email, plan=(plan or "FREE"), daily_usage=0)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


def set_user_api_key(db, user: User, api_key: str):
    user.api_key = api_key
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def set_user_plan(db, user: User, plan: str):
    user.plan = (plan or "FREE").upper()
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def upsert_subscription(
    db,
    user_id: str,
    stripe_customer_id: str | None,
    stripe_subscription_id: str | None,
    status: str,
    current_period_end: datetime | None,
    cancel_at_period_end: bool = False,
):
    sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    if not sub:
        sub = Subscription(user_id=user_id)
    sub.stripe_customer_id = stripe_customer_id or sub.stripe_customer_id
    sub.stripe_subscription_id = stripe_subscription_id or sub.stripe_subscription_id
    sub.status = (status or "inactive").lower()
    sub.current_period_end = current_period_end
    sub.cancel_at_period_end = bool(cancel_at_period_end)
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


def get_subscription_by_user(db, user_id: str):
    return db.query(Subscription).filter(Subscription.user_id == user_id).first()


def get_subscription_by_stripe_subscription_id(db, stripe_subscription_id: str):
    return (
        db.query(Subscription)
        .filter(Subscription.stripe_subscription_id == stripe_subscription_id)
        .first()
    )


def save_or_update_payment(
    db,
    user_id: str,
    amount: float,
    currency: str,
    status: str,
    paid_at: datetime | None,
    stripe_invoice_id: str | None = None,
    stripe_payment_intent_id: str | None = None,
):
    payment = None
    if stripe_invoice_id:
        payment = db.query(Payment).filter(Payment.stripe_invoice_id == stripe_invoice_id).first()
    if not payment:
        payment = Payment(user_id=user_id)

    payment.stripe_invoice_id = stripe_invoice_id
    payment.stripe_payment_intent_id = stripe_payment_intent_id
    payment.amount = round(float(amount or 0), 2)
    payment.currency = (currency or "usd").lower()
    payment.status = (status or "paid").lower()
    payment.paid_at = paid_at
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def get_payment_history(db, user_id: str, limit: int = 20):
    rows = (
        db.query(Payment)
        .filter(Payment.user_id == user_id)
        .order_by(Payment.created_at.desc())
        .limit(limit)
        .all()
    )
    return rows


def get_user_telemetry_counts(db, user_id: str):
    total_scans = db.query(func.count(Transaction.id)).filter(Transaction.user_id == user_id).scalar() or 0
    high_risk_detected = (
        db.query(func.count(Transaction.id))
        .filter(Transaction.user_id == user_id, Transaction.risk_score >= 0.5)
        .scalar()
        or 0
    )
    return {
        "total_scans": int(total_scans),
        "high_risk_detected": int(high_risk_detected),
    }


def reset_daily_usage_all(db):
    """Set daily_usage to 0 for all users."""
    db.query(User).update({User.daily_usage: 0})
    db.commit()
