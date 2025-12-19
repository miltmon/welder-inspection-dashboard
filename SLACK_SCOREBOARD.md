# Slack Scoreboard Card (Pin This Message)

**Copy-paste this into Slack and pin it:**

---

```
📊 WELDTRACK v7.0.0 LAUNCH SCOREBOARD
====================================
🌍 PROD: https://weldtrack-inspector.netlify.app
🆔 SITE: 796579bb-0b32-4b2f-a821-165c8b0175e3
⏱ TIMELINE: Day 1 (CODEX + debug) → T+24h (draft PR) → T+72h (Clause 2 gate)

CRITICAL TASKS
• MANUS — Set envs & validate CODEX (P0)  — Reply: env:list + smoke JSON
• CURSOR — Remove debug logs & redeploy (P0) — Reply: "Debug logs removed — smoke test OK"
• GROK — Clause 2 validation harness (P1)   — Reply: results/clause2-validation.json + hotfix list
• WINDSURF — Optimization PR + draft (P2)  — Reply: Draft URL + vendor chunk listing
• DESIGN — Chapter 5 export (Due Dec 18 17:00 PDT) — Reply: comparison PDF + chosen format

QUICK LINKS
• PROD URL: https://weldtrack-inspector.netlify.app
• Function logs: https://app.netlify.com/sites/weldtrack-inspector/functions
• Site ID: 796579bb-0b32-4b2f-a821-165c8b0175e3

STATUS (update as owners reply)
MANUS: 🔴 PENDING
CURSOR: 🔴 PENDING
GROK: 🔴 PENDING
WINDSURF: ⚪ NOT STARTED
DESIGN: ⚪ NOT STARTED
```

---

## 📊 **Status Legend**

- 🔴 **PENDING** — Task assigned, waiting for owner response
- 🟡 **IN PROGRESS** — Owner working on it
- 🟢 **COMPLETE** — Task done, output received
- ⚪ **NOT STARTED** — Not yet assigned/started

---

## 🔄 **Update Instructions**

As owners reply, update the status section:

1. **MANUS replies:** Change `MANUS: 🔴 PENDING` → `MANUS: 🟢 COMPLETE` + paste their output below
2. **CURSOR replies:** Change `CURSOR: 🔴 PENDING` → `CURSOR: 🟢 COMPLETE` + paste their output
3. **GROK replies:** Change `GROK: 🔴 PENDING` → `GROK: 🟢 COMPLETE` + paste their output
4. **WINDSURF replies:** Change `WINDSURF: ⚪ NOT STARTED` → `WINDSURF: 🟢 COMPLETE` + paste draft URL
5. **DESIGN replies:** Change `DESIGN: ⚪ NOT STARTED` → `DESIGN: 🟢 COMPLETE` + paste comparison link

---

## 📝 **Example Updated Scoreboard**

```
STATUS (update as owners reply)
MANUS: 🟢 COMPLETE
  → env:list: CLAUSEBOT_KEY [hidden], CLAUSEBOT_ENDPOINT=https://...
  → Smoke JSON: { "query": "preheat clause 6.5", "results": [...] }

CURSOR: 🟢 COMPLETE
  → Debug logs removed — smoke test OK
  → Deploy: https://6941dcc19e4763cec90686f5--weldtrack-inspector.netlify.app

GROK: 🔴 PENDING
WINDSURF: ⚪ NOT STARTED
DESIGN: ⚪ NOT STARTED
```

---

**Pin this in your team Slack channel!**

