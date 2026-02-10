def predict_fraud(txn: dict) -> tuple:
    """
    Simple heuristic predictor for demo purposes.
    Returns: (risk_score:int 0-100, status: 'risk'|'safe')
    """
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
