#!/usr/bin/env python3
"""
miltmon_scorer_v2.py
- Inputs: dataset.jsonl (benchmark_schema_v2), predictions.jsonl (prediction_schema)
- Output: scorecard.json (detailed)
- Features: per-slice metrics, per-clause confusion, traceability triplet scoring, ethical tracking, near-miss slicing
"""
import json, argparse, math
from collections import defaultdict, Counter

# ========== DEFAULT CONFIG ==========
CONFIG = {
  "MCS_weights": {"decision":0.45,"clauses":0.30,"violations":0.15,"traceability":0.10},
  "MCS_threshold": 0.85,
  "TRACEABILITY_FLOOR_GLOBAL": 0.80,
  "TRACEABILITY_FLOOR_SAFETY": 0.90,
  "NEARMISS_FLOOR": 0.80,
  "RECALL_FLOOR": 0.90,
  "VALUE_REL_TOL": 0.02,
  "VALUE_ABS_TOL": 1e-6
}

# ========== HELPERS ==========
def load_jsonl(path):
    d = {}
    with open(path) as fh:
        for line in fh:
            obj = json.loads(line)
            rid = obj.get("record_id")
            if not rid: raise ValueError("Missing record_id in line")
            d[rid] = obj
    return d

def numeric_match(a,b,rel,abs_tol):
    try:
        aa = float(a); bb = float(b)
    except:
        return False
    tol = max(abs_tol, rel * abs(bb))
    return abs(aa-bb) <= tol

def f1_tp_fp_fn(tp,fp,fn):
    prec = tp/(tp+fp) if (tp+fp) else 1.0
    rec = tp/(tp+fn) if (tp+fn) else 1.0
    if prec+rec == 0: return 0.0,prec,rec
    return 2*prec*rec/(prec+rec), prec, rec

# ========== SCORING ==========
def score(dataset, preds, cfg):
    # aggregate counters
    counts = defaultdict(int)
    clause_conf = defaultdict(lambda: {"tp":0,"fp":0,"fn":0})
    slice_stats = defaultdict(lambda: {"tp_dec":0,"fp_dec":0,"fn_dec":0,"tp_clause":0,"fp_clause":0,"fn_clause":0,"tp_trace":0,"fp_trace":0,"fn_trace":0,"total":0,"non_total":0,"non_tp":0})
    total_nonce = 0

    # loop
    for rid, rec in dataset.items():
        gt = rec["ground_truth"]
        meta = rec.get("adversarial_meta", {})
        slice_key = meta.get("risk_tier","standard")
        slice_stats[slice_key]["total"] += 1

        pred_entry = preds.get(rid, {})
        pred = pred_entry.get("prediction", pred_entry) if pred_entry else {"decision":"compliant","predicted_clause_ids":[],"predicted_violation_tags":[],"predicted_findings":[]}

        # decision scoring
        pdec = pred.get("decision","compliant")
        gdec = gt.get("decision","compliant")
        if pdec == "non_compliant" and gdec == "non_compliant":
            counts["tp_decision"] += 1; slice_stats[slice_key]["tp_dec"]+=1
        if pdec == "non_compliant" and gdec == "compliant":
            counts["fp_decision"] += 1; slice_stats[slice_key]["fp_dec"]+=1
        if pdec != "non_compliant" and gdec == "non_compliant":
            counts["fn_decision"] += 1; slice_stats[slice_key]["fn_dec"]+=1

        if gdec == "non_compliant":
            slice_stats[slice_key]["non_total"] += 1
            total_nonce += 1
            if pdec == "non_compliant": slice_stats[slice_key]["non_tp"] += 1

        # clause-level
        gt_clauses = set(gt.get("clause_ids",[]))
        pred_clauses = set(pred.get("predicted_clause_ids",[]))
        for c in gt_clauses & pred_clauses:
            clause_conf[c]["tp"] += 1; slice_stats[slice_key]["tp_clause"]+=1
        for c in pred_clauses - gt_clauses:
            clause_conf[c]["fp"] += 1; slice_stats[slice_key]["fp_clause"]+=1
        for c in gt_clauses - pred_clauses:
            clause_conf[c]["fn"] += 1; slice_stats[slice_key]["fn_clause"]+=1

        # violation tags
        gt_v = set(gt.get("violation_tags",[])); pred_v = set(pred.get("predicted_violation_tags",[]))
        counts["tp_v"] += len(gt_v & pred_v); counts["fp_v"] += len(pred_v - gt_v); counts["fn_v"] += len(gt_v - pred_v)

        # traceability triplets: match clause_id+field_path+finding_status + value tolerance
        gt_findings = gt.get("findings",[])
        pred_findings = pred.get("predicted_findings",[])
        pred_map = defaultdict(list)
        for f in pred_findings:
            key = (f.get("clause_id"), f.get("field_path"), f.get("finding_status"))
            pred_map[key].append(f.get("actual_value"))
        for f in gt_findings:
            key = (f["clause_id"], f["field_path"], f["finding_status"])
            gtval = f.get("actual_value")
            matched = False
            if key in pred_map:
                for pval in pred_map[key]:
                    if gtval is None and pval is None:
                        matched=True; break
                    # numeric tolerant match
                    if isinstance(gtval,(int,float)) and isinstance(pval,(int,float)):
                        if numeric_match(pval, gtval, cfg["VALUE_REL_TOL"], cfg["VALUE_ABS_TOL"]):
                            matched=True; break
                    else:
                        if str(pval) == str(gtval):
                            matched=True; break
            if matched:
                counts["tp_trace"] = counts.get("tp_trace",0)+1; slice_stats[slice_key]["tp_trace"]+=1
            else:
                counts["fn_trace"] = counts.get("fn_trace",0)+1; slice_stats[slice_key]["fn_trace"]+=1
        # predicted triplets not in GT => fp_trace
        gt_keys = set((f["clause_id"], f["field_path"], f["finding_status"]) for f in gt_findings)
        for f in pred_findings:
            pk = (f.get("clause_id"), f.get("field_path"), f.get("finding_status"))
            if pk not in gt_keys:
                counts["fp_trace"] = counts.get("fp_trace",0)+1; slice_stats[slice_key]["fp_trace"]+=1

    # compute global F1s
    f_dec, p_dec, r_dec = f1_tp_fp_fn(counts.get("tp_decision",0), counts.get("fp_decision",0), counts.get("fn_decision",0))
    # clause totals
    tp_clause = sum(v["tp"] for v in clause_conf.values())
    fp_clause = sum(v["fp"] for v in clause_conf.values())
    fn_clause = sum(v["fn"] for v in clause_conf.values())
    f_cl, p_cl, r_cl = f1_tp_fp_fn(tp_clause, fp_clause, fn_clause)
    f_v, p_v, r_v = f1_tp_fp_fn(counts.get("tp_v",0), counts.get("fp_v",0), counts.get("fn_v",0))
    f_tr, p_tr, r_tr = f1_tp_fp_fn(counts.get("tp_trace",0), counts.get("fp_trace",0), counts.get("fn_trace",0))
    recall_non = sum(s["non_tp"] for s in slice_stats.values()) / (sum(s["non_total"] for s in slice_stats.values()) or 1)

    # MCS base includes traceability as explicit component
    w = cfg["MCS_weights"]
    MCS_base = w["decision"]*f_dec + w["clauses"]*f_cl + w["violations"]*f_v + w["traceability"]*f_tr

    penalty = 1.0
    if recall_non < cfg["RECALL_FLOOR"]:
        penalty = recall_non / cfg["RECALL_FLOOR"]
    MCS = MCS_base * penalty

    # per-slice metrics
    slices = {}
    for sk, s in slice_stats.items():
        sd_f_dec,_,_ = f1_tp_fp_fn(s["tp_dec"], s["fp_dec"], s["fn_dec"])
        sd_tp_clause = s["tp_clause"]; sd_fp_clause = s["fp_clause"]; sd_fn_clause = s["fn_clause"]
        sd_f_cl,_,_ = f1_tp_fp_fn(sd_tp_clause, sd_fp_clause, sd_fn_clause)
        sd_f_tr,_,_ = f1_tp_fp_fn(s["tp_trace"], s["fp_trace"], s["fn_trace"])
        sd_mcs = w["decision"]*sd_f_dec + w["clauses"]*sd_f_cl + w["violations"]*0.0 + w["traceability"]*sd_f_tr
        slices[sk] = {
            "F1_decision": sd_f_dec,
            "F1_clauses": sd_f_cl,
            "F1_traceability": sd_f_tr,
            "MCS_slice": sd_mcs,
            "total": s["total"],
            "non_total": s["non_total"],
            "recall_noncompliance": s["non_tp"] / (s["non_total"] or 1)
        }

    # per-clause breakdown
    per_clause = {}
    for c, cnt in clause_conf.items():
        f1c, pc, rc = f1_tp_fp_fn(cnt["tp"], cnt["fp"], cnt["fn"])
        per_clause[c] = {"tp":cnt["tp"], "fp":cnt["fp"], "fn":cnt["fn"], "F1":f1c, "precision":pc, "recall":rc}

    scorecard = {
        "edition": dataset[next(iter(dataset))].get("code_edition","unknown"),
        "global": {
            "F1_decision": f_dec,
            "F1_clauses": f_cl,
            "F1_violations": f_v,
            "F1_traceability": f_tr,
            "recall_noncompliance": recall_non,
            "MCS_base": MCS_base,
            "penalty_factor": penalty,
            "MCS": MCS
        },
        "slices": slices,
        "per_clause": per_clause,
        "counts": dict(counts),
        "config_used": cfg
    }
    return scorecard

# ========== CLI ==========
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dataset", required=True)
    ap.add_argument("--predictions", required=False, default="")
    ap.add_argument("--output", required=False, default="scorecard.json")
    ap.add_argument("--mcs_threshold", type=float, default=None)
    ap.add_argument("--trace_floor", type=float, default=None)
    args = ap.parse_args()

    dataset = load_jsonl(args.dataset)
    preds = load_jsonl(args.predictions) if args.predictions else {}

    cfg = dict(CONFIG)
    if args.mcs_threshold: cfg["MCS_threshold"]=args.mcs_threshold
    if args.trace_floor: cfg["TRACEABILITY_FLOOR_GLOBAL"]=args.trace_floor

    scorecard = score(dataset, preds, cfg)
    with open(args.output,"w") as fh: json.dump(scorecard, fh, indent=2)
    print("Wrote", args.output)
    print("MCS:", round(scorecard["global"]["MCS"],4), "F1_trace:", round(scorecard["global"]["F1_traceability"],4))

if __name__=="__main__":
    main()

