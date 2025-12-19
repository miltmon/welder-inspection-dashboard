# Final Fix for codex-query Function
# Ensures function is deployed with correct code and environment variables

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "codex-query Function Final Fix" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $root

# Step 1: Verify function code has Authorization header
Write-Host "Step 1: Verifying function code..." -ForegroundColor Yellow
$functionPath = if (Test-Path ".netlify\functions\codex-query.js") { 
    ".netlify\functions\codex-query.js" 
} elseif (Test-Path "netlify\functions\codex-query.js") {
    "netlify\functions\codex-query.js"
} else {
    Write-Host "  ❌ Function file not found!" -ForegroundColor Red
    Pop-Location; exit 1
}

$functionCode = Get-Content $functionPath -Raw
if ($functionCode -match "Authorization.*Bearer") {
    Write-Host "  ✅ Function code has Authorization header" -ForegroundColor Green
} else {
    Write-Host "  ❌ Function code missing Authorization header!" -ForegroundColor Red
    Write-Host "  Copying fixed code..." -ForegroundColor Yellow
    Copy-Item "C:\ClauseBot_API_Deploy\clausebot-api\CODEX_DEPLOYMENT_READY.js" -Destination $functionPath -Force
    Write-Host "  ✅ Fixed code copied" -ForegroundColor Green
}

# Step 2: Check Netlify environment variables
Write-Host "`nStep 2: Checking Netlify environment variables..." -ForegroundColor Yellow
Write-Host "  Go to: https://app.netlify.com/projects/weldtrack-inspector/settings/env" -ForegroundColor Cyan
Write-Host "  Required variables:" -ForegroundColor White
Write-Host "    - CLAUSEBOT_API_KEY (should be set)" -ForegroundColor White
Write-Host "    - CLAUSEBOT_ENDPOINT (should be: https://clausebot-api.onrender.com/v1/clauses/search)" -ForegroundColor White

# Step 3: Test API directly
Write-Host "`nStep 3: Testing ClauseBot API directly..." -ForegroundColor Yellow
try {
    $headers = @{
        'Authorization' = 'Bearer cb_mobile_2025_secure_key_12345'
        'Accept' = 'application/json'
    }
    $apiTest = Invoke-RestMethod -Uri 'https://clausebot-api.onrender.com/v1/clauses/search/preheat?limit=3' `
        -Method Get -Headers $headers -ErrorAction Stop
    
    Write-Host "  ✅ API test successful" -ForegroundColor Green
    Write-Host "    Hits returned: $($apiTest.hits.Count)" -ForegroundColor Cyan
    
    if ($apiTest.hits.Count -eq 0) {
        Write-Host "  ⚠️  API returns empty data - this may be expected" -ForegroundColor Yellow
        Write-Host "    Try query: 'preheat' instead of 'preheat clause 6.5'" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ API test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Redeploy function
Write-Host "`nStep 4: Redeploying function..." -ForegroundColor Yellow
$siteId = $env:NETLIFY_SITE_ID
if (-not $siteId) {
    $siteId = "796579bb-0b32-4b2f-a821-165c8b0175e3"
    Write-Host "  Using site ID: $siteId" -ForegroundColor Cyan
}

$functionsDir = if (Test-Path ".netlify\functions") { ".netlify/functions" } else { "netlify/functions" }
Write-Host "  Functions directory: $functionsDir" -ForegroundColor Cyan

$confirm = Read-Host "`nRedeploy function to Netlify? (y/n)"
if ($confirm -eq "y") {
    Write-Host "  Deploying..." -ForegroundColor Yellow
    netlify deploy --prod --site $siteId --dir=dist --functions=$functionsDir
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n  ✅ Function redeployed successfully!" -ForegroundColor Green
        Write-Host "`n  Wait 10-15 seconds for function to update, then test:" -ForegroundColor Yellow
        Write-Host "    .\test-codex-function.ps1" -ForegroundColor White
    } else {
        Write-Host "`n  ⚠️  Deploy may have failed. Check output above." -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⏸️  Skipping redeploy. Run manually:" -ForegroundColor Yellow
    Write-Host "    netlify deploy --prod --site $siteId --dir=dist --functions=$functionsDir" -ForegroundColor White
}

# Step 5: Check function logs
Write-Host "`nStep 5: Check function logs after testing..." -ForegroundColor Yellow
Write-Host "  URL: https://app.netlify.com/sites/weldtrack-inspector/functions/codex-query" -ForegroundColor Cyan
Write-Host "  Look for:" -ForegroundColor White
Write-Host "    - 'Using API key: cb_m...'" -ForegroundColor White
Write-Host "    - 'API Response Status: 200'" -ForegroundColor White
Write-Host "    - 'Transformed results: X items'" -ForegroundColor White

Pop-Location

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Fix Complete" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

