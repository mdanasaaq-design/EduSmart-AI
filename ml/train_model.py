"""
EduSmart AI - Random Forest training pipeline.

The demo dataset is synthetic. Numeric class indices are intentionally aligned
with CLASSES: 0 = Low risk, 1 = Medium risk, 2 = High risk.
"""
import json
from pathlib import Path

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

FEATURES = ["attendance", "averageMarks", "recentTrend", "missedAssessments"]
CLASSES = ["Low", "Medium", "High"]
LABEL_TO_INDEX = {label: index for index, label in enumerate(CLASSES)}
MODEL_CONFIG = {
    "n_estimators": 40,
    "max_depth": 6,
    "min_samples_leaf": 4,
    "random_state": 42,
}


def risk_label_from_score(score):
    """Convert the synthetic performance score into the intended risk label."""
    if score < 3.0:
        return "High"
    if score < 4.3:
        return "Medium"
    return "Low"


def load_demo_data(n=1200, seed=42):
    rng = np.random.default_rng(seed)
    attendance = rng.uniform(45, 100, n)
    marks = rng.uniform(30, 100, n)
    trend = rng.uniform(-30, 20, n)
    missed = rng.integers(0, 8, n)
    score = .045 * attendance + .035 * marks + .05 * trend - .7 * missed
    labels = np.array([LABEL_TO_INDEX[risk_label_from_score(value)] for value in score], dtype=int)
    return np.c_[attendance, marks, trend, missed], labels


def tree_to_json(estimator):
    tree = estimator.tree_

    def walk(index):
        if tree.children_left[index] == -1:
            # The argmax position is the index into CLASSES because sklearn's
            # numeric targets are 0, 1, 2 and CLASSES uses the same order.
            return {"leaf": int(np.argmax(tree.value[index][0]))}
        return {
            "feature": int(tree.feature[index]),
            "threshold": float(tree.threshold[index]),
            "left": walk(tree.children_left[index]),
            "right": walk(tree.children_right[index]),
        }

    return walk(0)


def predict_exported_tree(node, features):
    while "leaf" not in node:
        node = node["left"] if features[node["feature"]] <= node["threshold"] else node["right"]
    return node["leaf"]


def predict_exported_model(artifact, features):
    """Mirror the browser's per-tree majority vote and lowest-index tie break."""
    votes = [predict_exported_tree(tree, features) for tree in artifact["trees"]]
    counts = np.bincount(votes, minlength=len(artifact["classes"]))
    return int(np.argmax(counts))


def train_and_export(root=None):
    root = Path(root) if root else Path(__file__).resolve().parents[1]
    x, y = load_demo_data()
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=.20, random_state=42, stratify=y
    )
    model = RandomForestClassifier(**MODEL_CONFIG)
    model.fit(x_train, y_train)
    sklearn_predictions = model.predict(x_test)

    artifact = {
        "features": FEATURES,
        "classes": CLASSES,
        "trees": [tree_to_json(estimator) for estimator in model.estimators_],
    }
    # The browser uses per-tree majority voting, so evaluate that exact inference
    # contract separately from sklearn's probability-averaging predict() method.
    browser_predictions = np.array([
        predict_exported_model(artifact, features) for features in x_test
    ], dtype=int)

    print("Scikit-learn RandomForestClassifier.predict() baseline:")
    print(f"Validation accuracy: {accuracy_score(y_test, sklearn_predictions):.4f}")
    print(classification_report(
        y_test, sklearn_predictions, labels=[0, 1, 2], target_names=CLASSES, zero_division=0
    ))
    print("Confusion matrix (rows/columns Low, Medium, High):")
    print(confusion_matrix(y_test, sklearn_predictions, labels=[0, 1, 2]))

    print("Exported browser per-tree majority-vote evaluation:")
    print(f"Browser vote accuracy: {accuracy_score(y_test, browser_predictions):.4f}")
    print(classification_report(
        y_test, browser_predictions, labels=[0, 1, 2], target_names=CLASSES, zero_division=0
    ))
    print("Browser vote confusion matrix (rows/columns Low, Medium, High):")
    print(confusion_matrix(y_test, browser_predictions, labels=[0, 1, 2]))

    serialized = json.dumps(artifact, separators=(",", ":"))
    output_paths = [
        root / "ml" / "model.json",
        root / "frontend" / "public" / "model.json",
    ]
    for output_path in output_paths:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(serialized, encoding="utf-8")
        print(f"Wrote {output_path}")

    return model, artifact, x_test, y_test, predicted


if __name__ == "__main__":
    train_and_export()
