# Create Optimization PR Branch
# This script creates the optimization branch and prepares it for PR

param(
    [switch]$DryRun  # Show what would be done without making changes
)

$branchName = "feat/optimize-weldtrack-v7"
$commitMessage = "feat: vendor chunk splitting + firebase persistence update"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Create Optimization PR Branch" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Branch: $branchName" -ForegroundColor Yellow
Write-Host ""

# Check if we're in a git repo
if (-not (Test-Path ".git")) {
    Write-Host "Error: Not in a git repository" -ForegroundColor Red
    exit 1
}

# Check current branch
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "Warning: You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $status -ForegroundColor Gray
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit 0
    }
}

if ($DryRun) {
    Write-Host ""
    Write-Host "DRY RUN: Would execute the following:" -ForegroundColor Cyan
    Write-Host "  git checkout -b $branchName" -ForegroundColor White
    Write-Host "  cp vite.config.optimized.ts vite.config.ts" -ForegroundColor White
    Write-Host "  git add vite.config.ts" -ForegroundColor White
    Write-Host "  git commit -m `"$commitMessage`"" -ForegroundColor White
    Write-Host "  git push origin $branchName" -ForegroundColor White
    Write-Host ""
    Write-Host "Remove -DryRun to execute." -ForegroundColor Yellow
    exit 0
}

# Create and checkout branch
Write-Host "Creating branch: $branchName" -ForegroundColor Yellow
git checkout -b $branchName
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to create branch" -ForegroundColor Red
    exit 1
}

# Copy optimized config
if (Test-Path "vite.config.optimized.ts") {
    Write-Host "Copying optimized vite.config.ts..." -ForegroundColor Yellow
    Copy-Item "vite.config.optimized.ts" "vite.config.ts" -Force
} else {
    Write-Host "Warning: vite.config.optimized.ts not found" -ForegroundColor Yellow
}

# Apply Firebase fix if available
if (Test-Path "src/lib/firebase.updated.ts") {
    Write-Host "Firebase updated file found (manual application needed)" -ForegroundColor Yellow
    Write-Host "  Review: src/lib/firebase.updated.ts" -ForegroundColor Gray
    Write-Host "  Apply changes manually to: src/lib/firebase.ts" -ForegroundColor Gray
}

# Stage files
Write-Host "Staging files..." -ForegroundColor Yellow
git add vite.config.ts
if (Test-Path "scripts/test-codex.ps1") {
    git add scripts/test-codex.ps1
}

# Commit
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to commit" -ForegroundColor Red
    exit 1
}

# Push
Write-Host "Pushing to remote..." -ForegroundColor Yellow
git push origin $branchName
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to push" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✓ Branch created and pushed!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Build: npm run build" -ForegroundColor White
Write-Host "2. Draft deploy: netlify deploy --dir=dist" -ForegroundColor White
Write-Host "3. Create PR: https://github.com/miltmon/clausebot-enterprise/compare/main...$branchName" -ForegroundColor White
Write-Host "4. Use PR body from: PR_BODY_OPTIMIZATION.md" -ForegroundColor White
Write-Host ""

