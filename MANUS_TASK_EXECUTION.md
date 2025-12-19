# MANUS Task Execution — Environment Variables & CODEX Validation

**Date:** December 16, 2025  
**Owner:** MANUS  
**Priority:** P0  
**Status:** 🔴 **IN PROGRESS**

---

## 📊 **CURRENT STATE ANALYSIS**

### **Environment Variables Currently Set:**
```
CLAUSEBOT_API_KEY  | [hidden] | All scopes
CLAUSEBOT_ENDPOINT | https://clausebot-api.onrender.com/v1/retrieve | All scopes
```

### **Issue Identified:**
The CODEX function expects `CLAUSEBOT_KEY` but the environment variable is set as `CLAUSEBOT_API_KEY`.

**Function Code Check:**
```javascript
const clausebotKey = process.env.CLAUSEBOT_KEY || process.env.VITE_CLAUSEBOT_KEY;
const clausebotEndpoint = process.env.CLAUSEBOT_ENDPOINT || process.env.VITE_CLAUSEBOT_ENDPOINT || 'https://api.clausebot.internal/retrieve';
```

**Current Error:**
```json
{
  "error": "Server configuration error: CLAUSEBOT_KEY not set",
  "hint": "Set CLAUSEBOT_KEY in Netlify environment variables"
}
```

---

## ✅ **REQUIRED ACTIONS**

### **Step 1: Set CLAUSEBOT_KEY (Critical)**

**Problem:** Function looks for `CLAUSEBOT_KEY` but only `CLAUSEBOT_API_KEY` exists.

**Solution:** Set `CLAUSEBOT_KEY` with the same value as `CLAUSEBOT_API_KEY`.

**Commands to Run:**

```powershell
# Get the actual key value (you'll need to enter this manually or from your password manager)
# Then set it as CLAUSEBOT_KEY:

netlify env:set CLAUSEBOT_KEY "<YOUR_ACTUAL_CLAUSEBOT_API_KEY_VALUE>"

# Verify it's set:
netlify env:list
```

**Note:** Since the site is already linked, you don't need `--site` flag. The CLI uses the linked site automatically.

---

### **Step 2: Verify CLAUSEBOT_ENDPOINT**

**Current Value:** `https://clausebot-api.onrender.com/v1/retrieve`

**Status:** ✅ **CORRECT** — This matches the actual ClauseBot API endpoint.

**No action needed** — endpoint is already set correctly.

---

### **Step 3: Optional — Set VITE_CLAUSEBOT_ENDPOINT**

Only needed if frontend needs the endpoint at build-time:

```powershell
netlify env:set VITE_CLAUSEBOT_ENDPOINT "https://clausebot-api.onrender.com/v1/retrieve"
```

**Status:** ⚠️ **OPTIONAL** — Only if frontend code needs it.

---

### **Step 4: Verify Environment Variables**

```powershell
netlify env:list
```

**Expected Output:**
```
Environment variables for project weldtrack-inspector:
- CLAUSEBOT_KEY          [hidden] | All scopes
- CLAUSEBOT_ENDPOINT     https://clausebot-api.onrender.com/v1/retrieve | All scopes
- CLAUSEBOT_API_KEY      [hidden] | All scopes (existing, can keep or remove)
- VITE_CLAUSEBOT_ENDPOINT [optional] | All scopes
```

---

### **Step 5: CODEX Smoke Test**

```powershell
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' `
  -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json -Depth 6
```

**Expected Success Response:**
```json
{
  "query": "preheat clause 6.5",
  "results": [
    {
      "score": 0.92,
      "text": "...",
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

---

### **Step 6: If Error Occurs — Collect Function Logs**

```powershell
netlify functions:log --name=codex-query
```

**Paste last 30 lines** if smoke test fails.

---

## 🔍 **DIAGNOSIS SUMMARY**

### **Root Cause:**
Environment variable name mismatch:
- **Set:** `CLAUSEBOT_API_KEY`
- **Expected:** `CLAUSEBOT_KEY`

### **Fix:**
Set `CLAUSEBOT_KEY` with the same value as `CLAUSEBOT_API_KEY` (or get the actual key from Render/password manager).

### **Endpoint Status:**
✅ **CORRECT** — `https://clausebot-api.onrender.com/v1/retrieve` is the right endpoint.

---

## 📋 **WHAT TO PASTE BACK**

After running the commands, paste:

1. **`netlify env:list` output** — Showing `CLAUSEBOT_KEY` is now set
2. **CODEX smoke test JSON** — Full response from `Invoke-RestMethod`
3. **If error:** Last 30 lines of `netlify functions:log --name=codex-query`

---

## 🚀 **QUICK FIX COMMANDS**

**If you have the actual API key:**

```powershell
# Set CLAUSEBOT_KEY (replace with actual key)
netlify env:set CLAUSEBOT_KEY "sk_YOUR_ACTUAL_KEY_HERE"

# Verify
netlify env:list

# Test
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' `
  -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json -Depth 6
```

**If you need to get the key from Render:**
1. Go to: https://dashboard.render.com
2. Find service: `clausebot-api`
3. Go to: Environment tab
4. Look for: `CLAUSEBOT_API_KEY` or `API_KEY`
5. Copy the value
6. Set it as `CLAUSEBOT_KEY` in Netlify

---

## ✅ **ACCEPTANCE CRITERIA**

- [ ] `CLAUSEBOT_KEY` environment variable set in Netlify
- [ ] `netlify env:list` shows `CLAUSEBOT_KEY` (not just `CLAUSEBOT_API_KEY`)
- [ ] CODEX smoke test returns HTTP 200
- [ ] Response JSON contains `results` array
- [ ] Each result has `metadata.NLM_ID` and `metadata.Code_Reference_Primary`

---

**Status:** 🔴 **WAITING FOR API KEY**  
**Next:** Set `CLAUSEBOT_KEY` with actual key value, then run smoke test

