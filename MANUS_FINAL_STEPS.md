# MANUS Final Steps — Set CLAUSEBOT_KEY from Netlify Dashboard

**Date:** December 16, 2025  
**Status:** 🎯 **READY TO COMPLETE**

---

## 🎯 **WHAT YOU'RE LOOKING AT**

You're on the Netlify Environment Variables page:
**https://app.netlify.com/projects/weldtrack-inspector/configuration/env#CLAUSEBOT_API_KEY**

You can see `CLAUSEBOT_API_KEY` is already set. Now you need to copy that value and set it as `CLAUSEBOT_KEY` (which the CODEX function expects).

---

## ✅ **STEP-BY-STEP INSTRUCTIONS**

### **Option A: Using Netlify Dashboard (Easiest)**

1. **On the page you're viewing:**
   - Find `CLAUSEBOT_API_KEY` in the list
   - Click on it to view/edit
   - Click "Show value" or copy the value
   - **Copy the entire key value** (not just the prefix)

2. **Add New Variable:**
   - Click **"Add a variable"** button
   - **Key:** `CLAUSEBOT_KEY`
   - **Value:** Paste the value you copied from `CLAUSEBOT_API_KEY`
   - **Scopes:** Check "All scopes" (Production, Deploy previews, Branch deploys)
   - **Contains secret values:** ✅ Check this box
   - Click **"Add variable"** or **"Create variable"**

3. **Verify:**
   - You should now see both:
     - `CLAUSEBOT_API_KEY` (existing)
     - `CLAUSEBOT_KEY` (new)

---

### **Option B: Using PowerShell (If You Prefer CLI)**

1. **Get the value from Netlify Dashboard:**
   - View `CLAUSEBOT_API_KEY` value
   - Copy it

2. **Set it via CLI:**
   ```powershell
   # Replace <PASTE_THE_VALUE_HERE> with the actual key you copied
   netlify env:set CLAUSEBOT_KEY "<PASTE_THE_VALUE_HERE>"
   
   # Verify
   netlify env:list
   ```

3. **Or use the helper script:**
   ```powershell
   .\scripts\set-clausebot-key.ps1
   # It will prompt you to enter the key securely
   ```

---

## 🧪 **AFTER SETTING THE KEY — TEST CODEX**

### **Step 1: Wait 1-2 Minutes**
Netlify functions cache environment variables. Wait a moment for the change to propagate.

### **Step 2: Test CODEX Function**

```powershell
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' `
  -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json -Depth 6
```

### **Step 3: Expected Success Response**

```json
{
  "query": "preheat clause 6.5",
  "results": [
    {
      "score": 0.92,
      "text": "Preheat requirements for AWS D1.1 Clause 6.5...",
      "metadata": {
        "NLM_ID": "nlm://doc123#chunk45",
        "Code_Reference_Primary": "AWS D1.1:2020 Clause 6.5",
        "SME_Reviewer_Initials": "MAJ"
      }
    },
    {
      "score": 0.87,
      "text": "...",
      "metadata": {
        "NLM_ID": "...",
        "Code_Reference_Primary": "..."
      }
    }
  ],
  "count": 3,
  "timestamp": "2025-12-16T..."
}
```

---

## 🔍 **IF TEST STILL FAILS**

### **Check Function Logs:**

Visit: **https://app.netlify.com/projects/weldtrack-inspector/logs-and-metrics/functions**

Look for:
- `ENV CLAUSEBOT_KEY = sk_ab...xyz9` (masked, not MISSING)
- Any API errors (401, 403, network errors)
- Endpoint reachability issues

### **Possible Issues:**

1. **Key not propagated yet:** Wait 2-3 minutes, then test again
2. **Wrong key format:** Ensure you copied the complete key value
3. **Function needs redeploy:** May need to trigger a redeploy to pick up new env var

**If redeploy needed:**
```powershell
cd "C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard"
npm run build
netlify deploy --prod --dir=dist
```

---

## 📋 **WHAT TO PASTE BACK**

After setting the key and testing:

1. **Confirmation:** "CLAUSEBOT_KEY set in Netlify dashboard"
2. **`netlify env:list` output** (or screenshot of Netlify dashboard showing both variables)
3. **CODEX smoke test JSON** — Full response (success or error)
4. **If error:** Screenshot or paste of function logs from Netlify dashboard

---

## 🎯 **QUICK CHECKLIST**

- [ ] Opened Netlify environment variables page
- [ ] Found `CLAUSEBOT_API_KEY` value
- [ ] Copied the complete key value
- [ ] Added new variable `CLAUSEBOT_KEY` with that value
- [ ] Verified both variables exist
- [ ] Waited 1-2 minutes
- [ ] Ran CODEX smoke test
- [ ] Got success response OR collected error logs

---

## 🚀 **YOU'RE ALMOST THERE!**

Once you:
1. Set `CLAUSEBOT_KEY` with the value from `CLAUSEBOT_API_KEY`
2. Test the CODEX function
3. Paste the results back

**Then we're done with MANUS's task and can move to CURSOR's debug removal!** 🎉

---

**Status:** 🟡 **WAITING FOR KEY SET & TEST RESULTS**  
**Next:** Set key → Test → Paste results

