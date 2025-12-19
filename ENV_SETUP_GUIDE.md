# Environment Variables Setup Guide

**Quick reference for setting ClauseBot environment variables on Netlify.**

---

## **Method 1: Interactive Script (Recommended)**

**Easiest and most secure:**

```powershell
cd "C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard"
.\scripts\set-clausebot-env.ps1
```

This script will:
- ✅ Prompt you for the key (hidden input)
- ✅ Set both `CLAUSEBOT_KEY` and `CLAUSEBOT_ENDPOINT`
- ✅ Optionally set `VITE_CLAUSEBOT_ENDPOINT` for frontend
- ✅ Verify the setup

---

## **Method 2: Manual CLI Commands**

**If you prefer manual control:**

```powershell
$SITE="796579bb-0b32-4b2f-a821-165c8b0175e3"

# Set CLAUSEBOT_KEY (replace with your actual key)
netlify env:set CLAUSEBOT_KEY "sk_YOUR_ACTUAL_KEY_HERE" --site $SITE

# Set CLAUSEBOT_ENDPOINT
netlify env:set CLAUSEBOT_ENDPOINT "https://api.clausebot.internal/retrieve" --site $SITE

# Optional: Set for frontend (if needed)
netlify env:set VITE_CLAUSEBOT_ENDPOINT "https://api.clausebot.internal/retrieve" --site $SITE
```

---

## **Method 3: Netlify UI (Visual)**

1. **Open Netlify Dashboard:**
   - Go to: https://app.netlify.com/projects/weldtrack-inspector
   - Click: **Site settings** → **Build & deploy** → **Environment**

2. **Add Variables:**
   - Click **Add variable**
   - **Key:** `CLAUSEBOT_KEY`
   - **Value:** `sk_YOUR_ACTUAL_KEY_HERE`
   - **Scopes:** Production, Deploy previews (check both)
   - Click **Save**

3. **Add Endpoint:**
   - Click **Add variable** again
   - **Key:** `CLAUSEBOT_ENDPOINT`
   - **Value:** `https://api.clausebot.internal/retrieve`
   - **Scopes:** Production, Deploy previews (check both)
   - Click **Save**

4. **Optional - Frontend Endpoint:**
   - Click **Add variable** again
   - **Key:** `VITE_CLAUSEBOT_ENDPOINT`
   - **Value:** `https://api.clausebot.internal/retrieve`
   - **Scopes:** Production, Deploy previews (check both)
   - Click **Save**

---

## **Verify Setup**

### **Check Environment Variables:**

```powershell
netlify env:list --site 796579bb-0b32-4b2f-a821-165c8b0175e3
```

**Expected output:**
```
CLAUSEBOT_KEY          [hidden]
CLAUSEBOT_ENDPOINT     https://api.clausebot.internal/retrieve
VITE_CLAUSEBOT_ENDPOINT https://api.clausebot.internal/retrieve
```

### **Test Function:**

```powershell
.\scripts\test-codex-debug.ps1
```

**Expected response (after env vars set):**
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

### **Check Function Logs:**

Visit: https://app.netlify.com/projects/weldtrack-inspector/logs-and-metrics/functions

**Expected logs (after env vars set):**
```
codex-query invoked at 2025-12-16T...
ENV CLAUSEBOT_KEY = sk_ab...xyz9  (masked)
ENV CLAUSEBOT_ENDPOINT = https://api.clausebot.internal/retrieve
incoming payload preview: { q: 'preheat clause 6.5', top_k: 3 }
```

---

## **Troubleshooting**

### **Issue: "CLAUSEBOT_KEY not set"**

**Solution:**
1. Verify env vars are set: `netlify env:list`
2. Check variable name (must be exactly `CLAUSEBOT_KEY`)
3. Ensure scopes include "Production"
4. Test function again

### **Issue: "401 Unauthorized"**

**Solution:**
1. Verify API key is correct (check first/last 4 chars in logs)
2. Ensure key has read-only scope
3. Check endpoint URL is correct
4. Contact Ops to verify key is active

### **Issue: "Network error" or "Could not resolve host"**

**Solution:**
1. Verify `CLAUSEBOT_ENDPOINT` is set correctly
2. Check endpoint URL is accessible from Netlify
3. If internal endpoint, ensure Netlify can reach it (VPN/proxy)

---

## **Security Best Practices**

- ✅ **Never commit keys to Git** - Use `.gitignore` for `.env` files
- ✅ **Use read-only keys** - No admin permissions needed
- ✅ **Rotate keys regularly** - Every 90 days or after exposure
- ✅ **Share keys securely** - Use vault/DM, not public channels
- ✅ **Monitor usage** - Check function logs for suspicious activity

---

## **Next Steps After Setup**

1. ✅ **Remove debug logging** - Edit `netlify/functions/codex-query.js` and remove `console.log` lines
2. ✅ **Redeploy** - `netlify deploy --prod --dir=dist`
3. ✅ **Test production** - Verify function works end-to-end
4. ✅ **Monitor logs** - Check for errors in first 24 hours

---

## **Quick Reference**

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `CLAUSEBOT_KEY` | API authentication | ✅ Yes | `sk_abc123...xyz9` |
| `CLAUSEBOT_ENDPOINT` | API endpoint URL | ✅ Yes | `https://api.clausebot.internal/retrieve` |
| `VITE_CLAUSEBOT_ENDPOINT` | Frontend endpoint (if needed) | ⚠️ Optional | `https://api.clausebot.internal/retrieve` |

---

**Need help?** Check `scripts/REQUEST_CLAUSEBOT_KEY.md` for a template to request the key from your Ops team.

