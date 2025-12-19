# P5: Codex Production Integration - Execution Plan

**Status:** ✅ Ready to Execute  
**Branch:** `feature/codex-prod-integration`  
**Target:** `main`

---

## ✅ V1 Manifest Lock - CONFIRMED

**Reply:** "Confirmed" ✅

- Code: `AWS_D1_1`
- Edition: `aws_d1_1_2020`
- Thresholds: MCS ≥ 0.85, Traceability ≥ 0.80/0.90, Recall ≥ 0.90
- Schema: JSONPath canonical format

---

## 📋 Repository Information

**Repository:** `welder-inspection-dashboard` (WeldTrack v7)  
**Location:** `C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard\`

**Note:** Currently not a git repository. Need to initialize:
```bash
cd C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard
git init
git remote add origin <your-repo-url>
```

**Netlify Site:** `weldtrack-inspector`  
**Production URL:** https://weldtrack-inspector.netlify.app

---

## 🎯 Endpoint Confirmation

**CODEX Function:** ✅ **CONFIRMED**
- **URL:** `https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query`
- **Method:** POST
- **Content-Type:** `application/json`
- **Body:** `{ "q": "query string", "top_k": 3 }`

**Authorization:** ✅ Handled by Netlify function (no frontend keys needed)

---

## ✅ Implementation Status

### **Already Complete:**
- ✅ Production CODEX integration in `src/services/clausebot.ts`
- ✅ Retry/backoff logic (3 attempts, exponential backoff)
- ✅ 8s timeout (matches function timeout) - **JUST ADDED**
- ✅ Error handling (4xx vs 5xx)
- ✅ Telemetry hooks
- ✅ UX states in `WPSGenerator.tsx` (loading, error, empty)
- ✅ Fallback query logic

### **Enhancements Just Made:**
- ✅ Added `AbortController` for 8s timeout
- ✅ Enhanced error logging with elapsed time
- ✅ Added telemetry hook support
- ✅ Improved error messages

---

## 🧪 Smoke Test Queries

Ready to test:
1. "preheat"
2. "welder qualification"
3. "root pass"
4. "PQR essential variables"
5. "AWS D1.1 Clause 5.8"

---

## 📋 PR Creation Steps

### **Step 1: Initialize Git (if needed)**
```bash
cd C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard
git init
git add .
git commit -m "Initial commit: WeldTrack v7 with CODEX integration"
git remote add origin <your-repo-url>
git push -u origin main
```

### **Step 2: Create Feature Branch**
```bash
git checkout -b feature/codex-prod-integration
```

### **Step 3: Commit Changes**
```bash
git add src/services/clausebot.ts
git commit -m "feat: enhance CODEX integration with 8s timeout and telemetry

- Add AbortController for 8s timeout (matches Netlify function)
- Enhance error logging with elapsed time
- Add telemetry hook support for monitoring
- Improve error messages for debugging"
```

### **Step 4: Push & Create PR**
```bash
git push -u origin feature/codex-prod-integration
```

Then create PR via GitHub UI or CLI.

---

## ✅ Ready to Execute

**All code changes complete. Ready for:**
1. Git initialization (if needed)
2. Branch creation
3. PR creation
4. Netlify preview deployment
5. Smoke testing

---

## 📝 PR Description Template

```markdown
# P5: Codex Production Integration

## Summary
Enhances CODEX integration with production-ready timeout handling, telemetry, and improved error messages.

## Changes
- ✅ Added 8s timeout (matches Netlify function timeout)
- ✅ Enhanced error logging with elapsed time
- ✅ Added telemetry hook support
- ✅ Improved error messages

## Testing
- [x] Local testing complete
- [ ] Netlify preview deployed
- [ ] Smoke tests passed

## Verification Queries
1. "preheat"
2. "welder qualification"
3. "root pass"
4. "PQR essential variables"
5. "AWS D1.1 Clause 5.8"
```

---

**Status:** ✅ Code complete, ready for PR creation  
**Next:** Initialize git → Create branch → Push → PR

