#!/bin/bash
# P5: Codex Production Integration - Git Commands
# Execute from repo root: bash P5_EXECUTION_COMMANDS.sh

set -e

echo "=========================================="
echo "P5: Codex Production Integration"
echo "=========================================="
echo ""

# Step 1: Create branch
echo "Step 1: Creating feature branch..."
git checkout -b feature/codex-prod-integration-p5
echo "✅ Branch created: feature/codex-prod-integration-p5"
echo ""

# Step 2: Stage changes
echo "Step 2: Staging changes..."
git add src/services/clausebot.ts
echo "✅ Staged: src/services/clausebot.ts"
echo ""

# Step 3: Commit
echo "Step 3: Committing changes..."
git commit -m "feat(codex): add robust queryCodex wrapper (retries, timeout, fallback, telemetry) & UI retry UX

P5 Enhancement:
- 8s timeout via AbortController (matches Netlify function)
- Exponential backoff retry (3 attempts: 200ms, 400ms, 800ms)
- Fallback query logic (relaxes overly-specific queries)
- Telemetry hooks (optional VITE_TELEMETRY_URL)
- Improved error handling (4xx vs 5xx, timeout detection)
- Response normalization (handles both hits and results fields)

See P5_PR_BODY.md for full details."
echo "✅ Changes committed"
echo ""

# Step 4: Push
echo "Step 4: Pushing to remote..."
git push -u origin feature/codex-prod-integration-p5
echo "✅ Branch pushed to remote"
echo ""

# Step 5: Create PR (if gh CLI available)
if command -v gh &> /dev/null; then
    echo "Step 5: Creating PR via GitHub CLI..."
    gh pr create \
      --title "feat(codex): P5 resilience + UX improvements" \
      --body-file P5_PR_BODY.md \
      --base main \
      --head feature/codex-prod-integration-p5
    echo "✅ PR created"
else
    echo "Step 5: GitHub CLI not found. Create PR manually:"
    echo "   https://github.com/<your-org>/welder-inspection-dashboard/compare/main...feature/codex-prod-integration-p5"
fi
echo ""

echo "=========================================="
echo "✅ P5 Execution Complete"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "  1. Review Netlify preview deployment"
echo "  2. Run smoke tests (see P5_PR_BODY.md)"
echo "  3. Review PR and merge when ready"
echo ""

