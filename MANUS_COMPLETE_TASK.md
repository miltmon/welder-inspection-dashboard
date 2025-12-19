# MANUS Task — Complete Instructions

**Date:** December 16, 2025  
**Status:** 🟡 **WAITING FOR REAL API KEY**

---

## 🎯 **CURRENT STATUS**

✅ **Environment Variables Set:**
- `CLAUSEBOT_API_KEY` - [hidden] | All scopes
- `CLAUSEBOT_ENDPOINT` - `https://clausebot-api.onrender.com/v1/retrieve` | All scopes
- `CLAUSEBOT_KEY` - **PLACEHOLDER** (`REPLACE_WITH_ACTUAL_KEY`) ← **NEEDS REAL VALUE**

❌ **CODEX Function:** Returns 504 timeout (likely because placeholder key is invalid)

---

## ✅ **STEP 1: SET REAL API KEY**

### **Get the Real Key:**

**Option A: From Render Dashboard**
1. Go to: https://dashboard.render.com
2. Service: `clausebot-api`
3. Environment tab
4. Find: `CLAUSEBOT_API_KEY` or `API_KEY`
5. Copy the **complete value**

**Option B: From Netlify Dashboard**
1. You're already there: https://app.netlify.com/projects/weldtrack-inspector/configuration/env
2. Click on `CLAUSEBOT_API_KEY`
3. Click "Show value"
4. Copy the **complete value**

### **Set the Real Key:**

```powershell
# Replace sk_REAL_KEY_HERE with the actual complete key you copied
netlify env:set CLAUSEBOT_KEY "sk_REAL_KEY_HERE"
```

**Important:** Use the **complete key value**, not just the prefix.

---

## ✅ **STEP 2: VERIFY VARIABLE IS SET**

```powershell
netlify env:list
```

**Expected Output:**
```
Environment variables for project weldtrack-inspector:
- CLAUSEBOT_API_KEY      [hidden] | All scopes
- CLAUSEBOT_ENDPOINT     https://clausebot-api.onrender.com/v1/retrieve | All scopes
- CLAUSEBOT_KEY          [hidden] | All scopes  ← Should show masked value
```

**When pasting back:** Mask the key like `sk_****abcd` (only show last 4 chars).

---

## ✅ **STEP 3: TEST CODEX FUNCTION**

### **Option A: Using Netlify CLI (Recommended)**

```powershell
netlify functions:invoke codex-query --data '{"q":"preheat clause 6.5","top_k":3}'
```

**Advantage:** Uses site-linked context, reads server envs directly.

### **Option B: Public Endpoint Test**

```powershell
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' `
  -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json -Depth 6
```

**Advantage:** Tests actual public endpoint behavior.

---

## ✅ **STEP 4: EXPECTED SUCCESS RESPONSE**

```json
{
  "query": "preheat clause 6.5",
  "results": [
    {
      "score": 0.92,
      "text": "Preheat temperature requirements...",
      "metadata": {
        "NLM_ID": "nlm://doc123#chunk45",
        "Code_Reference_Primary": "AWS D1.1:2020 Clause 6.5",
        "SME_Reviewer_Initials": "MAJ"
      }
    }
  ],
  "count": 3,
  "timestamp": "2025-12-16T..."
}
```

**Key Indicators:**
- ✅ HTTP 200 (not 500, 401, 403, or 504)
- ✅ `results` array present
- ✅ Each result has `metadata.NLM_ID` and `metadata.Code_Reference_Primary`

---

## 🔍 **STEP 5: IF STILL FAILING — CHECK LOGS**

```powershell
netlify functions:log --name=codex-query
```

**Or visit:** https://app.netlify.com/projects/weldtrack-inspector/logs-and-metrics/functions

**Look for:**
- `ENV CLAUSEBOT_KEY = sk_ab...xyz9` (masked, not MISSING)
- `Server configuration error: CLAUSEBOT_KEY not set` (if still placeholder)
- `401 Unauthorized` or `403 Forbidden` (auth issue)
- `504 Gateway Timeout` (API unreachable)
- Network errors (endpoint unreachable)

**Paste last ~30 lines** (mask any secrets).

---

## 📋 **WHAT TO PASTE BACK**

After setting the real key and testing:

1. **`netlify env:list` output** — Masked (show only last 4 chars of key)
2. **CODEX test JSON** — Full response (success or error)
3. **If error:** Last 30 lines of function logs (mask secrets)

---

## 🎯 **QUICK REFERENCE**

### **Set Key:**
```powershell
netlify env:set CLAUSEBOT_KEY "<paste_real_key_here>"
```

### **Verify:**
```powershell
netlify env:list
```

### **Test (Option A - Recommended):**
```powershell
netlify functions:invoke codex-query --data '{"q":"preheat clause 6.5","top_k":3}'
```

### **Test (Option B - Public Endpoint):**
```powershell
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' `
  -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json -Depth 6
```

### **Check Logs:**
```powershell
netlify functions:log --name=codex-query
```

---

## ⚠️ **IMPORTANT NOTES**

1. **No Redeploy Needed:** Netlify functions read `env:set` at runtime. The function will pick up the new key automatically.

2. **Wait 1-2 Minutes:** After setting the key, wait a moment for Netlify to propagate the change.

3. **Mask Secrets:** When pasting results, only show last 4 chars of keys (e.g., `sk_****abcd`).

4. **Endpoint Issue:** The endpoint `/v1/retrieve` returned 404 earlier. We may need to verify the correct endpoint path.

---

## 🚀 **ONCE YOU SET THE REAL KEY**

1. Set `CLAUSEBOT_KEY` with real value
2. Run `netlify env:list` (verify it's set)
3. Run CODEX test (either method above)
4. Paste results back here

**Then I'll:**
- ✅ Confirm CODEX is working
- ✅ Give CURSOR the exact debug removal commands
- ✅ Mark MANUS task as complete

---

**Status:** 🟡 **WAITING FOR REAL API KEY TO BE SET**  
**Next:** Set real key → Test → Paste results

