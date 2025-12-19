#!/usr/bin/env python3
"""
Generate Red-Team Adversarial Examples
20 targeted near-miss cases designed to break cheaters and expose weak clause reasoning
"""

import json
import random
import uuid
from typing import Dict, Any, List

random.seed(123)  # Different seed for red-team


def generate_red_team_case(case_type: str, index: int) -> Dict[str, Any]:
    """
    Generate a specific red-team adversarial case.
    
    Case types:
    - preheat_boundary: Precisely at threshold (24°C vs 25°C)
    - thickness_range: Just outside qualification range
    - position_combo: Position combination without qualification
    - pwht_missing: PWHT required but not applied
    - filler_mismatch: F-number mismatch
    - p_number_group: P-number group mismatch
    - interpass_temp: Interpass temp violation
    - edition_confusion: Would pass in 2015 but fail in 2020
    """
    
    record_id = str(uuid.uuid4())
    
    if case_type == "preheat_boundary":
        # Case 1-3: Preheat exactly at boundary
        thickest = 26.0  # Requires preheat
        actual_preheat = 24.0  # Just below threshold
        compliant = False
        
        wps = {
            "wps_id": f"WPS-RT-{1000 + index}",
            "process": "SMAW",
            "position": "3G",
            "base_metals": [{"material": "A36", "p_number": "1", "group": "1", "thickness_mm": thickest}],
            "filler_metal": "E7018",
            "f_number": "4",
            "preheat_c": actual_preheat,
            "interpass_temp_c": 150.0,
            "pwht_applied": False
        }
        
        findings = [{
            "clause_id": "AWS_D1_1_2020_5.8",
            "clause_reference": "Table 5.8",
            "field_path": "$.wps.preheat_c",
            "actual_value": actual_preheat,
            "expected_constraint": ">= 25°C for thickness > 25mm",
            "finding_status": "non_compliant",
            "risk_tier": "safety_critical"
        }]
    
    elif case_type == "thickness_range":
        # Case 4-6: Thickness just outside qualification range
        test_thickness = 61.0  # PQR qualified for 30mm, but 2T rule = 60mm max
        qualified_thickness = 30.0
        compliant = False
        
        wps = {
            "wps_id": f"WPS-RT-{1000 + index}",
            "process": "GMAW",
            "position": "1G",
            "base_metals": [{"material": "A572-50", "p_number": "1", "group": "2", "thickness_mm": test_thickness}],
            "filler_metal": "ER70S-6",
            "f_number": "6",
            "preheat_c": 50.0,
            "interpass_temp_c": 200.0,
            "pwht_applied": False
        }
        
        pqr = {
            "pqr_id": f"PQR-RT-{1000 + index}",
            "test_thickness_mm": qualified_thickness,
            "test_position": "1G",
            "test_process": "GMAW"
        }
        
        findings = [{
            "clause_id": "AWS_D1_1_2020_4.12",
            "clause_reference": "4.12",
            "field_path": "$.wps.base_metals[0].thickness_mm",
            "actual_value": test_thickness,
            "expected_constraint": f"<= {qualified_thickness * 2}mm (2T rule)",
            "finding_status": "non_compliant",
            "risk_tier": "safety_critical"
        }]
    
    elif case_type == "position_combo":
        # Case 7-9: Position combination without qualification
        # PQR qualified for 3G, but WPS requires 3G+4G
        compliant = False
        
        wps = {
            "wps_id": f"WPS-RT-{1000 + index}",
            "process": "GTAW",
            "position": "3G,4G",  # Combination
            "base_metals": [{"material": "A240 Type 304", "p_number": "8", "group": "1", "thickness_mm": 12.0}],
            "filler_metal": "ER308L",
            "f_number": "6",
            "preheat_c": None,
            "interpass_temp_c": 100.0,
            "pwht_applied": False
        }
        
        pqr = {
            "pqr_id": f"PQR-RT-{1000 + index}",
            "test_thickness_mm": 12.0,
            "test_position": "3G",  # Only 3G qualified
            "test_process": "GTAW"
        }
        
        findings = [{
            "clause_id": "AWS_D1_1_2020_4.11",
            "clause_reference": "4.11",
            "field_path": "$.wps.position",
            "actual_value": "3G,4G",
            "expected_constraint": "Must be qualified for all positions (3G only qualified)",
            "finding_status": "non_compliant",
            "risk_tier": "standard"
        }]
    
    elif case_type == "pwht_missing":
        # Case 10-12: PWHT required but not applied
        # Thick high-strength steel requires PWHT
        compliant = False
        
        wps = {
            "wps_id": f"WPS-RT-{1000 + index}",
            "process": "SMAW",
            "position": "1G",
            "base_metals": [{"material": "A514", "p_number": "3", "group": "1", "thickness_mm": 50.0}],
            "filler_metal": "E7018",
            "f_number": "4",
            "preheat_c": 150.0,
            "interpass_temp_c": 200.0,
            "pwht_applied": False,  # Required but missing
            "pwht_temp_c": None,
            "pwht_time_hours": None
        }
        
        findings = [{
            "clause_id": "AWS_D1_1_2020_5.9",
            "clause_reference": "5.9",
            "field_path": "$.wps.pwht_applied",
            "actual_value": False,
            "expected_constraint": "PWHT required for A514 > 40mm",
            "finding_status": "non_compliant",
            "risk_tier": "safety_critical"
        }]
    
    elif case_type == "filler_mismatch":
        # Case 13-15: F-number mismatch
        # WPS uses F-8 filler, but PQR qualified with F-6
        compliant = False
        
        wps = {
            "wps_id": f"WPS-RT-{1000 + index}",
            "process": "GTAW",
            "position": "1G",
            "base_metals": [{"material": "A240 Type 316", "p_number": "8", "group": "1", "thickness_mm": 10.0}],
            "filler_metal": "ER316L",  # F-8
            "f_number": "8",
            "preheat_c": None,
            "interpass_temp_c": 100.0,
            "pwht_applied": False
        }
        
        pqr = {
            "pqr_id": f"PQR-RT-{1000 + index}",
            "test_thickness_mm": 10.0,
            "test_position": "1G",
            "test_process": "GTAW",
            "essential_variables": {"filler_f_number": "6"}  # Wrong F-number
        }
        
        findings = [{
            "clause_id": "AWS_D1_1_2020_4.8",
            "clause_reference": "4.8",
            "field_path": "$.wps.f_number",
            "actual_value": "8",
            "expected_constraint": "Must match PQR F-number (6)",
            "finding_status": "non_compliant",
            "risk_tier": "standard"
        }]
    
    elif case_type == "p_number_group":
        # Case 16-17: P-number group mismatch
        # PQR qualified P-1 Group 1, but WPS uses P-1 Group 2
        compliant = False
        
        wps = {
            "wps_id": f"WPS-RT-{1000 + index}",
            "process": "GMAW",
            "position": "1G",
            "base_metals": [{"material": "A572-50", "p_number": "1", "group": "2", "thickness_mm": 15.0}],
            "filler_metal": "ER70S-6",
            "f_number": "6",
            "preheat_c": 50.0,
            "interpass_temp_c": 150.0,
            "pwht_applied": False
        }
        
        pqr = {
            "pqr_id": f"PQR-RT-{1000 + index}",
            "test_thickness_mm": 15.0,
            "test_position": "1G",
            "test_process": "GMAW",
            "essential_variables": {"base_metal_p_number": "1", "base_metal_group": "1"}  # Wrong group
        }
        
        findings = [{
            "clause_id": "AWS_D1_1_2020_4.7",
            "clause_reference": "4.7",
            "field_path": "$.wps.base_metals[0].group",
            "actual_value": "2",
            "expected_constraint": "Must match PQR group (1)",
            "finding_status": "non_compliant",
            "risk_tier": "standard"
        }]
    
    elif case_type == "interpass_temp":
        # Case 18: Interpass temperature violation
        # Interpass temp exceeds maximum allowed
        compliant = False
        
        wps = {
            "wps_id": f"WPS-RT-{1000 + index}",
            "process": "GTAW",
            "position": "1G",
            "base_metals": [{"material": "A240 Type 304", "p_number": "8", "group": "1", "thickness_mm": 8.0}],
            "filler_metal": "ER308L",
            "f_number": "6",
            "preheat_c": None,
            "interpass_temp_c": 400.0,  # Too high for stainless
            "pwht_applied": False
        }
        
        findings = [{
            "clause_id": "AWS_D1_1_2020_5.10",
            "clause_reference": "5.10",
            "field_path": "$.wps.interpass_temp_c",
            "actual_value": 400.0,
            "expected_constraint": "<= 300°C for austenitic stainless",
            "finding_status": "non_compliant",
            "risk_tier": "standard"
        }]
    
    elif case_type == "edition_confusion":
        # Case 19-20: Edition trap - would pass in 2015 but fail in 2020
        # Table 5.8 changed between editions
        compliant = False
        
        wps = {
            "wps_id": f"WPS-RT-{1000 + index}",
            "process": "SMAW",
            "position": "1G",
            "base_metals": [{"material": "A36", "p_number": "1", "group": "1", "thickness_mm": 30.0}],
            "filler_metal": "E7018",
            "f_number": "4",
            "preheat_c": 20.0,  # Would pass in 2015, fails in 2020
            "interpass_temp_c": 150.0,
            "pwht_applied": False
        }
        
        findings = [{
            "clause_id": "AWS_D1_1_2020_5.8",
            "clause_reference": "Table 5.8 (2020 edition)",
            "field_path": "$.wps.preheat_c",
            "actual_value": 20.0,
            "expected_constraint": ">= 25°C per AWS D1.1-2020 (2015 edition allowed 20°C)",
            "finding_status": "non_compliant",
            "risk_tier": "safety_critical",
            "edition_note": "This case tests edition awareness - 2015 vs 2020 differences"
        }]
    
    else:
        raise ValueError(f"Unknown case type: {case_type}")
    
    # Build record
    record = {
        "record_id": record_id,
        "code": "AWS_D1_1",
        "code_edition": "aws_d1_1_2020",
        "wps": wps,
        "pqr": pqr if 'pqr' in locals() else {
            "pqr_id": f"PQR-RT-{1000 + index}",
            "test_thickness_mm": wps["base_metals"][0]["thickness_mm"],
            "test_position": wps["position"],
            "test_process": wps["process"]
        },
        "ground_truth": {
            "decision": "compliant" if compliant else "non_compliant",
            "clause_ids": [f["clause_id"] for f in findings],
            "findings": findings
        },
        "adversarial_meta": {
            "is_near_miss": True,
            "is_edition_trap": case_type == "edition_confusion",
            "risk_tier": findings[0]["risk_tier"] if findings else "standard",
            "expected_difficulty": "high",
            "case_type": case_type,
            "red_team_index": index
        }
    }
    
    return record


def main():
    """Generate 20 red-team adversarial cases."""
    cases = []
    
    # Generate cases by type
    case_types = [
        ("preheat_boundary", 3),
        ("thickness_range", 3),
        ("position_combo", 3),
        ("pwht_missing", 3),
        ("filler_mismatch", 3),
        ("p_number_group", 2),
        ("interpass_temp", 1),
        ("edition_confusion", 2)
    ]
    
    index = 1
    for case_type, count in case_types:
        for i in range(count):
            cases.append(generate_red_team_case(case_type, index))
            index += 1
    
    # Write to JSONL
    output_file = "red_team_examples.jsonl"
    with open(output_file, 'w') as f:
        for case in cases:
            f.write(json.dumps(case) + '\n')
    
    print(f"✅ Red-team examples generated: {output_file}")
    print(f"   Total cases: {len(cases)}")
    print(f"   Near-miss: {sum(1 for c in cases if c['adversarial_meta']['is_near_miss'])}")
    print(f"   Edition-trap: {sum(1 for c in cases if c['adversarial_meta']['is_edition_trap'])}")
    print(f"   Safety-critical: {sum(1 for c in cases if c['adversarial_meta']['risk_tier'] == 'safety_critical')}")


if __name__ == "__main__":
    main()

