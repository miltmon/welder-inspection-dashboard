#!/usr/bin/env python3
"""
Miltmon Compliance Score (MCS) Reference Scorer
AWS D1.1-2020 WPS/PQR Benchmark

Computes:
- MCS (Miltmon Compliance Score): Weighted composite
- F1_decision: Compliance decision accuracy
- F1_clauses: Clause ID classification accuracy
- F1_traceability: Field path + value extraction accuracy
- F1_near_miss: Performance on adversarial near-miss cases
- Recall_noncompliance: Recall for non-compliant cases
"""

import json
import sys
from typing import Dict, List, Any, Tuple
from collections import defaultdict
import argparse
from pathlib import Path


def load_jsonl(filepath: str) -> List[Dict[str, Any]]:
    """Load JSONL file."""
    records = []
    with open(filepath, 'r') as f:
        for line in f:
            records.append(json.loads(line.strip()))
    return records


def compute_f1(tp: int, fp: int, fn: int) -> float:
    """Compute F1 score."""
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    return f1, precision, recall


def score_traceability(
    ground_truth_findings: List[Dict[str, Any]],
    predicted_findings: List[Dict[str, Any]]
) -> Tuple[int, int, int]:
    """
    Score traceability: correct field_path + actual_value + finding_status.
    
    Returns: (tp, fp, fn)
    """
    # Normalize findings to sets of (clause_id, field_path, actual_value, status)
    gt_set = set()
    for f in ground_truth_findings:
        key = (
            f.get("clause_id", ""),
            f.get("field_path", ""),
            str(f.get("actual_value", "")),
            f.get("finding_status", "")
        )
        gt_set.add(key)
    
    pred_set = set()
    for f in predicted_findings:
        key = (
            f.get("clause_id", ""),
            f.get("field_path", ""),
            str(f.get("actual_value", "")),
            f.get("finding_status", "")
        )
        pred_set.add(key)
    
    tp = len(gt_set & pred_set)
    fp = len(pred_set - gt_set)
    fn = len(gt_set - pred_set)
    
    return tp, fp, fn


def score_clause_classification(
    ground_truth_clauses: List[str],
    predicted_clauses: List[str]
) -> Tuple[int, int, int]:
    """Score clause ID classification."""
    gt_set = set(ground_truth_clauses)
    pred_set = set(predicted_clauses)
    
    tp = len(gt_set & pred_set)
    fp = len(pred_set - gt_set)
    fn = len(gt_set - pred_set)
    
    return tp, fp, fn


def score_compliance_decision(
    ground_truth_decision: str,
    predicted_decision: str
) -> Tuple[int, int, int]:
    """Score compliance decision (compliant/non_compliant)."""
    if ground_truth_decision == predicted_decision:
        if ground_truth_decision == "non_compliant":
            return (1, 0, 0)  # tp
        else:
            return (1, 0, 0)  # tp
    else:
        if ground_truth_decision == "non_compliant":
            return (0, 0, 1)  # fn (missed non-compliance - critical!)
        else:
            return (0, 1, 0)  # fp (false positive)


def compute_mcs(
    f1_decision: float,
    f1_clauses: float,
    f1_traceability: float,
    recall_noncompliance: float
) -> float:
    """
    Compute Miltmon Compliance Score (MCS).
    
    Weighted composite:
    - Decision F1: 30%
    - Clause F1: 25%
    - Traceability F1: 30%
    - Recall (non-compliance): 15% (penalty if < threshold)
    """
    weights = {
        "decision": 0.30,
        "clauses": 0.25,
        "traceability": 0.30,
        "recall": 0.15
    }
    
    # Apply penalty if recall < threshold
    recall_score = recall_noncompliance if recall_noncompliance >= 0.90 else recall_noncompliance * 0.5
    
    mcs = (
        f1_decision * weights["decision"] +
        f1_clauses * weights["clauses"] +
        f1_traceability * weights["traceability"] +
        recall_score * weights["recall"]
    )
    
    return mcs


def run_scorer(
    dataset_path: str,
    predictions_path: str,
    output_path: str = "scorecard.json"
) -> Dict[str, Any]:
    """
    Run benchmark scorer on dataset and predictions.
    
    Args:
        dataset_path: Path to ground truth JSONL
        predictions_path: Path to predictions JSONL
        output_path: Path to output scorecard JSON
    """
    # Load data
    ground_truth = load_jsonl(dataset_path)
    predictions = load_jsonl(predictions_path)
    
    if len(ground_truth) != len(predictions):
        raise ValueError(f"Dataset size mismatch: {len(ground_truth)} vs {len(predictions)}")
    
    # Initialize counters
    tp_decision, fp_decision, fn_decision = 0, 0, 0
    tp_clauses, fp_clauses, fn_clauses = 0, 0, 0
    tp_traceability, fp_traceability, fn_traceability = 0, 0, 0
    tp_near_miss, fp_near_miss, fn_near_miss = 0, 0, 0
    tp_noncompliance, fn_noncompliance = 0, 0
    
    # Per-clause confusion matrix
    clause_confusion: Dict[str, Dict[str, int]] = defaultdict(lambda: {"tp": 0, "fp": 0, "fn": 0})
    
    # Failing examples
    failing_examples: List[Dict[str, Any]] = []
    
    # Score each record
    for i, (gt, pred) in enumerate(zip(ground_truth, predictions)):
        record_id = gt["record_id"]
        
        # Decision scoring
        gt_decision = gt["ground_truth"]["decision"]
        pred_decision = pred.get("predicted_decision", "compliant")
        tp_d, fp_d, fn_d = score_compliance_decision(gt_decision, pred_decision)
        tp_decision += tp_d
        fp_decision += fp_d
        fn_decision += fn_d
        
        # Clause classification scoring
        gt_clauses = gt["ground_truth"]["clause_ids"]
        pred_clauses = pred.get("predicted_clauses", [])
        tp_c, fp_c, fn_c = score_clause_classification(gt_clauses, pred_clauses)
        tp_clauses += tp_c
        fp_clauses += fp_c
        fn_clauses += fn_c
        
        # Update per-clause confusion
        for clause_id in set(gt_clauses + pred_clauses):
            if clause_id in gt_clauses and clause_id in pred_clauses:
                clause_confusion[clause_id]["tp"] += 1
            elif clause_id in pred_clauses:
                clause_confusion[clause_id]["fp"] += 1
            else:
                clause_confusion[clause_id]["fn"] += 1
        
        # Traceability scoring
        gt_findings = gt["ground_truth"]["findings"]
        pred_findings = pred.get("predicted_findings", [])
        tp_t, fp_t, fn_t = score_traceability(gt_findings, pred_findings)
        tp_traceability += tp_t
        fp_traceability += fp_t
        fn_traceability += fn_t
        
        # Near-miss slice
        if gt["adversarial_meta"]["is_near_miss"]:
            tp_nm, fp_nm, fn_nm = score_traceability(gt_findings, pred_findings)
            tp_near_miss += tp_nm
            fp_near_miss += fp_nm
            fn_near_miss += fn_nm
        
        # Non-compliance recall
        if gt_decision == "non_compliant":
            if pred_decision == "non_compliant":
                tp_noncompliance += 1
            else:
                fn_noncompliance += 1
        
        # Track failing examples
        if gt_decision != pred_decision or tp_t == 0:
            failing_examples.append({
                "record_id": record_id,
                "ground_truth_decision": gt_decision,
                "predicted_decision": pred_decision,
                "ground_truth_clauses": gt_clauses,
                "predicted_clauses": pred_clauses,
                "is_near_miss": gt["adversarial_meta"]["is_near_miss"],
                "risk_tier": gt["adversarial_meta"]["risk_tier"]
            })
    
    # Compute F1 scores
    f1_decision, prec_decision, rec_decision = compute_f1(tp_decision, fp_decision, fn_decision)
    f1_clauses, prec_clauses, rec_clauses = compute_f1(tp_clauses, fp_clauses, fn_clauses)
    f1_traceability, prec_traceability, rec_traceability = compute_f1(tp_traceability, fp_traceability, fn_traceability)
    f1_near_miss, prec_near_miss, rec_near_miss = compute_f1(tp_near_miss, fp_near_miss, fn_near_miss)
    
    # Recall for non-compliance
    recall_noncompliance = tp_noncompliance / (tp_noncompliance + fn_noncompliance) if (tp_noncompliance + fn_noncompliance) > 0 else 0.0
    
    # Compute MCS
    mcs = compute_mcs(f1_decision, f1_clauses, f1_traceability, recall_noncompliance)
    
    # Per-clause F1 scores
    clause_f1_scores = {}
    for clause_id, counts in clause_confusion.items():
        f1, _, _ = compute_f1(counts["tp"], counts["fp"], counts["fn"])
        clause_f1_scores[clause_id] = {
            "f1": f1,
            "tp": counts["tp"],
            "fp": counts["fp"],
            "fn": counts["fn"]
        }
    
    # Build scorecard
    scorecard = {
        "benchmark_version": "v1",
        "code": "AWS_D1_1",
        "code_edition": "aws_d1_1_2020",
        "dataset_size": len(ground_truth),
        "scores": {
            "MCS": round(mcs, 4),
            "F1_decision": round(f1_decision, 4),
            "F1_clauses": round(f1_clauses, 4),
            "F1_traceability": round(f1_traceability, 4),
            "F1_near_miss": round(f1_near_miss, 4),
            "recall_noncompliance": round(recall_noncompliance, 4)
        },
        "metrics": {
            "decision": {
                "precision": round(prec_decision, 4),
                "recall": round(rec_decision, 4),
                "f1": round(f1_decision, 4),
                "tp": tp_decision,
                "fp": fp_decision,
                "fn": fn_decision
            },
            "clauses": {
                "precision": round(prec_clauses, 4),
                "recall": round(rec_clauses, 4),
                "f1": round(f1_clauses, 4),
                "tp": tp_clauses,
                "fp": fp_clauses,
                "fn": fn_clauses
            },
            "traceability": {
                "precision": round(prec_traceability, 4),
                "recall": round(rec_traceability, 4),
                "f1": round(f1_traceability, 4),
                "tp": tp_traceability,
                "fp": fp_traceability,
                "fn": fn_traceability
            },
            "near_miss": {
                "precision": round(prec_near_miss, 4),
                "recall": round(rec_near_miss, 4),
                "f1": round(f1_near_miss, 4),
                "tp": tp_near_miss,
                "fp": fp_near_miss,
                "fn": fn_near_miss
            }
        },
        "per_clause_f1": clause_f1_scores,
        "failing_examples": failing_examples[:20],  # Top 20 failures
        "thresholds": {
            "MCS_threshold": 0.85,
            "traceability_floor_global": 0.80,
            "traceability_floor_safety_critical": 0.90,
            "near_miss_floor": 0.80,
            "recall_floor_noncompliance": 0.90
        },
        "gate_status": {
            "MCS_pass": mcs >= 0.85,
            "traceability_pass": f1_traceability >= 0.80,
            "near_miss_pass": f1_near_miss >= 0.80,
            "recall_pass": recall_noncompliance >= 0.90,
            "overall_pass": (
                mcs >= 0.85 and
                f1_traceability >= 0.80 and
                f1_near_miss >= 0.80 and
                recall_noncompliance >= 0.90
            )
        }
    }
    
    # Write scorecard
    with open(output_path, 'w') as f:
        json.dump(scorecard, f, indent=2)
    
    return scorecard


def main():
    parser = argparse.ArgumentParser(description="Miltmon Compliance Score Benchmark Scorer")
    parser.add_argument("--dataset", required=True, help="Path to ground truth JSONL")
    parser.add_argument("--predictions", required=True, help="Path to predictions JSONL")
    parser.add_argument("--output", default="scorecard.json", help="Output scorecard path")
    
    args = parser.parse_args()
    
    print("Running Miltmon Compliance Score Benchmark...")
    print(f"  Dataset: {args.dataset}")
    print(f"  Predictions: {args.predictions}")
    
    scorecard = run_scorer(args.dataset, args.predictions, args.output)
    
    print(f"\n✅ Scorecard generated: {args.output}")
    print(f"\n📊 Results:")
    print(f"   MCS: {scorecard['scores']['MCS']:.4f}")
    print(f"   F1 Decision: {scorecard['scores']['F1_decision']:.4f}")
    print(f"   F1 Clauses: {scorecard['scores']['F1_clauses']:.4f}")
    print(f"   F1 Traceability: {scorecard['scores']['F1_traceability']:.4f}")
    print(f"   F1 Near-Miss: {scorecard['scores']['F1_near_miss']:.4f}")
    print(f"   Recall (Non-Compliance): {scorecard['scores']['recall_noncompliance']:.4f}")
    print(f"\n🚦 Gate Status:")
    print(f"   Overall Pass: {scorecard['gate_status']['overall_pass']}")
    print(f"   MCS Pass: {scorecard['gate_status']['MCS_pass']}")
    print(f"   Traceability Pass: {scorecard['gate_status']['traceability_pass']}")
    print(f"   Near-Miss Pass: {scorecard['gate_status']['near_miss_pass']}")
    print(f"   Recall Pass: {scorecard['gate_status']['recall_pass']}")


if __name__ == "__main__":
    main()

