# P5: Codex Production Integration PR

**Branch:** `feature/codex-prod-integration`  
**Target:** `main`  
**Status:** Ready for creation

---

## 🎯 Implementation Summary

### **Repository**
- **Name:** `welder-inspection-dashboard` (WeldTrack v7)
- **Netlify Site:** `weldtrack-inspector`
- **Production URL:** https://weldtrack-inspector.netlify.app

### **Endpoint**
- **CODEX Function:** `https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query`
- **Method:** POST
- **Content-Type:** `application/json`

### **Changes**
1. ✅ Production CODEX integration in `WPSGenerator.tsx`
2. ✅ Service layer in `src/services/clausebot.ts`
3. ✅ Retry/backoff logic with 8s timeout
4. ✅ UX states (loading, error, empty, fallback)
5. ✅ Telemetry hooks

---

## 📋 PR Checklist

- [ ] Create branch: `feature/codex-prod-integration`
- [ ] Wire production endpoint
- [ ] Add retry/backoff (3 retries, exponential backoff)
- [ ] Add 8s timeout (matches function timeout)
- [ ] Map `hits` → `results` with clause_id, score, source
- [ ] Implement fallback query logic
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add empty state messaging
- [ ] Add degraded/fallback banner
- [ ] Add telemetry hooks
- [ ] Test locally
- [ ] Deploy to Netlify preview
- [ ] Smoke test queries
- [ ] Create PR
- [ ] Add verification notes
- [ ] Add screenshots

---

## 🧪 Smoke Test Queries

1. "preheat"
2. "welder qualification"
3. "root pass"
4. "PQR essential variables"
5. "AWS D1.1 Clause 5.8"

---

## ✅ Ready to Execute

**Reply:** "Execute P5" to proceed

