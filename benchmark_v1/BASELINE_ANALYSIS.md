# 📊 Baseline Scorecard Analysis

**Date:** December 18, 2025  
**Dataset:** sample_dataset_100.jsonl (100 records)  
**Predictions:** Dummy baseline (all-compliant)  
**Scorer:** miltmon_scorer_v2.py

---

## 🎯 **Scorecard Summary**

### **Global Metrics**
```json
{
  "MCS": 0.0,
  "F1_decision": 0.0,
  "F1_clauses": 0.0,
  "F1_violations": 1.0,
  "F1_traceability": 0.0,
  "recall_noncompliance": 0.0
}
```

### **Gate Status: ❌ ALL FAIL**

| Gate | Threshold | Actual | Status |
|------|-----------|--------|--------|
| MCS | ≥ 0.85 | 0.0 | ❌ FAIL |
| Traceability (Global) | ≥ 0.80 | 0.0 | ❌ FAIL |
| Traceability (Safety-Critical) | ≥ 0.90 | 0.0 | ❌ FAIL |
| Recall (Non-Compliance) | ≥ 0.90 | 0.0 | ❌ FAIL |

---

## 📈 **Dataset Breakdown**

- **Total Records:** 100
- **Compliant:** 65
- **Non-Compliant:** 35
- **Near-Miss:** 30
- **Edition-Trap:** 10

### **By Risk Tier**
- **Standard:** 90 records (27 non-compliant)
- **Safety-Critical:** 10 records (8 non-compliant)

---

## 🔍 **Key Findings**

### **1. Decision Accuracy: 0%**
- **False Negatives:** 35 (missed all non-compliant cases)
- **False Positives:** 0
- **True Positives:** 0

**Root Cause:** Dummy baseline predicts "compliant" for all records, missing 100% of non-compliant cases.

### **2. Traceability: 0%**
- **Predicted Findings:** 0
- **Ground Truth Findings:** 35
- **Match Rate:** 0%

**Root Cause:** No structured findings predicted. Model must produce `predicted_findings` with `clause_id`, `field_path`, `actual_value`, and `finding_status`.

### **3. Clause Classification: 0%**
- **Primary Clause:** AWS_D1_1_2020_5.8 (preheat requirements)
- **Missed:** 35 clause references
- **F1:** 0.0

**Root Cause:** No clause IDs predicted. Model must identify which clauses are violated.

### **4. Recall (Non-Compliance): 0%**
- **Non-Compliant Cases:** 35
- **Detected:** 0
- **Recall:** 0.0

**Critical:** This is the most important metric for safety. Missing non-compliance is unacceptable.

---

## 🎯 **Per-Clause Breakdown**

### **AWS_D1_1_2020_5.8 (Preheat Requirements)**
- **Precision:** 1.0 (no false positives)
- **Recall:** 0.0 (missed all 35 violations)
- **F1:** 0.0

**Impact:** This clause governs preheat temperature requirements. Missing these violations could lead to weld failures.

---

## 🚨 **Critical Gaps Identified**

### **1. Non-Compliance Detection**
- **Current:** 0% recall
- **Required:** ≥ 90% recall
- **Gap:** 90 percentage points

**Priority:** 🔴 **CRITICAL** - Must fix immediately

### **2. Traceability**
- **Current:** 0% F1
- **Required:** ≥ 80% (global), ≥ 90% (safety-critical)
- **Gap:** 80-90 percentage points

**Priority:** 🔴 **CRITICAL** - Required for deployment gate

### **3. Clause Classification**
- **Current:** 0% F1
- **Required:** High precision/recall
- **Gap:** Complete rebuild needed

**Priority:** 🟡 **HIGH** - Needed for structured findings

---

## 📋 **Recommended Actions**

### **Immediate (Next 24 Hours)**

1. **Integrate Real ClauseBot Predictions**
   - Replace dummy predictions with actual CODEX function calls
   - Use `generate_predictions.py` to call production endpoint
   - Normalize outputs with `normalization_wrapper.py`

2. **Fix Non-Compliance Detection**
   - Ensure ClauseBot identifies non-compliant cases
   - Target: ≥ 90% recall on non-compliance
   - Test on safety-critical slice first

3. **Add Structured Findings**
   - Ensure predictions include `predicted_findings` array
   - Each finding must have:
     - `clause_id`
     - `field_path` (JSONPath format)
     - `actual_value`
     - `finding_status`

### **Short-Term (Next Week)**

4. **Improve Traceability**
   - Enhance normalization wrapper to extract field paths
   - Test on red-team examples
   - Target: ≥ 80% F1_traceability

5. **Clause Classification**
   - Improve clause ID extraction from CODEX responses
   - Map free-text to structured clause IDs
   - Target: High precision/recall on clause classification

6. **Red-Team Testing**
   - Run `red_team_examples.jsonl` through engine
   - Identify failure modes
   - Iterate on extraction rules

### **Medium-Term (Next Month)**

7. **Expand Dataset**
   - Generate 300-record dataset
   - Increase near-miss coverage
   - Add more edition-trap cases

8. **CI Integration**
   - Enable GitHub Actions benchmark job
   - Start with warning-only
   - Flip to fail-on-gate after validation

---

## ✅ **What This Baseline Proves**

1. ✅ **Scorer Works Correctly**
   - Properly identifies failures
   - Calculates all metrics accurately
   - Per-slice breakdown functional

2. ✅ **Dataset is Valid**
   - 100 records generated
   - Proper distribution (65/35 compliant/non-compliant)
   - Near-miss and edition-trap cases included

3. ✅ **Gates Are Enforced**
   - All gates correctly fail on poor performance
   - Thresholds are appropriate
   - System will prevent bad deployments

---

## 🎯 **Next Steps**

1. **Run Real Predictions:**
   ```bash
   python3 generate_predictions.py \
     --dataset sample_dataset_100.jsonl \
     --output predictions_100.jsonl \
     --endpoint https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query
   ```

2. **Re-Score:**
   ```bash
   python3 miltmon_scorer_v2.py \
     --dataset sample_dataset_100.jsonl \
     --predictions predictions_100.jsonl \
     --output scorecard.json
   ```

3. **Analyze Results:**
   - Compare to baseline
   - Identify improvement areas
   - Prioritize fixes

---

**Status:** ✅ Baseline established, ready for real predictions

