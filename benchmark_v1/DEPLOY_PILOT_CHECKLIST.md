# 🚀 CWI Part B Module - Pilot Deployment Checklist

**Module:** AWS D1.1 WPS/PQR Training Module  
**Target:** Academy Staging Environment  
**Timeline:** 1-2 days

---

## 📋 Pre-Deployment (Before Starting)

- [ ] Render API fix completed (ClauseBot API healthy)
- [ ] Module package extracted and reviewed
- [ ] Staging environment access confirmed
- [ ] Pilot user list ready (from CSV)

---

## 🔧 Phase 1: API Foundation (10-15 min)

### Render Fix

- [ ] Run `render_fix.sh` or follow `render_fix_checklist.md`
- [ ] Verify health endpoint: `curl https://clausebot-api.onrender.com/health`
- [ ] Test search endpoint: `curl "https://clausebot-api.onrender.com/v1/clauses/search?term=preheat&limit=3"`
- [ ] Confirm API returns 200 OK with valid JSON

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 📦 Phase 2: Module Extraction & Review (15-30 min)

### Extract Package

- [ ] Extract `How to Pass the AWS D1.zip` to temporary directory
- [ ] Review manifest: `/mnt/data/how_to_pass_aws_d1_manifest.json`
- [ ] Identify key files:
  - [ ] `answer_key_instructor_guide.pdf`
  - [ ] `corrected_wps_document.pdf`
  - [ ] `corrected_pqr_document.pdf`
  - [ ] `lms_module_package.pdf`
  - [ ] `sme_email_packet.pdf`
  - [ ] React UI components (`App.jsx`, `AssessmentTracker.jsx`, etc.)
  - [ ] Pilot CSVs (`phase1_pilot_credentials.csv`)

### Review Content

- [ ] Review instructor guide for module structure
- [ ] Review corrected WPS/PQR documents for expected answers
- [ ] Review SME email packet for pilot communication

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 🎓 Phase 3: LMS Import (30-60 min)

### Moodle Import (If Using Moodle)

- [ ] Log into Moodle as Site Administrator
- [ ] Navigate to: Site Admin → Question bank → Import
- [ ] Select format: Moodle XML
- [ ] Upload `lms_module_package.pdf` or XML file
- [ ] Map fields:
  - [ ] Question text → Question field
  - [ ] Answers → Answer fields
  - [ ] Feedback → Feedback fields
- [ ] Import questions
- [ ] Create course: "CWI Part B - WPS/PQR Module"
- [ ] Add quiz activity
- [ ] Add imported questions to quiz

### Canvas/Blackboard Import (If Using)

- [ ] Use LMS import tools
- [ ] Upload `lms_module_package.pdf` + CSV data bank
- [ ] Map fields according to LMS requirements
- [ ] Create course/module
- [ ] Add quiz/assessment

### Airtable Import (If Using)

- [ ] Create base: "CWI Part B Module"
- [ ] Import CSV using import data feature
- [ ] Map fields:
  - [ ] Question → Question field
  - [ ] Answer → Answer field
  - [ ] Feedback → Feedback field
- [ ] Create views for instructor and student

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 💻 Phase 4: React UI Integration (60-90 min)

### Setup Feature Branch

```bash
git checkout -b feature/partb-module
```

- [ ] Create branch: `feature/partb-module`
- [ ] Copy React components to: `packages/academy/src/modules/partb/`
- [ ] Copy files:
  - [ ] `App.jsx` → `src/modules/partb/App.jsx`
  - [ ] `AssessmentTracker.jsx` → `src/modules/partb/AssessmentTracker.jsx`
  - [ ] `StudyGuideContent.jsx` → `src/modules/partb/StudyGuideContent.jsx`
  - [ ] `App.css` → `src/modules/partb/App.css`

### Update Routes

- [ ] Add route to `src/routes.tsx` or routing config:
  ```tsx
  <Route path="/modules/partb" element={<PartBModule />} />
  ```
- [ ] Import components
- [ ] Add navigation link (if needed)

### Local Testing

- [ ] Run `npm install` (if new dependencies)
- [ ] Run `npm start` or `npm run dev`
- [ ] Navigate to `/modules/partb`
- [ ] Verify components render correctly
- [ ] Test assessment tracker functionality
- [ ] Test study guide content display

### Create PR

- [ ] Commit changes: `git commit -m "feat: add PARTB WPS/PQR module UI"`
- [ ] Push branch: `git push -u origin feature/partb-module`
- [ ] Create PR (use PR command below or GitHub UI)
- [ ] Request review

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 👥 Phase 5: Pilot User Provisioning (15-30 min)

### Extract Credentials

- [ ] Open `phase1_pilot_credentials.csv`
- [ ] Review user list (10-20 pilot users)
- [ ] Verify email addresses are valid

### Provision Users

#### If Using LMS User Management:

- [ ] Import CSV to LMS user management
- [ ] Map CSV columns:
  - [ ] Email → Email field
  - [ ] Password → Password field (or generate)
  - [ ] Name → Name fields
- [ ] Create users
- [ ] Enroll users in course: "CWI Part B - WPS/PQR Module"

#### If Using SSO/External Auth:

- [ ] Upload CSV to SSO provisioning tool
- [ ] Map fields according to SSO requirements
- [ ] Provision users
- [ ] Assign to pilot group/role

### Send Invitations

- [ ] Send welcome email to pilot users
- [ ] Include:
  - [ ] Login instructions
  - [ ] Course/module link
  - [ ] Pilot timeline
  - [ ] Feedback form link

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 📧 Phase 6: SME Communication (15 min)

### Send SME Packet

- [ ] Email `sme_email_packet.pdf` to pilot SMEs/instructors
- [ ] Include:
  - [ ] Pilot objectives
  - [ ] Timeline
  - [ ] Feedback mechanism
  - [ ] Instructor guide link
- [ ] Schedule review meeting (optional)

### Provide Resources

- [ ] Share `answer_key_instructor_guide.pdf`
- [ ] Share `corrected_wps_document.pdf`
- [ ] Share `corrected_pqr_document.pdf`
- [ ] Provide access to module preview

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 🧪 Phase 7: Integration Testing (30-60 min)

### ClauseBot Integration (Diagnostic Mode)

- [ ] Keep ClauseBot calls disabled OR routed to diagnostic flag
- [ ] Test module without ClauseBot integration first
- [ ] Verify all UI components work
- [ ] Test assessment submission
- [ ] Test study guide navigation

### Enable ClauseBot (After API Verified)

- [ ] Set `CLAUSEBOT_ENABLED=true` in environment
- [ ] Test clause lookup functionality
- [ ] Verify CODEX function calls work
- [ ] Test error handling (API down, timeout, etc.)
- [ ] Verify audit logging (if implemented)

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 📊 Phase 8: Benchmark Baseline (30-60 min)

### Generate Predictions

```bash
cd benchmark_v1
python3 generate_predictions.py \
  --dataset sample_dataset_100.jsonl \
  --output predictions_100.jsonl \
  --endpoint https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query \
  --batch-size 10 --sleep-ms 300 --retries 3
```

- [ ] Run prediction generator
- [ ] Verify predictions file created
- [ ] Check for errors in output

### Normalize Predictions (If Needed)

```bash
python3 normalization_wrapper.py \
  --dataset sample_dataset_100.jsonl \
  --raw predictions_100.jsonl \
  --out predictions_100.normalized.jsonl
```

- [ ] Run normalization wrapper
- [ ] Verify normalized predictions

### Run Scorer

```bash
python3 miltmon_scorer_v2.py \
  --dataset sample_dataset_100.jsonl \
  --predictions predictions_100.normalized.jsonl \
  --output scorecard.json
```

- [ ] Run scorer
- [ ] Review scorecard.json
- [ ] Check gate status:
  - [ ] MCS ≥ 0.85?
  - [ ] Traceability ≥ 0.80 (global), ≥ 0.90 (safety-critical)?
  - [ ] Recall (non-compliance) ≥ 0.90?

### Triage Failures

- [ ] Identify top 5 worst-performing clauses
- [ ] Review per-clause breakdown
- [ ] Prioritize fixes:
  1. [ ] Highest impact (safety-critical)
  2. [ ] Most common failures
  3. [ ] Easiest to fix

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## 🚀 Phase 9: Production Enablement (After Validation)

### Enable Production Integration

- [ ] MCS ≥ 0.85 confirmed
- [ ] Traceability thresholds met
- [ ] Top 5 clause failures fixed
- [ ] Pilot feedback reviewed
- [ ] Set `CLAUSEBOT_ENABLED=true` in production
- [ ] Monitor for errors

### CI Integration

- [ ] Enable GitHub Actions benchmark job
- [ ] Start with warning-only mode
- [ ] Review runs for 1 week
- [ ] Flip to fail-on-gate after validation

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

## ✅ Completion Criteria

- [ ] API health verified (200 OK)
- [ ] Module imported to LMS
- [ ] React UI deployed to staging
- [ ] Pilot users provisioned
- [ ] SME communication sent
- [ ] Baseline scorecard generated
- [ ] Top failures identified and prioritized
- [ ] Ready for pilot launch

---

## 📋 Quick Reference

### Key Files

- `render_fix.sh` - Render API fix script
- `render_fix_checklist.md` - Detailed fix checklist
- `phase1_pilot_credentials.csv` - Pilot user list
- `sme_email_packet.pdf` - SME communication
- `answer_key_instructor_guide.pdf` - Instructor guide

### Key URLs

- Render Dashboard: https://dashboard.render.com
- API Health: https://clausebot-api.onrender.com/health
- API Search: https://clausebot-api.onrender.com/v1/clauses/search
- Academy Staging: https://academy-staging.miltmonndt.com (or your URL)

### Key Commands

```bash
# Render fix
bash render_fix.sh

# Generate predictions
python3 generate_predictions.py --dataset sample_dataset_100.jsonl --output predictions_100.jsonl

# Run scorer
python3 miltmon_scorer_v2.py --dataset sample_dataset_100.jsonl --predictions predictions_100.jsonl --output scorecard.json
```

---

**Status:** Ready for execution  
**Owner:** MANUS / DevOps / Backend Engineer  
**Estimated Total Time:** 4-6 hours (spread over 1-2 days)

