#!/usr/bin/env python3
"""
Generate Dummy Predictions for Baseline Scoring
Creates predictions_100.jsonl with all-compliant baseline (for testing scorer)
"""

import json
import sys
from datetime import datetime
from typing import Dict, Any

def load_jsonl(filepath: str) -> list:
    """Load JSONL file."""
    records = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            records.append(json.loads(line.strip()))
    return records

def generate_dummy_prediction(record: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a dummy prediction (all-compliant baseline)."""
    record_id = record.get("record_id")
    ground_truth = record.get("ground_truth", {})
    
    # Dummy prediction: always predict compliant (baseline)
    # This will show where the model fails
    prediction = {
        "record_id": record_id,
        "model_id": "dummy_baseline_v1",
        "predicted_at": datetime.utcnow().isoformat() + "Z",
        "prediction": {
            "decision": "compliant",  # Always compliant (will miss non-compliant cases)
            "predicted_clause_ids": [],
            "predicted_violation_tags": [],
            "predicted_findings": []
        }
    }
    
    return prediction

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 generate_dummy_predictions.py <dataset.jsonl> [output.jsonl]")
        sys.exit(1)
    
    dataset_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else "predictions_100.jsonl"
    
    print(f"Loading dataset: {dataset_path}")
    records = load_jsonl(dataset_path)
    print(f"  Loaded {len(records)} records")
    
    print(f"\nGenerating dummy predictions...")
    predictions = []
    for record in records:
        pred = generate_dummy_prediction(record)
        predictions.append(pred)
    
    print(f"Writing predictions to: {output_path}")
    with open(output_path, 'w', encoding='utf-8') as f:
        for pred in predictions:
            f.write(json.dumps(pred) + '\n')
    
    print(f"[OK] Generated {len(predictions)} dummy predictions")
    print(f"  Note: All predictions are 'compliant' (baseline test)")

if __name__ == "__main__":
    main()

