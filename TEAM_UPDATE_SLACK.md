# AI Team Update — WeldTrack™ v7.0.0 (copy-paste ready)

Team — quick, focused update & tasking for WeldTrack v7.0.0 (live: [https://weldtrack-inspector.netlify.app](https://weldtrack-inspector.netlify.app)). This breaks remaining work into small, owned tasks so we can move CODEX + optimization items in parallel. Reply with the exact one-line outputs listed under **What I need back**.

**TL;DR**
WeldTrack v7.0.0 is live. CODEX function exists but is returning a config error because server-side env vars are not set. We must: (A) set CLAUSEBOT envs and validate CODEX, (B) remove debug noise, (C) stage bundle splitting + draft deploy. Tasks below.

---

## Owners & Tasks

**MANUS — Production Env & CODEX Validation (P0)**
Goal: Set server-side ClauseBot creds and prove CODEX returns retrieval results.
Commands (PowerShell — replace `<YOUR_KEY>`):

```powershell
$SITE="796579bb-0b32-4b2f-a821-165c8b0175e3"
netlify env:set CLAUSEBOT_KEY "<YOUR_KEY>" --site $SITE
netlify env:set CLAUSEBOT_ENDPOINT "https://api.clausebot.internal/retrieve" --site $SITE
# optional frontend build-time
netlify env:set VITE_CLAUSEBOT_ENDPOINT "https://api.clausebot.internal/retrieve" --site $SITE
netlify env:list --site $SITE

# CODEX smoke
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json -Depth 6
```

**What I need back:** `netlify env:list` output + the smoke test JSON (or last 30 lines of `netlify functions:log` if error)

---

**CURSOR — Remove Debug Logging + Redeploy (P0)**
Goal: Remove verbose debug logs from the CODEX function and confirm behavior unchanged.
Steps:

1. Backup `netlify/functions/codex-query.js`
2. Remove debug `console.log` lines (keep errors)
3. `npm run build` → `netlify deploy --prod --dir=dist --site 796579bb-0b32-4b2f-a821-165c8b0175e3`
4. Re-run CODEX smoke test (same as above)

**What I need back:** "Debug logs removed — smoke test OK" + deploy output

---

**GROK — Clause 2 Validation Harness (P1, critical path)**
Goal: Run validation harness (target ≥95% top-10 accuracy), deliver miss taxonomy and prioritized hotfix list.
Commands:

```bash
cd scripts
node validate-clause2.js --top-k 10 --out results/clause2-validation.json
node classify-failures.js --input results/clause2-validation.json --out results/clause2-hotfix-list.md
```

**What I need back:** link/paste of `results/clause2-validation.json` and the hotfix list

---

**WINDSURF — Optimization PR & Draft Deploy (P2)**
Goal: Stage vendor chunk splitting + Firebase fix in branch and draft deploy for QA.
Branch + build:

```bash
git checkout -b feat/optimize-weldtrack-v7
cp vite.config.optimized.ts vite.config.ts
# apply firebase update if needed
git add vite.config.ts src/lib/firebase.updated.ts scripts/test-codex.ps1
git commit -m "feat: vendor chunk splitting + firebase persistence update"
git push origin feat/optimize-weldtrack-v7

npm run build
netlify deploy --dir=dist   # capture draft URL
```

Verify `dist/assets` contains vendor chunks (vendor-react, vendor-firebase, vendor-ui).
**What I need back:** Draft URL + list of vendor chunk file names

---

**Design/Content — Chapter 5 Export (Due Dec 18, 17:00 PDT)**
Goal: Export Chapter 5 via Designrr + DOCX fallback, produce `chapter5-export-comparison.pdf` with screenshots and final recommendation.
**What I need back:** link to comparison PDF + chosen export format

---

## Timeline (Day 1 → T+72h)

* **Day 1 (today):** MANUS sets envs & validates CODEX; CURSOR removes debug logs and redeploys.
* **T+24h:** WINDSURF drafts optimization PR + draft deploy.
* **T+72h:** GROK delivers Clause 2 validation ≥95% or a prioritized hotfix plan.
* Chapter 5 export due Dec 18 17:00 PDT.

---

## Quick reference (copyable)

Set envs + list:

```powershell
$SITE="796579bb-0b32-4b2f-a821-165c8b0175e3"
netlify env:set CLAUSEBOT_KEY "<sk_...>" --site $SITE
netlify env:set CLAUSEBOT_ENDPOINT "https://api.clausebot.internal/retrieve" --site $SITE
netlify env:list --site $SITE
```

Function logs:

```powershell
netlify functions:log --name=codex-query --site $SITE
```

---

## One-line replies I expect back

* **MANUS:** `env:list` output + CODEX smoke JSON
* **CURSOR:** "Debug logs removed — smoke test OK" + redeploy output
* **GROK:** `results/clause2-validation.json` + hotfix list
* **WINDSURF:** Draft deploy URL + chunk listing
* **Design:** Chapter 5 comparison link + chosen export

