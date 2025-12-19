# 🔧 Netlify Environment Variable Fix

**Issue:** `CLAUSEBOT_API_KEY` is set to literal string `CLAUSEBOT_API_KEY_PROD` instead of actual API key  
**Status:** ✅ Root cause identified by COMET  
**Fix:** Update environment variable value and redeploy

---

## ✅ **CONFIRMED BY COMET**

- ✅ `CLAUSEBOT_API_KEY` exists in Netlify
- ✅ `CLAUSEBOT_ENDPOINT` is correctly set
- ❌ **`CLAUSEBOT_API_KEY` value is wrong:** `CLAUSEBOT_API_KEY_PROD` (literal string)
- ✅ **Should be:** `cb_mobile_2025_secure_key_12345` (actual API key)

---

## 🚀 **FIX STEPS**

### **Step 1: Update Environment Variable**

1. **Go to Netlify Dashboard:**
   - https://app.netlify.com/projects/weldtrack-inspector/configuration/env

2. **Find `CLAUSEBOT_API_KEY`:**
   - Click on the variable name

3. **Edit the value:**
   - Click "Options" → "Edit variable"
   - In the **Production** field, change:
     - ❌ **From:** `CLAUSEBOT_API_KEY_PROD`
     - ✅ **To:** `cb_mobile_2025_secure_key_12345`
   - Click "Save"

4. **Verify:**
   - The Production value should now show: `cb_mobile_2025_secure_key_12345`
   - (The value will be masked as `cb_m...` for security)

---

### **Step 2: Redeploy Function**

**Environment variable changes require a redeploy to take effect.**

#### **Option A: Using PowerShell Script (Recommended)**

```powershell
cd C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard
.\fix-netlify-env-vars.ps1
```

This script will:
- Guide you through updating the env var
- Redeploy the function
- Test the function
- Show verification steps

#### **Option B: Manual Netlify CLI**

```powershell
cd C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard

$env:NETLIFY_SITE_ID = "796579bb-0b32-4b2f-a821-165c8b0175e3"
netlify deploy --prod --site $env:NETLIFY_SITE_ID --dir=dist --functions=.netlify/functions
```

#### **Option C: Git Push (if repo connected)**

```powershell
git commit --allow-empty -m "trigger redeploy after env var fix"
git push
```

**Note:** Wait 15-30 seconds after redeploy for function to update.

---

### **Step 3: Verify Function Works**

#### **Test via PowerShell:**

```powershell
cd C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard
.\test-codex-function.ps1
```

#### **Test via curl:**

```powershell
curl -X POST "https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query" `
  -H "Content-Type: application/json" `
  -d '{"q":"preheat clause 6.5","top_k":3}' | ConvertFrom-Json
```

#### **Expected Result:**

```json
{
  "query": "preheat clause 6.5",
  "results": [
    {
      "score": 0.92,
      "text": "...",
      "metadata": {
        "NLM_ID": "...",
        "Code_Reference_Primary": "..."
      }
    }
  ],
  "count": 3,
  "timestamp": "2025-12-18T..."
}
```

**Success criteria:**
- ✅ `results` array is **not empty**
- ✅ `count` > 0
- ✅ Each result has `text`, `score`, and `metadata`

---

### **Step 4: Check Function Logs**

After testing, verify in logs:

**URL:** https://app.netlify.com/sites/weldtrack-inspector/functions/codex-query

**Look for these log lines:**

```
✅ codex-query invoked at 2025-12-18T...
✅ ENV CLAUSEBOT_API_KEY = cb_mo...2345  (should show masked key, not "CLAUSEBOT_API_KEY_PROD")
✅ Calling ClauseBot API: https://clausebot-api.onrender.com/v1/clauses/search/...
✅ Using API key: cb_mo...2345
✅ API Response Status: 200 OK
✅ API response received: { search_term: 'preheat', total_hits: 1, hits_count: 1 }
✅ Transformed results: 1 items
```

**If you see:**
- ❌ `"Missing CLAUSEBOT_API_KEY"` → Variable not set correctly
- ❌ `"Using API key: CLAUSEBOT_API_KEY_PROD"` → Variable still has wrong value
- ❌ `"API Response Status: 401"` → API key invalid
- ✅ `"Transformed results: X items"` (X > 0) → **SUCCESS!**

---

## ✅ **VERIFICATION CHECKLIST**

After completing all steps:

- [ ] `CLAUSEBOT_API_KEY` value updated in Netlify dashboard
- [ ] Production value is `cb_mobile_2025_secure_key_12345` (not `CLAUSEBOT_API_KEY_PROD`)
- [ ] Function redeployed after env var update
- [ ] Waited 15-30 seconds for function to update
- [ ] Test returns non-empty `results` array
- [ ] Function logs show "Using API key: cb_m..." (masked)
- [ ] Function logs show "API Response Status: 200"
- [ ] Function logs show "Transformed results: X items" (X > 0)

---

## 🎯 **SUMMARY**

**Root Cause:** Environment variable had variable name as value instead of actual API key  
**Fix:** Update `CLAUSEBOT_API_KEY` to `cb_mobile_2025_secure_key_12345` in Netlify dashboard  
**Action:** Redeploy function after updating env var  
**Status:** Ready to fix - script provided for automation

---

**Credits:** Issue identified by COMET  
**Next:** Run `fix-netlify-env-vars.ps1` to automate the fix

