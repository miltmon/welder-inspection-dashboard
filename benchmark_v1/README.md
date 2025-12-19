# Miltmon Compliance Score Benchmark v1

**AWS D1.1-2020 WPS/PQR Classification Challenge**

---

## 🎯 **Purpose**

This benchmark system transforms ClauseBot from an intelligent assistant into an **auditable authority engine** for welding/NDT compliance. It enforces traceability, punishes near-misses, and gates deployment—turning compliance from aspiration into mechanical guarantee.

---

## 📋 **Confirmed Locks (12/18/2025)**

- **v1 Scope:** AWS D1.1-2020, WPS + PQR pairs only
- **Thresholds:**
  - MCS ≥ 0.85
  - Traceability F1 ≥ 0.80 (0.90 safety_critical)
  - Near-miss F1 ≥ 0.80
  - Recall (non-compliance) ≥ 0.90
- **Canonical Schema:** JSONPath format (e.g., `$.wps.base_metals[0].thickness_mm`)
- **Owner:** Milton (Chief Compliance Architect)

---

## 📁 **Files**

### **Core Files**
- `manifest.json` - Benchmark manifest with thresholds and metadata
- `sample_dataset_100.jsonl` - Pilot dataset (100 records)
- `red_team_examples.jsonl` - 20 adversarial test cases
- `score_run.py` - Reference scorer implementation
- `normalization_wrapper.py` - Converts free-text to structured predictions

### **CI Integration**
- `.github/workflows/benchmark.yml` - GitHub Actions workflow (see below)

---

## 🚀 **Quick Start**

### **1. Generate Pilot Dataset**

```bash
cd benchmark_v1
python3 generate_pilot_dataset.py
```

**Output:** `sample_dataset_100.jsonl` (100 records)

### **2. Generate Red-Team Examples**

```bash
python3 generate_red_team.py
```

**Output:** `red_team_examples.jsonl` (20 adversarial cases)

### **3. Run Baseline Scorer**

```bash
# First, generate predictions from ClauseBot/WeldTrack
# (This would call your CODEX endpoint for each record)

# Then score:
python3 score_run.py \
  --dataset sample_dataset_100.jsonl \
  --predictions predictions_100.jsonl \
  --output scorecard.json
```

**Output:** `scorecard.json` with MCS, F1 scores, and gate status

---

## 📊 **Scoring Metrics**

### **Miltmon Compliance Score (MCS)**
Weighted composite:
- Decision F1: 30%
- Clause F1: 25%
- Traceability F1: 30%
- Recall (non-compliance): 15% (penalty if < 0.90)

### **Additional Metrics**
- **F1_decision:** Compliance decision accuracy
- **F1_clauses:** Clause ID classification
- **F1_traceability:** Field path + value extraction accuracy
- **F1_near_miss:** Performance on adversarial cases
- **Recall_noncompliance:** Recall for non-compliant cases

---

## 🚦 **Deployment Gates**

A model/agent config **MUST** pass all gates to deploy:

- ✅ MCS ≥ 0.85
- ✅ Traceability F1 ≥ 0.80 (≥ 0.90 for safety_critical)
- ✅ Near-miss F1 ≥ 0.80
- ✅ Recall (non-compliance) ≥ 0.90

---

## 🔧 **CI Integration**

### **GitHub Actions Workflow**

Create `.github/workflows/benchmark.yml`:

```yaml
name: Compliance Benchmark

on:
  pull_request:
    paths:
      - '**/clausebot/**'
      - '**/weldtrack/**'
  push:
    branches: [main]

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r benchmark_v1/requirements.txt
      
      - name: Generate predictions
        run: |
          python3 benchmark_v1/generate_predictions.py \
            --dataset benchmark_v1/sample_dataset_100.jsonl \
            --output predictions_100.jsonl
        env:
          CLAUSEBOT_API_KEY: ${{ secrets.CLAUSEBOT_API_KEY }}
      
      - name: Run benchmark scorer
        run: |
          python3 benchmark_v1/score_run.py \
            --dataset benchmark_v1/sample_dataset_100.jsonl \
            --predictions predictions_100.jsonl \
            --output scorecard.json
      
      - name: Check gates
        run: |
          python3 benchmark_v1/check_gates.py scorecard.json
      
      - name: Upload scorecard
        uses: actions/upload-artifact@v3
        with:
          name: benchmark-scorecard
          path: scorecard.json
```

---

## 📝 **Dataset Structure**

### **Ground Truth Record**
```json
{
  "record_id": "uuid",
  "code": "AWS_D1_1",
  "code_edition": "aws_d1_1_2020",
  "wps": {
    "wps_id": "WPS-1234",
    "process": "SMAW",
    "position": "3G",
    "base_metals": [{
      "material": "A36",
      "p_number": "1",
      "group": "1",
      "thickness_mm": 30.0
    }],
    "filler_metal": "E7018",
    "f_number": "4",
    "preheat_c": 24.0,
    "interpass_temp_c": 150.0,
    "pwht_applied": false
  },
  "pqr": {
    "pqr_id": "PQR-1234",
    "test_thickness_mm": 15.0,
    "test_position": "3G",
    "test_process": "SMAW"
  },
  "ground_truth": {
    "decision": "non_compliant",
    "clause_ids": ["AWS_D1_1_2020_5.8"],
    "findings": [{
      "clause_id": "AWS_D1_1_2020_5.8",
      "clause_reference": "Table 5.8",
      "field_path": "$.wps.preheat_c",
      "actual_value": 24.0,
      "expected_constraint": ">= 25°C for thickness > 25mm",
      "finding_status": "non_compliant",
      "risk_tier": "safety_critical"
    }]
  },
  "adversarial_meta": {
    "is_near_miss": true,
    "is_edition_trap": false,
    "risk_tier": "safety_critical",
    "expected_difficulty": "high"
  }
}
```

### **Prediction Record**
```json
{
  "record_id": "uuid",
  "predicted_decision": "non_compliant",
  "predicted_clauses": ["AWS_D1_1_2020_5.8"],
  "predicted_findings": [{
    "clause_id": "AWS_D1_1_2020_5.8",
    "clause_reference": "Table 5.8",
    "field_path": "$.wps.preheat_c",
    "actual_value": 24.0,
    "expected_constraint": ">= 25°C",
    "finding_status": "non_compliant"
  }]
}
```

---

## 🎯 **Next Steps**

1. **Generate datasets** (run `generate_pilot_dataset.py`)
2. **Run baseline** (score current ClauseBot/WeldTrack)
3. **Red-team** (run `generate_red_team.py` and test)
4. **Wire CI** (add benchmark job to GitHub Actions)
5. **Iterate** (improve model based on scorecard)

---

## 📚 **References**

- **Manifest:** `manifest.json`
- **Scorer:** `score_run.py`
- **Normalization:** `normalization_wrapper.py`
- **CI Workflow:** `.github/workflows/benchmark.yml` (to be created)

---

**Status:** ✅ **Ready for Execution**  
**Owner:** Milton (Chief Compliance Architect)  
**Last Updated:** 2025-12-18

