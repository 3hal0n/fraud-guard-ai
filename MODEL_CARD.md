# FraudGuard AI — Model Card

## Overview

Model: XGBoost gradient-boosted decision trees (GBDT) used for transaction fraud scoring. The model outputs a continuous risk score (0.0–1.0) which the system maps to human-friendly statuses (`APPROVED`, `PENDING_REVIEW`, `BLOCK_TRANSACTION`) via configurable thresholds in the rules engine.

Purpose: real-time transaction risk scoring for the FraudGuard AI dashboard and API.

Model versioning: models are stored under `backend/ml-models/` with semantic version tags and a timestamped artifact name. Update `ml-models/MODEL_VERSION` on training.

---

## Architecture

- Algorithm: XGBoost (tree booster), trained with binary logistic objective and probability outputs.
- Implementation: `xgboost` Python package (CPU-optimized). Inference uses the saved booster and XGBoost's fast native predict API.
- Key hyperparameters (example): `n_estimators=500`, `max_depth=6`, `learning_rate=0.05`, `subsample=0.8`, `colsample_bytree=0.6`, early stopping on validation AUC.

---

## Feature Engineering

Input features are numeric, categorical (one-hot/target-encoded), and engineered aggregations. Typical pipeline steps:

- Basic fields: `amount`, `merchant`, `category`, `location`, `time`, `user_id` (from frontend payload).
- Temporal features: `hour_of_day`, `day_of_week`, `is_weekend`, `time_since_last_txn_user` (sec).
- Aggregates (user-level): `user_avg_amount_24h`, `user_txn_count_24h`, `user_unique_merchants_30d`.
- Location-derived: `geo_country`, `geo_region`, `distance_from_home_km` (Haversine to user home coordinates when available), `is_location_unusual` (binary based on historical locations).
- Behavior signals: `device_fingerprint_score`, `ip_reputation_score`, `velocity_score` (requests/sec from same user/IP).
- Encoding: categorical fields use frequency / target encoding with smoothing to avoid leakage. Missing data handled with sentinel values and explicit missingness indicators.

Feature normalization and encoding occur at training time and the transformers (encoders, scalers) are persisted alongside the model artifact.

---

## Training Data

- Source: historical transaction logs from instrumented environments (sanitized) and synthetic/annotated cases used to balance rare fraud classes.
- Period: training uses a rolling window (e.g., last 24 months), with explicit holdout by time (temporal split) to reduce target leakage.
- Labels: `fraud` vs `non-fraud` derived from confirmed chargebacks, manual investigations, and business rules. Label quality logged and tracked.
- Class imbalance handling: class-weighting and oversampling (SMOTE or targeted upsampling) applied on training fold when appropriate.

Data governance: all PII must be removed before training. Any customer-identifying fields are hashed or aggregated.

---

## Training Procedure & Evaluation

- Split: chronological train / validation / test split (e.g., 70/15/15 rolling by time). Validation used for early stopping and hyperparameter tuning (Bayesian or grid search).
- Metrics: primary metric AUC-ROC; secondary metrics are precision@k, recall, F1, calibration (Brier score), and confusion-matrix-derived business KPIs (false-positive cost vs false-negative cost).
- Calibration: when necessary we apply isotonic or Platt calibration on validation to improve probability estimates.
- Threshold selection: business thresholds (review/block) are chosen by trading sensitivity and specificity on validation/test set and encoded in the rules engine defaults.

---

## Explainability — SHAP

- SHAP explainer: We use `shap.TreeExplainer` on the trained XGBoost booster to compute per-sample additive feature attributions (SHAP values).
- For each scored transaction the system computes:
  - Local SHAP values for the top N contributing features (by absolute SHAP value).
  - A normalized contribution list presented as `risk_factors` in the API response: [{feature, contribution, direction}].
  - Aggregate dashboards: feature importance (mean(|SHAP|)), average effect, and distribution plots stored for auditing and monitoring.

How SHAP powers the dashboard:
- The dashboard shows the top 3-5 `risk_factors` per transaction, using SHAP sign to indicate increasing vs decreasing risk.
- Team-facing diagnostics use SHAP summaries to identify feature drift, concept shift, and emerging attack vectors.
- For large-batch scoring we compute SHAP only for sampled records or for records above a risk threshold to limit cost.

Robustness: SHAP computations run deterministically using the stored model and transformer pipeline; versions are recorded and displayed in the UI for traceability.

---

## Limitations & Recommendations

- XGBoost provides strong tabular performance but can be sensitive to covariate shift; implement monitoring for feature distributions and periodic retraining.
- SHAP explanations reflect the model's behavior, not causal effects. Use SHAP as a diagnostic and combine with business rules for final actions.
- For privacy, avoid sending raw PII to the explainability pipeline; compute attributions on hashed/aggregated features where possible.

## Contact & Reproducibility

Training scripts, hyperparameter config, and model artifacts are under `backend/ml-models/` and `backend/` training utilities. For reproduction, run the `train.py` script (if present) with a sanitized dataset and the same preprocessing pipeline.

If you want, I can add a short `TRAINING_README.md` with exact commands, dependency pinning, and a reproducible conda/pip environment.