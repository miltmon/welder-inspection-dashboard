# 🔍 CODEX Function Status Report

**Date:** December 16, 2025  
**Function:** `codex-query` (Netlify serverless)  
**Status:** ⚠️ **DEPLOYED BUT ENDPOINT MISMATCH**

---

## ✅ **WHAT'S WORKING**

1. **Function Deployment:** ✅ Successfully deployed to Netlify
2. **Environment Variables:** ✅ All set correctly
   - `CLAUSEBOT_KEY` - Set (masked)
   - `CLAUSEBOT_ENDPOINT` - Set to `https://clausebot-api.onrender.com/v1/retrieve`
   - `CLAUSEBOT_API_KEY` - Set
3. **Function Invocation:** ✅ Function executes and processes requests
4. **Error Handling:** ✅ Proper error responses returned

---

## ❌ **CURRENT ISSUE**

### **404 Not Found Error**

**Error Response:**
```json
{
  "error": "ClauseBot API request failed",
  "status": 404,
  "details": "{\"detail\":\"Not Found\"}"
}
```

**Root Cause:**  
The CODEX function is calling `https://clausebot-api.onrender.com/v1/retrieve`, but this endpoint **does not exist** on the ClauseBot API.

---

## 🔧 **SOLUTION OPTIONS**

### **Option 1: Update Endpoint to `/v1/search/clause` (Recommended)**

Based on the codebase, ClauseBot API has a `/v1/search/clause` endpoint. Update the environment variable:

```powershell
netlify env:set CLAUSEBOT_ENDPOINT "https://clausebot-api.onrender.com/v1/search/clause" --site 796579bb-0b32-4b2f-a821-165c8b0175e3
```

### **Option 2: Update Endpoint to `/ask`**

If ClauseBot uses the `/ask` endpoint (as seen in API contracts):

```powershell
netlify env:set CLAUSEBOT_ENDPOINT "https://clausebot-api.onrender.com/ask" --site 796579bb-0b32-4b2f-a821-165c8b0175e3
```

### **Option 3: Update Endpoint to `/v1/chat/compliance`**

If using the RAG service endpoint:

```powershell
netlify env:set CLAUSEBOT_ENDPOINT "https://clausebot-api.onrender.com/v1/chat/compliance" --site 796579bb-0b32-4b2f-a821-165c8b0175e3
```

---

## 🧪 **TESTING AFTER FIX**

After updating the endpoint, test with:

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

---

## 📝 **NOTE ABOUT WPS AI FEATURE**

The **WPS AI feature** that's working is using **local clause lookup functions** (`clauseLookup.ts`), not the CODEX function. The "ClauseBot AI Enabled" badge is a UI indicator, but the actual clause suggestions come from static/mock data in the frontend.

To enable **real ClauseBot integration** in WPS AI:
1. Fix the CODEX endpoint (above)
2. Update `WPSGenerator.tsx` to call `/.netlify/functions/codex-query` instead of local `suggestClause()`
3. Handle async API responses in the component

---

## 🎯 **NEXT STEPS**

1. **Identify correct endpoint** - Check ClauseBot API documentation or test endpoints
2. **Update `CLAUSEBOT_ENDPOINT`** - Use one of the options above
3. **Test CODEX function** - Verify it returns valid results
4. **Update WPS AI** (optional) - Integrate real ClauseBot API calls

---

**Status:** ⚠️ **NEEDS ENDPOINT CORRECTION**  
**Priority:** Medium (WPS AI works with local data, CODEX is for future integration)

