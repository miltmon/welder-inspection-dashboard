#!/usr/bin/env python3
"""
Gate Checker for Benchmark Scorecard
Exits with error code if gates are not met
"""

import json
import sys
from pathlib import Path


def check_gates(scorecard_path: str) -> bool:
    """Check if all deployment gates are met."""
    with open(scorecard_path, 'r') as f:
        scorecard = json.load(f)
    
    gate_status = scorecard.get("gate_status", {})
    scores = scorecard.get("scores", {})
    thresholds = scorecard.get("thresholds", {})
    
    print("🚦 Checking Deployment Gates...")
    print()
    
    all_pass = True
    
    # Check MCS
    mcs = scores.get("MCS", 0)
    mcs_threshold = thresholds.get("MCS_threshold", 0.85)
    mcs_pass = mcs >= mcs_threshold
    status = "✅ PASS" if mcs_pass else "❌ FAIL"
    print(f"  MCS: {mcs:.4f} >= {mcs_threshold:.2f} {status}")
    if not mcs_pass:
        all_pass = False
    
    # Check Traceability
    f1_traceability = scores.get("F1_traceability", 0)
    trace_threshold = thresholds.get("traceability_floor_global", 0.80)
    trace_pass = f1_traceability >= trace_threshold
    status = "✅ PASS" if trace_pass else "❌ FAIL"
    print(f"  Traceability F1: {f1_traceability:.4f} >= {trace_threshold:.2f} {status}")
    if not trace_pass:
        all_pass = False
    
    # Check Near-Miss
    f1_near_miss = scores.get("F1_near_miss", 0)
    near_miss_threshold = thresholds.get("near_miss_floor", 0.80)
    near_miss_pass = f1_near_miss >= near_miss_threshold
    status = "✅ PASS" if near_miss_pass else "❌ FAIL"
    print(f"  Near-Miss F1: {f1_near_miss:.4f} >= {near_miss_threshold:.2f} {status}")
    if not near_miss_pass:
        all_pass = False
    
    # Check Recall (Non-Compliance)
    recall = scores.get("recall_noncompliance", 0)
    recall_threshold = thresholds.get("recall_floor_noncompliance", 0.90)
    recall_pass = recall >= recall_threshold
    status = "✅ PASS" if recall_pass else "❌ FAIL"
    print(f"  Recall (Non-Compliance): {recall:.4f} >= {recall_threshold:.2f} {status}")
    if not recall_pass:
        all_pass = False
    
    print()
    if all_pass:
        print("✅ All gates passed - Deployment approved")
        return True
    else:
        print("❌ One or more gates failed - Deployment blocked")
        return False


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 check_gates.py <scorecard.json>")
        sys.exit(1)
    
    scorecard_path = sys.argv[1]
    
    if not Path(scorecard_path).exists():
        print(f"Error: Scorecard file not found: {scorecard_path}")
        sys.exit(1)
    
    passed = check_gates(scorecard_path)
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()

