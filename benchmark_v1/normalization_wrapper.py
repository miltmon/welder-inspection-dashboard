#!/usr/bin/env python3
"""
Normalization Wrapper for ClauseBot Outputs
Converts free-text ClauseBot responses into structured prediction schema
"""

import json
import re
from typing import Dict, List, Any, Optional


def extract_clause_ids(text: str) -> List[str]:
    """
    Extract clause IDs from free-text response.
    
    Patterns:
    - "AWS D1.1 Clause 5.8"
    - "Table 5.8"
    - "ASME IX QW-451"
    """
    clause_ids = []
    
    # AWS D1.1 patterns
    aws_patterns = [
        r'AWS\s+D1\.1[:\s]+(?:Clause|Table|Section)?\s*(\d+\.\d+)',
        r'Table\s+(\d+\.\d+)',
        r'Clause\s+(\d+\.\d+)',
        r'(\d+\.\d+)\s+of\s+AWS\s+D1\.1'
    ]
    
    for pattern in aws_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            clause_id = f"AWS_D1_1_2020_{match.replace('.', '_')}"
            if clause_id not in clause_ids:
                clause_ids.append(clause_id)
    
    # ASME IX patterns
    asme_patterns = [
        r'ASME\s+IX[:\s]+QW-(\d+)',
        r'QW-(\d+)',
        r'QW\.(\d+)'
    ]
    
    for pattern in asme_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            clause_id = f"ASME_IX_2023_QW_{match}"
            if clause_id not in clause_ids:
                clause_ids.append(clause_id)
    
    return clause_ids


def extract_field_path(text: str, wps_structure: Dict[str, Any]) -> Optional[str]:
    """
    Extract JSONPath field path from text.
    
    Looks for references to:
    - preheat/preheat temperature -> $.wps.preheat_c
    - thickness -> $.wps.base_metals[0].thickness_mm
    - position -> $.wps.position
    - filler metal -> $.wps.filler_metal
    - PWHT -> $.wps.pwht_applied
    """
    text_lower = text.lower()
    
    # Preheat
    if any(term in text_lower for term in ['preheat', 'pre-heat', 'pre heat']):
        return "$.wps.preheat_c"
    
    # Thickness
    if any(term in text_lower for term in ['thickness', 'thick']):
        return "$.wps.base_metals[0].thickness_mm"
    
    # Position
    if 'position' in text_lower:
        return "$.wps.position"
    
    # Filler metal
    if any(term in text_lower for term in ['filler', 'electrode', 'wire']):
        return "$.wps.filler_metal"
    
    # PWHT
    if any(term in text_lower for term in ['pwht', 'post weld', 'heat treatment']):
        return "$.wps.pwht_applied"
    
    # Interpass
    if 'interpass' in text_lower:
        return "$.wps.interpass_temp_c"
    
    return None


def extract_actual_value(text: str, field_path: str) -> Optional[Any]:
    """
    Extract actual value from text.
    
    Looks for numbers, temperatures, boolean values.
    """
    # Temperature values
    if 'preheat' in field_path.lower() or 'temp' in field_path.lower():
        temp_patterns = [
            r'(\d+)\s*°?[CF]',
            r'(\d+)\s*degrees',
            r'temperature[:\s]+(\d+)',
            r'(\d+)\s*°C',
            r'(\d+)\s*°F'
        ]
        for pattern in temp_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return float(match.group(1))
    
    # Thickness values
    if 'thickness' in field_path.lower():
        thickness_patterns = [
            r'(\d+\.?\d*)\s*mm',
            r'(\d+\.?\d*)\s*inches?',
            r'thickness[:\s]+(\d+\.?\d*)'
        ]
        for pattern in thickness_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return float(match.group(1))
    
    # Boolean values
    if 'pwht' in field_path.lower():
        if any(term in text.lower() for term in ['yes', 'applied', 'required', 'true']):
            return True
        if any(term in text.lower() for term in ['no', 'not', 'none', 'false']):
            return False
    
    return None


def extract_expected_constraint(text: str) -> Optional[str]:
    """
    Extract expected constraint from text.
    
    Looks for:
    - ">= 25°C"
    - "minimum 25°C"
    - "must be >= X"
    """
    constraint_patterns = [
        r'(?:>=|minimum|at least|must be)\s+(\d+\.?\d*)\s*°?[CF]',
        r'(\d+\.?\d*)\s*°?[CF]\s*(?:minimum|or higher)',
        r'between\s+(\d+)\s+and\s+(\d+)',
        r'(\d+)\s*-\s*(\d+)'
    ]
    
    for pattern in constraint_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            if len(match.groups()) == 2:
                return f"{match.group(1)}-{match.group(2)}"
            else:
                return f">= {match.group(1)}"
    
    return None


def normalize_codex_response(
    codex_response: Dict[str, Any],
    wps_structure: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Normalize ClauseBot CODEX response to prediction schema.
    
    Input: CODEX response with free-text results
    Output: Structured prediction schema matching benchmark format
    """
    predicted_clauses = []
    predicted_findings = []
    predicted_decision = "compliant"
    
    # Extract from results
    for result in codex_response.get("results", []):
        text = result.get("text", "")
        metadata = result.get("metadata", {})
        
        # Extract clause IDs
        clause_ref = metadata.get("clause_reference") or metadata.get("Code_Reference_Primary", "")
        clause_id = metadata.get("NLM_ID", "")
        
        # Try to extract clause ID from text if not in metadata
        if not clause_id:
            extracted = extract_clause_ids(text)
            clause_ids = extracted if extracted else [clause_ref] if clause_ref else []
        else:
            clause_ids = [clause_id]
        
        predicted_clauses.extend(clause_ids)
        
        # Build finding if non-compliant indicators present
        if any(term in text.lower() for term in ['non-compliant', 'violation', 'fails', 'does not meet', 'insufficient']):
            predicted_decision = "non_compliant"
            
            field_path = extract_field_path(text, wps_structure)
            actual_value = extract_actual_value(text, field_path or "")
            expected_constraint = extract_expected_constraint(text)
            
            if field_path:
                finding = {
                    "clause_id": clause_ids[0] if clause_ids else "UNKNOWN",
                    "clause_reference": clause_ref,
                    "field_path": field_path,
                    "actual_value": actual_value,
                    "expected_constraint": expected_constraint or "See clause reference",
                    "finding_status": "non_compliant"
                }
                predicted_findings.append(finding)
    
    # Deduplicate clauses
    predicted_clauses = list(set(predicted_clauses))
    
    return {
        "predicted_decision": predicted_decision,
        "predicted_clauses": predicted_clauses,
        "predicted_findings": predicted_findings
    }


def main():
    """Example usage."""
    # Sample CODEX response
    codex_response = {
        "query": "preheat",
        "results": [{
            "score": 1.0,
            "text": "AWS D1.1:2025 Table 4.1 specifies 300°F (149°C) minimum preheat for ASTM A514 steel over 1 inch thick. The actual preheat of 24°C is insufficient and does not meet the minimum requirement of 25°C.",
            "metadata": {
                "NLM_ID": "CWI-2025-001",
                "Code_Reference_Primary": "4.2.3, Table 4.1",
                "clause_reference": "AWS D1.1-2020 Table 5.8"
            }
        }],
        "count": 1
    }
    
    # Sample WPS structure
    wps_structure = {
        "wps_id": "WPS-1234",
        "preheat_c": 24.0,
        "base_metals": [{"thickness_mm": 30.0}]
    }
    
    # Normalize
    prediction = normalize_codex_response(codex_response, wps_structure)
    
    print("Normalized Prediction:")
    print(json.dumps(prediction, indent=2))


if __name__ == "__main__":
    main()

