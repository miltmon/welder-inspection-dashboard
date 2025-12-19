# MANUS Task Results — Environment Variables & CODEX Validation

**Date:** December 16, 2025  
**Owner:** MANUS  
**Status:** 🟡 **PARTIAL — NEEDS REAL API KEY**

---

## 📊 **ENVIRONMENT VARIABLES STATUS**

### **Current Environment Variables:**

```
✅ CLAUSEBOT_API_KEY      [hidden] | All scopes
✅ CLAUSEBOT_ENDPOINT     https://clausebot-api.onrender.com/v1/retrieve | All scopes  
✅ CLAUSEBOT_KEY          [hidden] | All scopes (SET WITH PLACEHOLDER)
```

**Note:** `CLAUSEBOT_KEY` is set but with placeholder value `REPLACE_WITH_ACTUAL_KEY`. Needs to be updated with the real API key.

---

## 🧪 **CODEX SMOKE TEST RESULTS**

### **Test Command Executed:**
```powershell
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' `
  -Method Post -Body $body -ContentType 'application/json'
```

### **Current Response:**
```json
{
  "error": "Server configuration error: CLAUSEBOT_KEY not set",
  "hint": "Set CLAUSEBOT_KEY in Netlify environment variables"
}
```

**Status:** ❌ **FAILED** — Function still reports `CLAUSEBOT_KEY` not set.

---

## 🔍 **DIAGNOSIS**

### **Root Cause:**
1. ✅ `CLAUSEBOT_KEY` environment variable is set in Netlify
2. ❌ Value is placeholder (`REPLACE_WITH_ACTUAL_KEY`) — not a valid API key
3. ⚠️ Function may need redeploy to pick up new env var (Netlify functions cache env vars)

### **Possible Issues:**
- **Placeholder Value:** The key I set is a placeholder, not the actual API key
- **Function Cache:** Netlify functions may cache environment variables and need a redeploy
- **Context Mismatch:** Env var might be in "dev" context but function runs in "production"

---

## ✅ **REQUIRED ACTIONS FOR MANUS**

### **Step 1: Set Real API Key**

**Get the actual ClauseBot API key from:**
- Render Dashboard: https://dashboard.render.com → `clausebot-api` → Environment → `CLAUSEBOT_API_KEY`
- Or your password manager (search for "clausebot" or "clausebot-api")

**Then set it:**

```powershell
# Replace <YOUR_ACTUAL_KEY> with the real key from Render/password manager
netlify env:set CLAUSEBOT_KEY "<YOUR_ACTUAL_KEY>"

# Verify it's set (should show the masked value)
netlify env:list
```

### **Step 2: Redeploy Function (May Be Required)**

Netlify functions cache environment variables. After setting the real key, you may need to trigger a redeploy:

```powershell
# Option A: Redeploy the function by touching the file
# (Just redeploy the whole site - functions will pick up new env vars)
cd "C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard"
npm run build
netlify deploy --prod --dir=dist

# Option B: Or just wait 1-2 minutes for Netlify to pick up the env var change
```

### **Step 3: Re-run Smoke Test**

```powershell
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' `
  -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json -Depth 6
```

**Expected Success:**
```json
{
  "query": "preheat clause 6.5",
  "results": [
    {
      "score": 0.92,
      "text": "...",
      "metadata": {
        "NLM_ID": "nlm://doc123#chunk45",
        "Code_Reference_Primary": "AWS D1.1:2020 Clause 6.5"
      }
    }
  ],
  "count": 3,
  "timestamp": "2025-12-16T..."
}
```

### **Step 4: If Still Failing — Check Function Logs**

```powershell
netlify functions:log --name=codex-query
```

**Look for:**
- Masked key visibility (should show `sk_ab...xyz9` not `MISSING`)
- Any API errors (401, 403, network errors)
- Endpoint reachability issues

---

## 📋 **WHAT TO PASTE BACK**

After setting the real key and testing:

1. **`netlify env:list` output** — Showing `CLAUSEBOT_KEY` is set (masked)
2. **CODEX smoke test JSON** — Full response (success or error)
3. **If error:** Last 30 lines of function logs

---

## 🎯 **CURRENT STATUS SUMMARY**

| Item | Status | Notes |
|------|--------|-------|
| **CLAUSEBOT_KEY set** | ✅ Yes | But placeholder value - needs real key |
| **CLAUSEBOT_ENDPOINT** | ✅ Correct | `https://clausebot-api.onrender.com/v1/retrieve` |
| **CODEX function deployed** | ✅ Yes | Function exists and responds |
| **Smoke test passing** | ❌ No | Waiting for real API key |
| **Function logs** | ⏳ Pending | Need to check after setting real key |

---

## 🚀 **NEXT STEPS**

1. **MANUS:** Get real API key from Render/password manager
2. **MANUS:** Set `CLAUSEBOT_KEY` with real value
3. **MANUS:** Redeploy (if needed) or wait 1-2 minutes
4. **MANUS:** Re-run smoke test
5. **MANUS:** Paste results back here

---

## 💡 **QUICK REFERENCE**

**Get Key from Render:**
1. https://dashboard.render.com
2. Service: `clausebot-api`
3. Environment tab
4. Look for: `CLAUSEBOT_API_KEY` or `API_KEY`

**Set in Netlify:**
```powershell
netlify env:set CLAUSEBOT_KEY "<paste_key_here>"
```

**Test:**
```powershell
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' `
  -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json -Depth 6
```

---

**Status:** 🟡 **WAITING FOR REAL API KEY**  
**Blocked On:** MANUS needs to get actual ClauseBot API key and set it

