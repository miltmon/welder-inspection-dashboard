# GitHub PR Body — feat/optimize-weldtrack-v7

**Title:** `feat: vendor chunk splitting + firebase persistence + codex test script`

---

```markdown
## 🚀 Summary
This PR introduces build-time performance optimizations and a small Firebase persistence fix to improve client load times and stability for WeldTrack v7.0.0. It also adds a codex test script for rapid verification during QA.

## 🛠 Changes
- Replace `vite.config.ts` with `vite.config.optimized.ts` (manualChunks configured):
  - `vendor-react` (react, react-dom, react-router)
  - `vendor-firebase` (firebase/app, firebase/auth, firebase/firestore)
  - `vendor-ui` (UI lib components)
- `src/lib/firebase.updated.ts` — update persistence to avoid deprecation warnings
- `scripts/test-codex.ps1` — codex smoke test script for Windows/dev CI

## ✅ Verification checklist
- [ ] `npm run build` passes locally
- [ ] Draft deploy loads without console errors
- [ ] `dist/assets` contains vendor chunk files (vendor-react-*.js, vendor-firebase-*.js, vendor-ui-*.js)
- [ ] CODEX smoke test works against production or draft deploy

## 🧪 Testing notes
- Use `netlify deploy --dir=dist` for draft QA; capture the returned URL and run `scripts/test-codex.ps1` against it.
- Run Lighthouse to capture baseline before/after merging.

## Risks & Rollback
- Risk: bundle change could reveal implicit imports — if any critical runtime error is detected, revert to previous `vite.config.ts` and re-run build/tests.
- Rollback: revert the PR branch and re-promote last good build.

## Context
Addresses PERF-102 (Reduce First Contentful Paint and initial payload for mobile users). See attached benchmark plan in PR comments.
```

---

## 📋 **Copy-Paste Instructions**

1. **Create PR:** Go to GitHub → New Pull Request
2. **Base:** `main` (or `master`)
3. **Compare:** `feat/optimize-weldtrack-v7`
4. **Title:** `feat: vendor chunk splitting + firebase persistence + codex test script`
5. **Body:** Copy the markdown block above (between the ``` markers)
6. **Labels:** Add `performance`, `optimization`, `v7.0.0`
7. **Reviewers:** Assign MANUS, WINDSURF
8. **Submit**

---

## 🔗 **Related Issues**

- Performance: Reduce bundle size from 1.7MB to <1MB
- Firebase: Remove deprecation warnings
- Testing: Add CODEX smoke test script

---

**Ready to paste into GitHub PR!**

