#!/usr/bin/env python3
"""
Generate Predictions from ClauseBot CODEX Endpoint
Calls the production CODEX function for each record in the dataset
"""

import json
import sys
import argparse
import requests
from typing import Dict, Any, List
from pathlib import Path


def load_jsonl(filepath: str) -> List[Dict[str, Any]]:
    """Load JSONL file."""
    records = []
    with open(filepath, 'r') as f:
        for line in f:
            records.append(json.loads(line.strip()))
    return records


def call_codex_endpoint(
    endpoint: str,
    api_key: str,
    query: str,
    top_k: int = 3
) -> Dict[str, Any]:
    """Call CODEX endpoint and return response."""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}" if api_key else None
    }
    
    payload = {
        "q": query,
        "top_k": top_k
    }
    
    # Remove None headers
    headers = {k: v for k, v in headers.items() if v is not None}
    
    try:
        response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error calling CODEX endpoint: {e}", file=sys.stderr)
        return {"results": [], "count": 0}


def build_query_from_record(record: Dict[str, Any]) -> str:
    """Build a query string from WPS/PQR record."""
    wps = record.get("wps", {})
    pqr = record.get("pqr", {})
    
    # Build focused query
    parts = []
    
    # Process
    if wps.get("process"):
        parts.append(f"welding process {wps['process']}")
    
    # Material
    if wps.get("base_metals"):
        material = wps["base_metals"][0].get("material", "")
        if material:
            parts.append(f"base metal {material}")
    
    # Thickness
    if wps.get("base_metals"):
        thickness = wps["base_metals"][0].get("thickness_mm")
        if thickness:
            parts.append(f"thickness {thickness}mm")
    
    # Preheat
    if wps.get("preheat_c") is not None:
        parts.append(f"preheat {wps['preheat_c']}°C")
    elif wps.get("base_metals"):
        thickness = wps["base_metals"][0].get("thickness_mm", 0)
        if thickness > 25:
            parts.append("preheat temperature")
    
    # Position
    if wps.get("position"):
        parts.append(f"position {wps['position']}")
    
    # PWHT
    if wps.get("pwht_applied"):
        parts.append("post weld heat treatment")
    
    return " ".join(parts) if parts else "welding procedure specification"


def normalize_codex_response(
    codex_response: Dict[str, Any],
    record: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Normalize CODEX response to prediction schema.
    
    This is a simplified version - use normalization_wrapper.py for full implementation.
    """
    predicted_clauses = []
    predicted_findings = []
    predicted_decision = "compliant"
    
    wps = record.get("wps", {})
    
    for result in codex_response.get("results", []):
        metadata = result.get("metadata", {})
        text = result.get("text", "")
        
        # Extract clause reference
        clause_ref = metadata.get("clause_reference") or metadata.get("Code_Reference_Primary", "")
        if clause_ref:
            # Convert to clause ID format
            clause_id = clause_ref.replace(" ", "_").replace(".", "_")
            if clause_id not in predicted_clauses:
                predicted_clauses.append(clause_id)
        
        # Check for non-compliance indicators
        if any(term in text.lower() for term in ["non-compliant", "violation", "fails", "insufficient", "does not meet"]):
            predicted_decision = "non_compliant"
            
            # Try to extract field path
            field_path = None
            if "preheat" in text.lower():
                field_path = "$.wps.preheat_c"
            elif "thickness" in text.lower():
                field_path = "$.wps.base_metals[0].thickness_mm"
            elif "position" in text.lower():
                field_path = "$.wps.position"
            
            if field_path:
                finding = {
                    "clause_id": clause_id if clause_id else "UNKNOWN",
                    "clause_reference": clause_ref,
                    "field_path": field_path,
                    "actual_value": wps.get("preheat_c") if "preheat" in field_path else None,
                    "expected_constraint": "See clause reference",
                    "finding_status": "non_compliant"
                }
                predicted_findings.append(finding)
    
    return {
        "record_id": record["record_id"],
        "predicted_decision": predicted_decision,
        "predicted_clauses": predicted_clauses,
        "predicted_findings": predicted_findings
    }


def main():
    parser = argparse.ArgumentParser(description="Generate predictions from ClauseBot CODEX")
    parser.add_argument("--dataset", required=True, help="Path to ground truth JSONL")
    parser.add_argument("--output", required=True, help="Path to output predictions JSONL")
    parser.add_argument("--endpoint", default="https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query", help="CODEX endpoint URL")
    parser.add_argument("--api-key", help="API key (or use CLAUSEBOT_API_KEY env var)")
    
    args = parser.parse_args()
    
    # Get API key
    import os
    api_key = args.api_key or os.getenv("CLAUSEBOT_API_KEY", "")
    
    if not api_key:
        print("Warning: No API key provided. Requests may fail.", file=sys.stderr)
    
    # Load dataset
    print(f"Loading dataset: {args.dataset}")
    records = load_jsonl(args.dataset)
    print(f"  Loaded {len(records)} records")
    
    # Generate predictions
    predictions = []
    print(f"\nGenerating predictions from: {args.endpoint}")
    
    for i, record in enumerate(records):
        if (i + 1) % 10 == 0:
            print(f"  Processed {i + 1}/{len(records)} records...")
        
        # Build query
        query = build_query_from_record(record)
        
        # Call CODEX
        codex_response = call_codex_endpoint(args.endpoint, api_key, query)
        
        # Normalize response
        prediction = normalize_codex_response(codex_response, record)
        predictions.append(prediction)
    
    # Write predictions
    print(f"\nWriting predictions to: {args.output}")
    with open(args.output, 'w') as f:
        for pred in predictions:
            f.write(json.dumps(pred) + '\n')
    
    print(f"✅ Generated {len(predictions)} predictions")


if __name__ == "__main__":
    main()

