# Fix Netlify Environment Variables for codex-query Function
# Issue: CLAUSEBOT_API_KEY is set to "CLAUSEBOT_API_KEY_PROD" instead of actual API key

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Netlify Environment Variable Fix" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "ISSUE FOUND:" -ForegroundColor Yellow
Write-Host "  CLAUSEBOT_API_KEY = 'CLAUSEBOT_API_KEY_PROD' (literal string)" -ForegroundColor Red
Write-Host "  Should be: 'cb_mobile_2025_secure_key_12345' (actual API key)`n" -ForegroundColor Green

Write-Host "MANUAL FIX REQUIRED:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://app.netlify.com/projects/weldtrack-inspector/configuration/env" -ForegroundColor Cyan
Write-Host "  2. Click on 'CLAUSEBOT_API_KEY'" -ForegroundColor White
Write-Host "  3. Click 'Options' → 'Edit variable'" -ForegroundColor White
Write-Host "  4. Change Production value to: cb_mobile_2025_secure_key_12345" -ForegroundColor White
Write-Host "  5. Click 'Save'`n" -ForegroundColor White

Write-Host "VERIFY CURRENT VALUES:" -ForegroundColor Yellow
Write-Host "  Opening Netlify dashboard..." -ForegroundColor Cyan
Start-Process "https://app.netlify.com/projects/weldtrack-inspector/configuration/env"

$confirm = Read-Host "`nHave you updated CLAUSEBOT_API_KEY in Netlify? (y/n)"
if ($confirm -ne "y") {
    Write-Host "`n⏸️  Please update the environment variable first, then run this script again." -ForegroundColor Yellow
    exit 0
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Redeploying Function" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$root = "C:\Users\miltm\MiltmonNDT_Workspace\New-Project-Extracted\welder-inspection-dashboard"
if (-not (Test-Path $root)) {
    Write-Host "❌ WeldTrack directory not found: $root" -ForegroundColor Red
    exit 1
}

Push-Location $root

# Set site ID
$siteId = "796579bb-0b32-4b2f-a821-165c8b0175e3"
$env:NETLIFY_SITE_ID = $siteId

Write-Host "Site ID: $siteId" -ForegroundColor Cyan
Write-Host "Functions directory: .netlify/functions`n" -ForegroundColor Cyan

# Check if function file exists
if (-not (Test-Path ".netlify\functions\codex-query.js")) {
    Write-Host "❌ Function file not found: .netlify\functions\codex-query.js" -ForegroundColor Red
    Pop-Location; exit 1
}

Write-Host "✅ Function file found" -ForegroundColor Green

# Deploy
Write-Host "`nDeploying to Netlify..." -ForegroundColor Yellow
netlify deploy --prod --site $siteId --dir=dist --functions=.netlify/functions

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "`nWaiting 15 seconds for function to update..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Testing Function" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    # Test function
    if (Test-Path "test-codex-function.ps1") {
        Write-Host "Running test script..." -ForegroundColor Yellow
        .\test-codex-function.ps1
    } else {
        Write-Host "Test script not found. Manual test:" -ForegroundColor Yellow
        Write-Host '  curl -X POST "https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query" \' -ForegroundColor White
        Write-Host '    -H "Content-Type: application/json" \' -ForegroundColor White
        Write-Host '    -d ''{"q":"preheat clause 6.5","top_k":3}''' -ForegroundColor White
    }
} else {
    Write-Host "`n⚠️  Deployment may have failed. Check output above." -ForegroundColor Yellow
}

Pop-Location

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "1. Check function logs:" -ForegroundColor White
Write-Host "   https://app.netlify.com/sites/weldtrack-inspector/functions/codex-query`n" -ForegroundColor Cyan
Write-Host "2. Look for these log lines:" -ForegroundColor White
Write-Host "   - 'Using API key: cb_m...' (should show masked key)" -ForegroundColor Green
Write-Host "   - 'API Response Status: 200'" -ForegroundColor Green
Write-Host "   - 'Transformed results: X items' (X > 0)`n" -ForegroundColor Green
Write-Host "3. If results are still empty, check:" -ForegroundColor White
Write-Host "   - API key is correct in Netlify dashboard" -ForegroundColor Yellow
Write-Host "   - Function was redeployed after env var update" -ForegroundColor Yellow
Write-Host "   - Wait 30-60 seconds for function to fully update`n" -ForegroundColor Yellow

