# 🚀 OPEN BOTH PRS NOW — Copy-Paste Commands

**Location:** `C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard`

---

## ⚡ **QUICK START (3 minutes)**

### 1️⃣ Open Whitespace PR (30 seconds)

```powershell
cd C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard

gh pr create `
  --repo miltmon/clausebot-enterprise `
  --base main `
  --head chore/whitespace-normalize `
  --title "chore: Normalize whitespace & line endings across repo" `
  --body-file PR_WHITESPACE.md
```

**Expected:** PR URL printed (e.g., `https://github.com/miltmon/clausebot-enterprise/pull/XX`)

---

### 2️⃣ Commit WeldTrack Changes (1 minute)

```powershell
# Switch to release branch
git checkout release/weldtrack-v7

# Verify staged files (should show 14 new WeldTrack files)
git status

# Commit
git commit -m "feat: WeldTrack™ v7.0.0 — branding, documentation & launch assets

- Updated branding to WeldTrack™ across index.html, package.json, manifest.json
- Bumped version to 7.0.0 with proper metadata
- Added comprehensive README.md with setup/deployment guides
- Added env.example with all required environment variables
- Added deployment checklist for Netlify/Vercel
- Added launch assets (email templates, social posts, demo script)
- Added PWA manifest with WeldTrack™ branding
- Added .pre-commit-config.yaml for code quality
- Added .gitignore for .env files

Ready for deployment to production.
Pairs with whitespace normalization PR."

# Push
git push origin release/weldtrack-v7
```

---

### 3️⃣ Open WeldTrack PR (30 seconds)

```powershell
gh pr create `
  --repo miltmon/clausebot-enterprise `
  --base main `
  --head release/weldtrack-v7 `
  --title "feat: WeldTrack™ v7.0.0 — Branding, Documentation & Launch Assets" `
  --body-file PR_BODY.md
```

---

## ✅ **DONE!**

**You should now have 2 PRs open:**

1. **Whitespace PR** — Low-risk formatting cleanup
2. **WeldTrack PR** — Functional changes for v7.0.0 launch

---

## 🎯 **MERGE STRATEGY**

### Recommended Order:

1. **Merge whitespace PR first** (sets baseline)
   - Review: Use "Hide whitespace" in GitHub Files tab
   - Approve: Low risk, all auto-verified
   
2. **Merge WeldTrack PR second** (functional changes)
   - Review: Clean diff, no formatting noise
   - Test: Deploy to staging/preview first
   - Approve: After smoke test passes

---

## 🔍 **VERIFY PRs ARE OPEN**

```powershell
# List recent PRs
gh pr list --repo miltmon/clausebot-enterprise --limit 5

# View specific PR in browser
gh pr view <PR_NUMBER> --web
```

---

## 📞 **IF SOMETHING GOES WRONG**

### Problem: "PR already exists"
**Solution:** PR might already be open from earlier push. Check with `gh pr list`.

### Problem: "Authentication failed"
**Solution:** Run `gh auth login` to authenticate GitHub CLI.

### Problem: "base branch 'main' not found"
**Solution:** Check repo has `main` branch. If using `master`, change `--base main` to `--base master`.

---

**Time to complete:** ~3 minutes  
**Difficulty:** Copy-paste  
**Risk:** Low (all verified)

