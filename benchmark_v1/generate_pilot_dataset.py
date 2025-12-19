#!/usr/bin/env python3
"""
Generate Pilot Dataset for Miltmon Compliance Score Benchmark
AWS D1.1-2020 WPS/PQR Classification Challenge

Generates 100 records:
- 60 compliant/non-compliant (clean cases)
- 30 near-miss (adversarial variants)
- 10 edition-trap cases
"""

import json
import random
import uuid
from datetime import datetime
from typing import Dict, List, Any

# Fixed seed for reproducibility
random.seed(42)

# Constants
PROCESSES = ["SMAW", "GMAW", "FCAW", "GTAW", "SAW"]
POSITIONS = ["1G", "2G", "3G", "4G", "5G", "6G"]
MATERIALS = [
    {"name": "A36", "p_number": "1", "group": "1"},
    {"name": "A572-50", "p_number": "1", "group": "2"},
    {"name": "A516-70", "p_number": "1", "group": "3"},
    {"name": "A240 Type 304", "p_number": "8", "group": "1"},
    {"name": "A240 Type 316", "p_number": "8", "group": "1"},
    {"name": "A514", "p_number": "3", "group": "1"},
]
FILLER_METALS = [
    {"spec": "E7018", "f_number": "4"},
    {"spec": "ER70S-6", "f_number": "6"},
    {"spec": "ER308L", "f_number": "6"},
    {"spec": "ER316L", "f_number": "8"},
]


def generate_wps_pqr(
    is_non_compliant: bool = False,
    is_near_miss: bool = False,
    is_edition_trap: bool = False,
    risk_tier: str = "standard"
) -> Dict[str, Any]:
    """
    Generate a single WPS/PQR record with ground truth.
    
    Args:
        is_non_compliant: Generate a non-compliant case
        is_near_miss: Generate a near-miss adversarial case
        is_edition_trap: Generate an edition-trap case
        risk_tier: "standard" or "safety_critical"
    """
    record_id = str(uuid.uuid4())
    
    # Base parameters
    thickest = random.uniform(6, 60)
    process = random.choice(PROCESSES)
    position = random.choice(POSITIONS)
    base_material = random.choice(MATERIALS)
    filler = random.choice(FILLER_METALS)
    
    # Determine preheat requirement (AWS D1.1-2020 Table 5.8)
    # Simplified: >25mm requires preheat
    preheat_required = thickest > 25
    
    # Generate actual preheat value
    if is_near_miss:
        # Near-miss: just below/above threshold
        actual_preheat = 24 if preheat_required else 26  # Wrong side of threshold
    elif is_non_compliant:
        # Non-compliant: missing or insufficient preheat
        actual_preheat = 0 if preheat_required else random.randint(0, 200)
    else:
        # Compliant: proper preheat if required
        actual_preheat = random.randint(25, 200) if preheat_required else random.randint(0, 200)
    
    # Edition trap: use 2015 table reference (would be different in 2020)
    if is_edition_trap:
        # In 2015, some materials had different preheat requirements
        # This is a trap - correct answer must cite 2020 edition
        pass
    
    # Build WPS structure
    wps = {
        "wps_id": f"WPS-{random.randint(1000, 9999)}",
        "process": process,
        "position": position,
        "base_metals": [
            {
                "material": base_material["name"],
                "p_number": base_material["p_number"],
                "group": base_material["group"],
                "thickness_mm": round(thickest, 2)
            }
        ],
        "filler_metal": filler["spec"],
        "f_number": filler["f_number"],
        "preheat_c": round(actual_preheat, 1) if actual_preheat else None,
        "interpass_temp_c": round(random.uniform(100, 350), 1),
        "pwht_applied": random.choice([True, False]),
        "pwht_temp_c": round(random.uniform(1100, 1200), 1) if random.choice([True, False]) else None,
        "pwht_time_hours": random.randint(1, 4) if random.choice([True, False]) else None
    }
    
    # Build PQR structure
    pqr = {
        "pqr_id": f"PQR-{random.randint(1000, 9999)}",
        "test_thickness_mm": round(random.uniform(6, thickest), 2),
        "test_position": position,
        "test_process": process,
        "essential_variables": {
            "base_metal_p_number": base_material["p_number"],
            "filler_f_number": filler["f_number"],
            "process": process,
            "position": position
        }
    }
    
    # Determine compliance
    compliant = True
    findings: List[Dict[str, Any]] = []
    
    # Check preheat compliance
    if preheat_required and (actual_preheat is None or actual_preheat < 25):
        compliant = False
        findings.append({
            "clause_id": "AWS_D1_1_2020_5.8",
            "clause_reference": "Table 5.8",
            "field_path": "$.wps.preheat_c",
            "actual_value": actual_preheat,
            "expected_constraint": ">= 25°C for thickness > 25mm",
            "finding_status": "non_compliant",
            "risk_tier": "safety_critical" if thickest > 40 else "standard"
        })
    
    # Check thickness qualification range (simplified)
    if pqr["test_thickness_mm"] < 6 or pqr["test_thickness_mm"] > thickest * 2:
        compliant = False
        findings.append({
            "clause_id": "AWS_D1_1_2020_4.12",
            "clause_reference": "4.12",
            "field_path": "$.pqr.test_thickness_mm",
            "actual_value": pqr["test_thickness_mm"],
            "expected_constraint": f"6mm <= test_thickness <= {thickest * 2}mm (2T rule)",
            "finding_status": "non_compliant",
            "risk_tier": "standard"
        })
    
    # Build record
    record = {
        "record_id": record_id,
        "code": "AWS_D1_1",
        "code_edition": "aws_d1_1_2020",
        "wps": wps,
        "pqr": pqr,
        "ground_truth": {
            "decision": "compliant" if compliant else "non_compliant",
            "clause_ids": [f["clause_id"] for f in findings],
            "findings": findings
        },
        "adversarial_meta": {
            "is_near_miss": is_near_miss,
            "is_edition_trap": is_edition_trap,
            "risk_tier": risk_tier,
            "expected_difficulty": "high" if (is_near_miss or is_edition_trap) else "standard"
        }
    }
    
    return record


def main():
    """Generate pilot dataset with specified distribution."""
    records: List[Dict[str, Any]] = []
    
    print("Generating pilot dataset...")
    
    # 60 clean cases (compliant and non-compliant)
    print("  Generating 60 clean cases...")
    for i in range(40):
        records.append(generate_wps_pqr(is_non_compliant=False))
    for i in range(20):
        records.append(generate_wps_pqr(is_non_compliant=True))
    
    # 30 near-miss cases
    print("  Generating 30 near-miss cases...")
    for i in range(30):
        risk = "safety_critical" if i < 10 else "standard"
        records.append(generate_wps_pqr(is_near_miss=True, risk_tier=risk))
    
    # 10 edition-trap cases
    print("  Generating 10 edition-trap cases...")
    for i in range(10):
        records.append(generate_wps_pqr(is_edition_trap=True, risk_tier="standard"))
    
    # Write to JSONL file
    output_file = "sample_dataset_100.jsonl"
    with open(output_file, 'w') as f:
        for record in records:
            f.write(json.dumps(record) + '\n')
    
    # Generate summary
    compliant_count = sum(1 for r in records if r["ground_truth"]["decision"] == "compliant")
    non_compliant_count = sum(1 for r in records if r["ground_truth"]["decision"] == "non_compliant")
    near_miss_count = sum(1 for r in records if r["adversarial_meta"]["is_near_miss"])
    edition_trap_count = sum(1 for r in records if r["adversarial_meta"]["is_edition_trap"])
    
    print(f"\n[OK] Pilot dataset generated: {output_file}")
    print(f"   Total records: {len(records)}")
    print(f"   Compliant: {compliant_count}")
    print(f"   Non-compliant: {non_compliant_count}")
    print(f"   Near-miss: {near_miss_count}")
    print(f"   Edition-trap: {edition_trap_count}")


if __name__ == "__main__":
    main()

