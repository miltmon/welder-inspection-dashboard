# MiltmonNDT Code & Clause Classification Challenge — Overview (v1)

## Objective
- Accurately classify WPS/PQR packages vs AWS D1.1-2025 clause-level ground truth.
- Produce structured findings (clause_id, field_path, actual_value, expected_constraint, finding_status) — explanations alone do not earn traceability credit.

## Dataset
- Published dataset: synthetic + SME-labeled records
- Training partition (public): 50%
- Evaluation partition (held-out): 50% — labels hidden for public runs

## Submission Format
- JSONL with one object per record following `prediction_schema.json`
- Must include `predicted_findings` for scored traceability
- Model metadata: model_id, version, config summary

## Scoring
- Use Miltmon official scorer (scores: Decision F1, Clause F1, Violation F1, Traceability F1, Near-miss F1, MCS)
- Weighted headline = MCS (as in scorer)
- Safety-critical slices (risk_tier = "safety_critical") require F1_traceability >= 0.90 to qualify for leaderboard

## Leaderboard / Public Metrics
- Public: model_id, MCS, F1_decision, F1_clauses (rounded)
- Private (available to entrant): per-slice breakdown, per-clause confusion matrices
- Top N monthly leaderboard honors only models that meet safety-critical floors

## Rules & Anti-Gaming
- Edition locked to aws_d1_1_2025 — mixing editions is disallowed
- No training on held-out labels
- Explainability requirement: at least 80% of non-compliant predictions must include structured findings
- Validity checks: submissions that fail schema or produce empty findings are disqualified

## Enterprise API
- Paid enterprise mode allows vendors to upload models behind VPC for private scoring + detailed audit packs (per-clause evidence, traceability artifacts)

