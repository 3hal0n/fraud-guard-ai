"""
predict.py – ML inference bridge for FraudGuard AI.

Bridges the gap between the human-readable frontend payload
    { amount, merchant, location, time }
and the 30-feature XGBoost model trained on the Kaggle Credit Card Fraud
dataset (columns: Time, V1–V28, Amount).

Workflow
--------
1.  load_models()           – called once from the FastAPI lifespan startup hook.
2.  time_to_seconds()       – converts "2026-02-26 13:13" → seconds since midnight.
3.  simulate_v_features()   – deterministic, hash-seeded V1–V28 in [-2.0, 2.0].
4.  predict_fraud()         – assembles the 30-col DataFrame, scales, and infers.
"""

from __future__ import annotations

import hashlib
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd

logger = logging.getLogger("fraudguard")

# ---------------------------------------------------------------------------
# Column order exactly matching the model's training data
# ---------------------------------------------------------------------------
FEATURE_COLUMNS: list[str] = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]

# ---------------------------------------------------------------------------
# Module-level singletons – populated once by load_models()
# ---------------------------------------------------------------------------
MODEL = None   # XGBoost (or any sklearn-compatible) classifier
SCALER = None  # sklearn StandardScaler (or similar)


# ---------------------------------------------------------------------------
# Public: called once from FastAPI lifespan
# ---------------------------------------------------------------------------

def load_models() -> None:
    """Load .pkl artefacts into module-level singletons.

    Raises FileNotFoundError if either .pkl is missing so the application
    fails fast at startup rather than silently at request-time.
    """
    global MODEL, SCALER

    base = Path(__file__).parent / "ml-models"
    model_path = base / "fraud_model.pkl"
    scaler_path = base / "scaler.pkl"

    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")
    if not scaler_path.exists():
        raise FileNotFoundError(f"Scaler not found: {scaler_path}")

    import joblib  # lazy import – not needed at module parse time

    MODEL = joblib.load(model_path)
    SCALER = joblib.load(scaler_path)

    logger.info(
        "ML artefacts loaded — model: %s | scaler n_features_in_: %s",
        type(MODEL).__name__,
        getattr(SCALER, "n_features_in_", "unknown"),
    )


# ---------------------------------------------------------------------------
# Helper: time string → seconds since midnight (the "Time" feature)
# ---------------------------------------------------------------------------

def time_to_seconds_since_midnight(time_str: Optional[str]) -> float:
    """Convert a human-readable time string to seconds since midnight.

    Accepted formats (examples):
      * "2026-02-26 13:13"    → 47580.0
      * "2026-02-26 13:13:45" → 47625.0
      * "13:13"               → 47580.0
      * None / ""             → 0.0
    """
    if not time_str:
        return 0.0

    # Try ISO-style datetime first (most common from frontend)
    try:
        dt = datetime.fromisoformat(time_str.strip())
        return float(dt.hour * 3600 + dt.minute * 60 + dt.second)
    except ValueError:
        pass

    # Fall back: extract the last whitespace-separated token as HH:MM[:SS]
    try:
        t_part = time_str.strip().split()[-1]
        segments = t_part.split(":")
        h = int(segments[0])
        m = int(segments[1]) if len(segments) > 1 else 0
        s = int(segments[2]) if len(segments) > 2 else 0
        return float(h * 3600 + m * 60 + s)
    except Exception:
        logger.warning("Could not parse time string %r – defaulting to 0.0", time_str)
        return 0.0


# ---------------------------------------------------------------------------
# Helper: deterministic V1–V28 simulation
# ---------------------------------------------------------------------------

def simulate_v_features(merchant: str, location: str) -> np.ndarray:
    """Generate a deterministic 28-element array of floats in [-2.0, 2.0].

    The same (merchant, location) pair always produces the same vector,
    mimicking stable PCA-projected features without a real PCA pipeline.

    Algorithm:
      1. Lowercase + strip both strings, join with "|".
      2. MD5-hash the UTF-8 bytes → 32-char hex digest.
      3. Interpret the full 128-bit digest as an integer, mod 2^32 for the seed.
      4. Seed NumPy's legacy RandomState and draw 28 uniform floats.
    """
    seed_str = f"{merchant.lower().strip()}|{location.lower().strip()}"
    hash_hex = hashlib.md5(seed_str.encode("utf-8")).hexdigest()
    seed = int(hash_hex, 16) % (2**32)   # keep within np.random.RandomState range
    rng = np.random.RandomState(seed)
    return rng.uniform(-2.0, 2.0, size=28)


# ---------------------------------------------------------------------------
# Internal: apply scaler defensively, handling different training configs
# ---------------------------------------------------------------------------

def _apply_scaler(
    time_float: float,
    amount: float,
    v_features: np.ndarray,
) -> tuple[float, float]:
    """Return (scaled_time, scaled_amount) using the loaded SCALER.

    Handles two common training configurations:
      • n_features_in_ == 2  →  scaler was fit on [Time, Amount] only.
      • n_features_in_ == 30 →  scaler was fit on the full 30-feature vector;
                                 pass all 30 and extract scaled Time / Amount.

    Falls back to raw unscaled values if transformation raises.
    """
    try:
        n = getattr(SCALER, "n_features_in_", 2)

        if n == 2:
            arr = np.array([[time_float, float(amount)]])
            scaled = SCALER.transform(arr)
            return float(scaled[0, 0]), float(scaled[0, 1])

        # n == 30: build full row and extract positions 0 (Time) and -1 (Amount)
        full_row = np.array([[time_float] + v_features.tolist() + [float(amount)]])
        scaled = SCALER.transform(full_row)
        return float(scaled[0, 0]), float(scaled[0, -1])

    except Exception as exc:
        logger.warning("SCALER.transform failed (%s) – using raw values", exc)
        return time_float, float(amount)


# ---------------------------------------------------------------------------
# Heuristic: rules-based scoring as a floor for the ML output
# ---------------------------------------------------------------------------

_HIGH_RISK_LOCATIONS = [
    "russia", "iran", "north korea", "nigeria", "belarus", "syria",
    "myanmar", "cuba", "venezuela", "offshore", "international",
    "unknown", "vpn", "proxy", "tor",
]

_HIGH_RISK_MERCHANTS = [
    "crypto", "casino", "gambling", "forex", "binary option",
    "suspicious", "unknown",
]


def _heuristic_score(amount: float, merchant: str, location: str, time_str: str) -> int:
    """Rule-based risk score (0-100) grounded in the actual input values.

    Used as a floor so that obviously suspicious transactions are never
    mis-classified as safe by the ML model.
    """
    score = 0
    loc = location.lower().strip()
    merch = merchant.lower().strip()

    # ── Geographic risk ─────────────────────────────────────────────────────
    if any(kw in loc for kw in _HIGH_RISK_LOCATIONS):
        score += 45

    # ── Merchant / category risk ─────────────────────────────────────────────
    if any(kw in merch for kw in _HIGH_RISK_MERCHANTS):
        score += 25

    # ── Transaction amount ───────────────────────────────────────────────────
    if amount > 100_000:
        score += 40
    elif amount > 10_000:
        score += 25
    elif amount > 2_000:
        score += 10

    # ── Off-hours (midnight – 5 am local) ───────────────────────────────────
    t = time_to_seconds_since_midnight(time_str)
    if 0 <= t < 18_000:   # 0 – 5 h
        score += 10

    return max(0, min(100, score))


# ---------------------------------------------------------------------------
# Public: main inference entry point
# ---------------------------------------------------------------------------

def predict_fraud(
    amount: float,
    merchant: str,
    location: str = "",
    time_str: str = "",
) -> tuple[int, bool]:
    """Run fraud inference for a single transaction.

    Parameters
    ----------
    amount   : Transaction amount (e.g. 1250.00).
    merchant : Merchant name / category string (e.g. "Retail").
    location : Location string (e.g. "192.168.1.1" or "New York, NY").
    time_str : ISO-like datetime or time string (e.g. "2026-02-26 13:13").

    Returns
    -------
    (risk_score, is_fraud)
      risk_score : int in [0, 100] — probability of fraud × 100, clamped.
      is_fraud   : bool — True when fraud probability >= 0.50.

    Raises
    ------
    RuntimeError if load_models() has not been called yet.
    """
    if MODEL is None or SCALER is None:
        raise RuntimeError(
            "ML models are not loaded. "
            "Ensure load_models() is called during application startup."
        )

    # 1. Convert time string → seconds since midnight (the "Time" column)
    time_float = time_to_seconds_since_midnight(time_str)

    # 2. Simulate deterministic V1–V28 from merchant + location hash
    v_features = simulate_v_features(merchant, location)

    # 3. Scale Time and Amount using the loaded scaler
    scaled_time, scaled_amount = _apply_scaler(time_float, float(amount), v_features)

    # 4. Build 30-column DataFrame in exact training column order
    row_values = [scaled_time] + v_features.tolist() + [scaled_amount]
    df = pd.DataFrame([row_values], columns=FEATURE_COLUMNS)

    # 5. Inference: predict_proba returns shape (1, 2) → [P(legit), P(fraud)]
    proba = MODEL.predict_proba(df)[0]
    fraud_prob = float(proba[1])
    ml_score = max(0, min(100, round(fraud_prob * 100)))

    # 6. Heuristic floor — ensures real-world suspicious inputs are never
    #    silently cleared by a model that was trained on PCA-obfuscated features.
    heuristic = _heuristic_score(float(amount), merchant, location, time_str)
    risk_score = max(ml_score, heuristic)
    is_fraud = risk_score >= 50

    logger.debug(
        "predict_fraud | amount=%.2f merchant=%r → ml=%d heuristic=%d final=%d",
        amount,
        merchant,
        ml_score,
        heuristic,
        risk_score,
    )

    return risk_score, is_fraud
