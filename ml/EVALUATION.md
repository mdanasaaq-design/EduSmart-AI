# EduSmart AI — Synthetic Holdout Evaluation

**Evaluation date:** 2026-10-18  
**Training/evaluation script:** `ml/train_model.py`  
**Dataset:** 1,200 synthetic records generated with seed 42  
**Split:** 80% training (960 records), 20% holdout (240 records), stratified; `random_state=42`  
**Model:** `RandomForestClassifier`, 40 trees, `max_depth=6`, `min_samples_leaf=4`, `random_state=42`  
**Pinned Python dependencies:** NumPy 2.3.5, scikit-learn 1.8.0  
**Browser artifact:** the same 40 exported trees are stored in `ml/model.json` and `frontend/public/model.json`.

## Important interpretation

The class mapping is internally consistent: numeric class 0 = Low risk (stronger performance indicators), class 1 = Medium risk, and class 2 = High risk (poorer performance indicators). Deterministic tests verify this mapping and the browser's class-index interpretation.

The training script now reports two distinct metrics:
1. **scikit-learn baseline accuracy** uses `RandomForestClassifier.predict()`, which averages per-tree class probabilities.
2. **Browser-vote accuracy** uses the frontend's actual inference contract: each exported tree votes for a class, and the most-voted class wins. The frontend uses this second method.

These values differ slightly because the browser uses majority voting over each tree's predicted class, not scikit-learn's probability-averaging `predict()` method. The browser-vote result is therefore the more relevant metric for the shipped frontend artifact.

## Results from the pinned 40-tree run

### scikit-learn probability-averaging baseline

**Accuracy: 86.25% (207/240).**

| Metric | Low | Medium | High | Macro average | Weighted average |
|---|---:|---:|---:|---:|---:|
| Precision | 0.88 | 0.69 | 0.94 | 0.84 | 0.87 |
| Recall | 0.82 | 0.75 | 0.93 | 0.83 | 0.86 |
| F1-score | 0.85 | 0.72 | 0.94 | 0.83 | 0.86 |
| Test support | 61 | 56 | 123 | 240 | 240 |

Confusion matrix (rows = actual, columns = predicted; order Low, Medium, High):

| Actual / predicted | Low | Medium | High |
|---|---:|---:|---:|
| Low | 50 | 11 | 0 |
| Medium | 7 | 42 | 7 |
| High | 0 | 8 | 115 |

### Browser per-tree majority-vote inference

**Accuracy: 87.08% (209/240).**

| Metric | Low | Medium | High | Macro average | Weighted average |
|---|---:|---:|---:|---:|---:|
| Precision | 0.91 | 0.70 | 0.94 | 0.85 | 0.88 |
| Recall | 0.82 | 0.79 | 0.93 | 0.85 | 0.87 |
| F1-score | 0.86 | 0.74 | 0.94 | 0.85 | 0.87 |
| Test support | 61 | 56 | 123 | 240 | 240 |

Confusion matrix (rows = actual, columns = predicted; order Low, Medium, High):

| Actual / predicted | Low | Medium | High |
|---|---:|---:|---:|
| Low | 50 | 11 | 0 |
| Medium | 5 | 44 | 7 |
| High | 0 | 8 | 115 |

## Artifact and inference verification

- Both model artifacts contain 40 trees and are byte-identical.
- The training script regenerates both artifacts deterministically using the pinned dependency versions.
- Python tests verify risk-score thresholds, numeric label indices, deterministic synthetic data, tree-export parity, artifact equality and browser-vote holdout accuracy.
- Browser tests verify the shipped artifact's class order, fixed feature-vector outputs, vote shares and rejection of invalid class indices.
- The GitHub Actions workflow runs the model regeneration/diff check, Python tests, Firestore authorization tests, browser inference tests, ESLint and production build.

The accuracy values above measure agreement with formula-generated synthetic labels. They do **not** establish real-world student-risk accuracy, fairness, calibration or usefulness. The dataset's labels are generated from a hand-written formula using attendance, average marks, recent trend and missed assessments.

The frontend's tree-vote share for the selected class is **not a calibrated probability**. It is a rounded fraction of tree votes; the implementation calculates the integer percentage from `voteCount * 100 / treeCount` to avoid floating-point under-rounding at exact half values. Predictions are demonstrative indicators and must not be the sole basis for decisions about students.

## Requirements for future research evaluation

- Use an institution-approved, privacy-protected dataset and minimize personally identifiable information.
- Define labels independently of the same formula used to generate input features.
- Document missing-data handling, class balance, leakage checks and split methodology.
- Compare with simple baselines and report per-class precision, recall, F1 and confusion matrix.
- Assess subgroup fairness and calibration before considering real-world use.
- Clearly document consent, data governance, limitations and intended human oversight.
