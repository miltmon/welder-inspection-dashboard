# Request ClauseBot API Key - Email/Slack Template

**Use this template to request the ClauseBot API key from your Ops/Dev team.**

---

## **Email Template**

**Subject:** Request: ClauseBot API Key for WeldTrack™ Netlify Deployment

**Body:**

```
Hi [Ops Team / Dev Lead],

I need a server-side API key for ClauseBot to complete the WeldTrack™ v7.0.0 deployment on Netlify.

**Details:**
- **Site:** weldtrack-inspector (Netlify)
- **Site ID:** 796579bb-0b32-4b2f-a821-165c8b0175e3
- **Purpose:** Serverless function (`codex-query`) needs read-only retrieval access
- **Scope:** Read-only / retrieval only (no admin permissions needed)

**What I need:**
1. **CLAUSEBOT_KEY** - API key/token (format: `sk_...` or similar)
2. **CLAUSEBOT_ENDPOINT** - API endpoint URL (if different from default)

**Security:**
- Please share the key via our secure vault (1Password/LastPass) or DM me directly
- Do NOT paste the key in public channels or email threads
- I'll set it as a Netlify environment variable (encrypted at rest)

**Timeline:**
- Needed: ASAP (deployment blocked on this)
- Once I have it, I can complete the setup in ~5 minutes

Thanks!
[Milton]
```

---

## **Slack/Teams Template**

```
Hey @ops-team — quick request:

Need a ClauseBot API key for WeldTrack™ Netlify deployment.

**What:** Server-side API key (read-only retrieval scope)
**Where:** Netlify site `weldtrack-inspector` (env var: `CLAUSEBOT_KEY`)
**Why:** Serverless function needs to call ClauseBot API

Can you generate one and share via 1Password/secure vault? 
Once I have it, I'll set it up and we're good to go.

Thanks! 🚀
```

---

## **Where to Find the Key (If You Have Access)**

### **Option 1: ClauseBot Admin Dashboard**
1. Log in to ClauseBot admin console
2. Navigate to: **Settings → API Keys** or **Integrations → Service Tokens**
3. Generate a new key with **read-only** scope
4. Copy the key (format: `sk_...` or similar)

### **Option 2: Password Manager**
Search for:
- `clausebot`
- `clause_bot`
- `cb_key`
- `CLAUSEBOT_KEY`

### **Option 3: CI/CD Secrets**
Check:
- GitHub Actions secrets
- Netlify environment variables (other sites)
- Terraform variables
- AWS Secrets Manager / GCP Secret Manager

### **Option 4: Ask the Team**
- **Who set up ClauseBot?** → Ask them for the key
- **Who manages API keys?** → Request a new one
- **Platform/DevOps team** → They can generate one

---

## **After You Get the Key**

### **Quick Setup (CLI)**

```powershell
cd "C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard"
.\scripts\set-clausebot-env.ps1
```

Or manually:

```powershell
$SITE="796579bb-0b32-4b2f-a821-165c8b0175e3"
netlify env:set CLAUSEBOT_KEY "sk_YOUR_KEY_HERE" --site $SITE
netlify env:set CLAUSEBOT_ENDPOINT "https://api.clausebot.internal/retrieve" --site $SITE
```

### **Verify**

```powershell
netlify env:list --site 796579bb-0b32-4b2f-a821-165c8b0175e3
```

### **Test**

```powershell
.\scripts\test-codex-debug.ps1
```

---

## **Security Checklist**

- [ ] Key shared via secure channel (vault/DM, not public chat)
- [ ] Key has read-only scope (no admin permissions)
- [ ] Key set as Netlify environment variable (encrypted)
- [ ] Key not committed to Git
- [ ] Key rotated if ever exposed

---

**Ready to request?** Copy the email/Slack template above and send it to your Ops team!

