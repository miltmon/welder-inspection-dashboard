# 🔧 CODEX Endpoint Fix Instructions

**Issue:** CODEX function returning 404 from ClauseBot API  
**Root Cause:** Endpoint `/v1/retrieve` doesn't exist  
**Solution:** Update to `/v1/search/clause`

---

## ✅ **PRODUCTION DEPLOYMENT CONFIRMED**

**Deploy ID:** `6941f2905c1851014c40059e`  
**Production URL:** https://weldtrack-inspector.netlify.app  
**Status:** ✅ **LIVE**

---

## 🔧 **UPDATE ENDPOINT (Choose One Method)**

### **Method 1: Netlify UI (Recommended - Easiest)**

1. Go to: https://app.netlify.com/projects/weldtrack-inspector/configuration/env
2. Find `CLAUSEBOT_ENDPOINT` in the list
3. Click **"Edit"** or **"Update"**
4. Change value from:
   ```
   https://clausebot-api.onrender.com/v1/retrieve
   ```
   To:
   ```
   https://clausebot-api.onrender.com/v1/search/clause
   ```
5. Click **"Save"** or **"Update variable"**
6. **No redeploy needed** - Functions read env vars at runtime

### **Method 2: Netlify CLI (If Site is Linked)**

If your local directory is linked to the site:

```powershell
cd "C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard"
netlify env:set CLAUSEBOT_ENDPOINT "https://clausebot-api.onrender.com/v1/search/clause"
```

**Note:** If you get "unknown option '--site'", the site may not be linked. Use Method 1 instead.

### **Method 3: Link Site First, Then Set**

```powershell
# Link the site
netlify link --id 796579bb-0b32-4b2f-a821-165c8b0175e3

# Then set the env var
netlify env:set CLAUSEBOT_ENDPOINT "https://clausebot-api.onrender.com/v1/search/clause"
```

---

## 🧪 **TEST AFTER UPDATE**

Wait 10-30 seconds for the env var to propagate, then test:

```powershell
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json -Depth 6
```

**Expected Success Response:**
```json
{
  "query": "preheat clause 6.5",
  "results": [
    {
      "score": 0.92,
      "text": "Preheat temperature requirements...",
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

**If Still 404:**
- Check the endpoint URL is correct in Netlify UI
- Verify ClauseBot API is accessible: `curl https://clausebot-api.onrender.com/v1/search/clause`
- Check function logs: https://app.netlify.com/projects/weldtrack-inspector/logs-and-metrics/functions/codex-query

---

## 📊 **CURRENT STATUS**

- ✅ **Production Deployed:** Deploy ID `6941f2905c1851014c40059e`
- ✅ **Function Deployed:** `codex-query.js` active
- ✅ **Environment Variables:** `CLAUSEBOT_KEY` set
- ⚠️ **Endpoint:** Needs update from `/v1/retrieve` → `/v1/search/clause`
- ⏳ **Verification:** Pending endpoint update test

---

## 🎯 **NEXT STEPS AFTER FIX**

1. ✅ Update endpoint (Method 1 above)
2. ✅ Test CODEX function (command above)
3. ✅ Verify response includes `metadata.NLM_ID` and `metadata.Code_Reference_Primary`
4. ✅ Remove debug logging (CURSOR task)
5. ✅ Create optimization PR (WINDSURF task)

---

**Quick Link:** https://app.netlify.com/projects/weldtrack-inspector/configuration/env#CLAUSEBOT_ENDPOINT

