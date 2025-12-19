# P5: Codex Production Integration - PowerShell Commands
# Execute from repo root: .\P5_EXECUTION_COMMANDS.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "P5: Codex Production Integration" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create branch
Write-Host "Step 1: Creating feature branch..." -ForegroundColor Yellow
git checkout -b feature/codex-prod-integration-p5
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create branch" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Branch created: feature/codex-prod-integration-p5" -ForegroundColor Green
Write-Host ""

# Step 2: Stage changes
Write-Host "Step 2: Staging changes..." -ForegroundColor Yellow
git add src/services/clausebot.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to stage changes" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Staged: src/services/clausebot.ts" -ForegroundColor Green
Write-Host ""

# Step 3: Commit
Write-Host "Step 3: Committing changes..." -ForegroundColor Yellow
$commitMessage = @"
feat(codex): add robust queryCodex wrapper (retries, timeout, fallback, telemetry) & UI retry UX

P5 Enhancement:
- 8s timeout via AbortController (matches Netlify function)
- Exponential backoff retry (3 attempts: 200ms, 400ms, 800ms)
- Fallback query logic (relaxes overly-specific queries)
- Telemetry hooks (optional VITE_TELEMETRY_URL)
- Improved error handling (4xx vs 5xx, timeout detection)
- Response normalization (handles both hits and results fields)

See P5_PR_BODY.md for full details.
"@

git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to commit" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

# Step 4: Push
Write-Host "Step 4: Pushing to remote..." -ForegroundColor Yellow
git push -u origin feature/codex-prod-integration-p5
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Push failed. Check remote configuration:" -ForegroundColor Yellow
    Write-Host "   git remote -v" -ForegroundColor White
    Write-Host "   git remote add origin <your-repo-url>" -ForegroundColor White
    exit 1
}
Write-Host "✅ Branch pushed to remote" -ForegroundColor Green
Write-Host ""

# Step 5: Create PR (if gh CLI available)
Write-Host "Step 5: Creating PR..." -ForegroundColor Yellow
$ghAvailable = Get-Command gh -ErrorAction SilentlyContinue
if ($ghAvailable) {
    gh pr create `
      --title "feat(codex): P5 resilience + UX improvements" `
      --body-file P5_PR_BODY.md `
      --base main `
      --head feature/codex-prod-integration-p5
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PR created" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PR creation failed. Create manually:" -ForegroundColor Yellow
        Write-Host "   https://github.com/<your-org>/welder-inspection-dashboard/compare/main...feature/codex-prod-integration-p5" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  GitHub CLI not found. Create PR manually:" -ForegroundColor Yellow
    Write-Host "   https://github.com/<your-org>/welder-inspection-dashboard/compare/main...feature/codex-prod-integration-p5" -ForegroundColor White
}
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ P5 Execution Complete" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review Netlify preview deployment" -ForegroundColor White
Write-Host "  2. Run smoke tests (see P5_PR_BODY.md)" -ForegroundColor White
Write-Host "  3. Review PR and merge when ready" -ForegroundColor White
Write-Host ""

