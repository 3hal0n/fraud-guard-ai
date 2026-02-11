from pathlib import Path
import os

_MODEL = None
_SCALER = None
_MODEL_LOADED = False


def _load_model():
    """Attempt to load model and scaler from ../ml-models.
    If loading fails, leave globals as None and return.
    """
    global _MODEL, _SCALER, _MODEL_LOADED
    if _MODEL_LOADED:
        return
    _MODEL_LOADED = True
    try:
        import joblib
        base = Path(__file__).parent
        model_path = base / "ml-models" / "fraud_model.pkl"
        scaler_path = base / "ml-models" / "scaler.pkl"
        if model_path.exists():
            _MODEL = joblib.load(model_path)
        if scaler_path.exists():
            _SCALER = joblib.load(scaler_path)
    except Exception:
        # silently ignore and keep heuristic fallback
        _MODEL = None
        _SCALER = None


def predict_fraud(txn: dict) -> tuple:
    """
    Predict using a persisted ML model when available, otherwise use a simple
    heuristic. Returns: (risk_score:int 0-100, status: 'risk'|'safe')
    """
    # Try model first
    try:
        _load_model()
        if _MODEL is not None:
            try:
                import numpy as np
                # Build a minimal feature vector. Models may expect different
                # features; we attempt a safe, minimal prediction and fall
                # back if it fails.
                amount = float(txn.get("amount") or 0)
                X = np.array([[amount]], dtype=float)
                if _SCALER is not None:
                    X = _SCALER.transform(X)
                if hasattr(_MODEL, "predict_proba"):
                    prob = _MODEL.predict_proba(X)[0]
                    # take positive-class probability if shape fits
                    score = int(prob[-1] * 100)
                else:
                    pred = _MODEL.predict(X)[0]
                    # If model outputs 0/1, scale to 0-100
                    score = int(pred * 100) if isinstance(pred, (int, float)) else 0
                score = max(0, min(100, int(score)))
                status = "risk" if score >= 50 else "safe"
                return score, status
            except Exception:
                # fall back to heuristic below
                pass
    except Exception:
        pass

    # --- Heuristic fallback ---
    try:
        amount = float(txn.get("amount") or 0)
    except Exception:
        amount = 0

    merchant = (txn.get("merchant") or "").lower()
    location = (txn.get("location") or "").lower()

    score = 0

    # Heuristics
    if amount > 1000:
        # scale the amount above 1000 into a portion of score
        score += min(60, (amount - 1000) / 10)

    if "unknown" in merchant or "unknown" in location:
        score += 25

    if merchant in ["crypto exchange", "suspicious vendor"]:
        score += 30

    # clamp and round
    score = max(0, min(100, int(score)))
    status = "risk" if score >= 50 else "safe"
    return score, status
