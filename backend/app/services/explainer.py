from __future__ import annotations

from collections import OrderedDict
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import shap

import predict


_EXPLAINER: shap.TreeExplainer | None = None
_EXPLAINER_MODEL_ID: int | None = None

_FEATURE_LABELS = {
    "Time": "Transaction timing",
    "Amount": "Transaction amount",
    "V1": "Cardholder behavior drift",
    "V2": "Cardholder behavior drift",
    "V3": "Device/session irregularity",
    "V4": "Device/session irregularity",
    "V5": "Transaction velocity spike",
    "V6": "Transaction velocity spike",
    "V7": "Geographic anomaly",
    "V8": "Geographic anomaly",
    "V9": "Merchant category shift",
    "V10": "Merchant category shift",
    "V11": "Temporal pattern outlier",
    "V12": "Merchant/Location Inconsistency",
    "V13": "Temporal pattern outlier",
    "V14": "Merchant/Location Inconsistency",
    "V15": "Channel mismatch",
    "V16": "Channel mismatch",
    "V17": "Spending profile deviation",
    "V18": "Spending profile deviation",
    "V19": "Location/merchant mismatch",
    "V20": "Location/merchant mismatch",
    "V21": "Sequence anomaly",
    "V22": "Sequence anomaly",
    "V23": "Residual fraud signal",
    "V24": "Residual fraud signal",
    "V25": "Behavioral outlier",
    "V26": "Behavioral outlier",
    "V27": "Composite fraud signature",
    "V28": "Composite fraud signature",
}


def _get_model():
    if predict.MODEL is None or predict.SCALER is None:
        predict.load_models()

    if predict.MODEL is None:
        raise RuntimeError("FraudGuard model is not available for explanations")

    return predict.MODEL


def _get_explainer() -> shap.TreeExplainer:
    global _EXPLAINER, _EXPLAINER_MODEL_ID

    model = _get_model()
    model_id = id(model)
    if _EXPLAINER is None or _EXPLAINER_MODEL_ID != model_id:
        _EXPLAINER = shap.TreeExplainer(model)
        _EXPLAINER_MODEL_ID = model_id

    return _EXPLAINER


def build_prediction_input(
    amount: float,
    merchant: str,
    location: str = "",
    time_str: str = "",
) -> pd.DataFrame:
    time_float = predict.time_to_seconds_since_midnight(time_str)
    v_features = predict.simulate_v_features(merchant, location)
    scaled_time, scaled_amount = predict._apply_scaler(time_float, float(amount), v_features)

    row_values = [scaled_time] + v_features.tolist() + [scaled_amount]
    return pd.DataFrame([row_values], columns=predict.FEATURE_COLUMNS)


def _resolve_feature_label(feature_name: str) -> str:
    return _FEATURE_LABELS.get(feature_name, feature_name)


def _extract_shap_row(input_df: pd.DataFrame) -> np.ndarray:
    explainer = _get_explainer()
    shap_values = explainer.shap_values(input_df)

    if isinstance(shap_values, list):
        return np.asarray(shap_values[-1])[0]

    shap_array = np.asarray(shap_values)
    if shap_array.ndim == 3:
        return shap_array[-1][0]

    return shap_array[0]


def get_prediction_explanation(input_df: pd.DataFrame) -> list[dict[str, Any]]:
    if not isinstance(input_df, pd.DataFrame):
        input_df = pd.DataFrame(input_df)

    missing = [feature for feature in predict.FEATURE_COLUMNS if feature not in input_df.columns]
    if missing:
        raise ValueError(f"input_df is missing required feature columns: {', '.join(missing)}")

    ordered_df = input_df.loc[:, predict.FEATURE_COLUMNS].head(1).copy()
    shap_row = _extract_shap_row(ordered_df)

    grouped = OrderedDict()
    for feature_name, contribution in zip(predict.FEATURE_COLUMNS, shap_row):
        label = _resolve_feature_label(feature_name)
        grouped[label] = grouped.get(label, 0.0) + float(contribution)

    ranked = sorted(grouped.items(), key=lambda item: abs(item[1]), reverse=True)[:3]
    return [
        {"feature": label, "contribution": round(float(contribution), 6)}
        for label, contribution in ranked
    ]
