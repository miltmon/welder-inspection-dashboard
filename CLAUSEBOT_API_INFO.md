# ClauseBot API Configuration for WeldTrack™

**Quick reference for setting up ClauseBot API integration.**

---

## **API Endpoint**

**Production API URL:**
```
https://clausebot-api.onrender.com
```

**Retrieve Endpoint (for CODEX function):**
```
https://clausebot-api.onrender.com/v1/retrieve
```

---

## **Where to Find Your API Key**

### **Option 1: Render Dashboard (Most Likely)**

Your ClauseBot API is deployed on **Render**. The API key is stored in Render's environment variables.

**Steps:**
1. Go to: https://dashboard.render.com
2. Find your service: **`clausebot-api`**
3. Click on the service
4. Go to: **Environment** tab
5. Look for: **`CLAUSEBOT_API_KEY`** or **`API_KEY`**

**If you don't see it:**
- The API might be **public** (no key required)
- Or the key might be named differently
- Check the Render logs for authentication errors

---

### **Option 2: Check API Authentication**

Test if the API requires authentication:

```powershell
# Test without auth
curl https://clausebot-api.onrender.com/v1/healthz

# Test with Bearer token (if you have a key)
curl -H "Authorization: Bearer YOUR_KEY" https://clausebot-api.onrender.com/v1/retrieve
```

---

### **Option 3: Check Your Password Manager**

Search for:
- `clausebot`
- `clausebot-api`
- `render api key`
- `clausebot onrender`

---

## **API Key Format**

Based on the codebase, the API uses **Bearer token** authentication:

```javascript
headers: {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
}
```

The key format might be:
- Simple string (e.g., `prod_read`, `readonly_key`)
- UUID format (e.g., `abc123-def456-...`)
- Custom format

---

## **For Netlify Environment Variables**

### **If API Requires Authentication:**

**In Netlify UI (you're already there):**

1. **Key:** `CLAUSEBOT_KEY`
   - **Value:** Your API key from Render
   - **Secret:** ✅ Check "Contains secret values"

2. **Key:** `CLAUSEBOT_ENDPOINT`
   - **Value:** `https://clausebot-api.onrender.com/v1/retrieve`
   - **Secret:** ❌ Not needed (endpoint is public)

---

### **If API is Public (No Key Required):**

**In Netlify UI:**

1. **Key:** `CLAUSEBOT_ENDPOINT`
   - **Value:** `https://clausebot-api.onrender.com/v1/retrieve`
   - **Secret:** ❌ Not needed

2. **Leave `CLAUSEBOT_KEY` empty** or set to a placeholder
   - The function will handle missing keys gracefully

---

## **Quick Test**

After setting the variables, test the API:

```powershell
# Test the CODEX function
.\scripts\test-codex-debug.ps1

# Or test API directly
curl -X POST "https://clausebot-api.onrender.com/v1/retrieve" `
  -H "Content-Type: application/json" `
  -d '{"query":"preheat clause 6.5","top_k":3}'
```

---

## **Next Steps**

1. **Check Render Dashboard** → Find `CLAUSEBOT_API_KEY` in environment variables
2. **If found:** Add it to Netlify as `CLAUSEBOT_KEY`
3. **If not found:** API might be public - just set `CLAUSEBOT_ENDPOINT`
4. **Test:** Run `.\scripts\test-codex-debug.ps1` to verify

---

## **Render Dashboard Links**

- **Render Dashboard:** https://dashboard.render.com
- **ClauseBot API Service:** Look for `clausebot-api` service
- **Environment Variables:** Service → Environment tab

---

**Need help?** If you can't find the key in Render, the API might be public. Try setting just the endpoint and test!

