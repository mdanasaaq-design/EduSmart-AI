import json
import tempfile
import unittest
from pathlib import Path

import numpy as np

from train_model import (
    CLASSES,
    LABEL_TO_INDEX,
    MODEL_CONFIG,
    load_demo_data,
    predict_exported_model,
    predict_exported_tree,
    risk_label_from_score,
    train_and_export,
)


class RiskModelContractTests(unittest.TestCase):
    def test_score_thresholds_map_to_intended_risk_labels(self):
        self.assertEqual(risk_label_from_score(2.999), "High")
        self.assertEqual(risk_label_from_score(3.0), "Medium")
        self.assertEqual(risk_label_from_score(4.299), "Medium")
        self.assertEqual(risk_label_from_score(4.3), "Low")

    def test_numeric_indices_match_metadata_order(self):
        self.assertEqual(CLASSES, ["Low", "Medium", "High"])
        self.assertEqual(LABEL_TO_INDEX, {"Low": 0, "Medium": 1, "High": 2})
        self.assertEqual(LABEL_TO_INDEX[risk_label_from_score(2.0)], 2)
        self.assertEqual(LABEL_TO_INDEX[risk_label_from_score(3.5)], 1)
        self.assertEqual(LABEL_TO_INDEX[risk_label_from_score(5.0)], 0)

    def test_synthetic_data_is_deterministic_for_fixed_seed(self):
        first_x, first_y = load_demo_data(n=50, seed=7)
        second_x, second_y = load_demo_data(n=50, seed=7)
        np.testing.assert_array_equal(first_x, second_x)
        np.testing.assert_array_equal(first_y, second_y)

    def test_exported_forest_matches_per_tree_prediction_contract(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            model, artifact, x_test, _, _ = train_and_export(root=temp_dir)
            self.assertEqual(len(artifact["trees"]), MODEL_CONFIG["n_estimators"])
            self.assertEqual(artifact["classes"], CLASSES)

            ml_artifact = Path(temp_dir) / "ml" / "model.json"
            frontend_artifact = Path(temp_dir) / "frontend" / "public" / "model.json"
            self.assertEqual(ml_artifact.read_bytes(), frontend_artifact.read_bytes())
            loaded = json.loads(ml_artifact.read_text(encoding="utf-8"))

            vectors = [
                [95.0, 95.0, 15.0, 0],
                [70.0, 60.0, -10.0, 2],
                [45.0, 30.0, -25.0, 7],
                [65.0, 55.0, -5.0, 4],
            ]
            vectors.extend(vector.tolist() for vector in x_test[:8])
            for vector in vectors:
                tree_predictions = [
                    int(estimator.predict(np.asarray(vector).reshape(1, -1))[0])
                    for estimator in model.estimators_
                ]
                exported_tree_predictions = [
                    predict_exported_tree(tree, vector) for tree in loaded["trees"]
                ]
                self.assertEqual(exported_tree_predictions, tree_predictions)
                expected_vote = int(np.argmax(np.bincount(tree_predictions, minlength=3)))
                self.assertEqual(predict_exported_model(loaded, vector), expected_vote)


if __name__ == "__main__":
    unittest.main()
