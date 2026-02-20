from db import engine
from sqlalchemy import text


def test_connection():
    """Return (True, message) if DB connection and simple query succeed."""
    if engine is None:
        return False, "No DATABASE_URL configured"
    try:
        with engine.connect() as conn:
            # Use SQLAlchemy text() for portable SQL execution
            result = conn.execute(text("SELECT 1"))
            row = result.fetchone()
            if row is None:
                return False, "Query returned no rows"
        return True, "OK"
    except Exception as e:
        return False, str(e)


if __name__ == "__main__":
    ok, msg = test_connection()
    if ok:
        print("DB OK:", msg)
    else:
        print("DB ERROR:", msg)
        raise SystemExit(1)
