# 🔍 codex-query Zero Results Diagnosis Guide

**Issue:** Function returns 200 OK but `count: 0` (empty results)  
**Status:** Function working, need to diagnose ClauseBot API response

---

## 📋 **DIAGNOSIS CHECKLIST**

### **Step A: Get Netlify Function Logs**

1. Go to: https://app.netlify.com/sites/weldtrack-inspector/functions/codex-query
2. Click on the latest invocation
3. Copy the log block showing:
   - `"Calling ClauseBot API: ..."`
   - `"API Response Status: ..."`
   - `"API Response Body (raw): ..."`
   - `"API hits count: ..."`

**Paste that log block here.**

---

### **Step B: Run Direct API Test**

Run the diagnostic script:

```powershell
cd C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard
.\diagnose-codex-zero-results.ps1
```

This will test:
- GET method (as function uses): `/v1/clauses/search/{term}?limit=3`
- POST method (analyze endpoint): `/v1/clauses/analyze`
- Alternative queries to find matching data

**Paste the JSON output from the direct API test.**

---

### **Step C: Enhanced Debug Function**

I've created an enhanced version of the function with comprehensive logging:

**File:** `.netlify/functions/codex-query.js` (already updated)

**New logs include:**
- Incoming event structure
- Parsed request body
- API URL being called
- Request headers (masked API key)
- Response status and headers
- **Full API response body (raw JSON)**
- Hits count and transformation details

**To deploy with enhanced logging:**

```powershell
cd C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard

$env:NETLIFY_SITE_ID = "796579bb-0b32-4b2f-a821-165c8b0175e3"
netlify deploy --prod --site $env:NETLIFY_SITE_ID --dir=dist --functions=.netlify/functions
```

Then test again and check logs for the full API response.

---

## 🎯 **MOST LIKELY CAUSES**

### **1. ClauseBot API Returns Empty Hits**

**Symptom:** API returns 200 but `hits: []` or `total_hits: 0`

**Possible reasons:**
- Query doesn't match indexed content
- SSOT database has no matching snippets
- Query phrasing too specific

**Solution:** Try alternative queries (script tests these automatically):
- `"preheat"` (broader)
- `"AWS D1.1 preheat minimum temperature"`
- `"minimum preheat temperature"`
- `"AWS D1.1 Clause 6.5"`

### **2. Query Encoding Issue**

**Symptom:** URL encoding might be wrong

**Check:** Function logs show the exact URL being called. Verify:
- Query is properly URL-encoded
- No double-encoding
- Special characters handled correctly

### **3. API Endpoint Mismatch**

**Symptom:** Function calls wrong endpoint

**Check:** Function logs show `"Calling ClauseBot API: ..."`. Verify:
- Endpoint is: `https://clausebot-api.onrender.com/v1/clauses/search/{term}?limit={number}`
- Not: `/v1/clauses/analyze` or other endpoint

---

## 🔧 **QUICK FIXES**

### **Fix 1: Try Broader Query**

If direct API test shows zero results, try:

```powershell
# Test with broader query
$payload = @{ q = "preheat"; top_k = 10 } | ConvertTo-Json
Invoke-RestMethod -Uri "https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query" `
  -Method Post -ContentType "application/json" -Body $payload | ConvertTo-Json
```

### **Fix 2: Check SSOT Data**

If API consistently returns zero results, check if SSOT has data:

```sql
-- Check SSOT snippets table
SELECT COUNT(*) FROM ssot_snippets WHERE snippet_text ILIKE '%preheat%';
```

If count is 0, need to seed SSOT data.

### **Fix 3: Verify API Endpoint**

Confirm the correct endpoint structure:

```powershell
# Test GET endpoint directly
$headers = @{
    'Authorization' = 'Bearer cb_mobile_2025_secure_key_12345'
    'Accept' = 'application/json'
}
Invoke-RestMethod -Uri "https://clausebot-api.onrender.com/v1/clauses/search/preheat?limit=3" `
    -Method Get -Headers $headers | ConvertTo-Json -Depth 6
```

---

## 📊 **WHAT TO PASTE BACK**

1. **Netlify function log block** (from Step A)
2. **Direct API test JSON output** (from Step B)

Once I have both, I can:
- ✅ Identify if ClauseBot API is returning empty data
- ✅ Identify if function is mis-forwarding the query
- ✅ Provide exact fix (query change, endpoint change, or SSOT seeding)

---

## 🚀 **NEXT STEPS**

1. **Run diagnostic script:**
   ```powershell
   .\diagnose-codex-zero-results.ps1
   ```

2. **Deploy enhanced debug function** (already copied to `.netlify/functions/codex-query.js`):
   ```powershell
   netlify deploy --prod --site $env:NETLIFY_SITE_ID --dir=dist --functions=.netlify/functions
   ```

3. **Test and check logs:**
   ```powershell
   .\test-codex-function.ps1
   ```
   Then check: https://app.netlify.com/sites/weldtrack-inspector/functions/codex-query

4. **Paste outputs** from Steps A and B

---

**Status:** Ready for diagnosis  
**Confidence:** 90% - Function code is correct, likely API data or query matching issue

