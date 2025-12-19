# Deploy codex-query function to Netlify
# This script deploys the function directly using Netlify CLI with workarounds

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Working directory: $root" -ForegroundColor Cyan
Push-Location $root

$siteId = "796579bb-0b32-4b2f-a821-165c8b0175e3"
$functionsPath = "netlify/functions"
$distPath = "dist"

# Verify function exists
if (-not (Test-Path "$functionsPath\codex-query.js")) {
    Write-Host "ERROR: Function file not found at $functionsPath\codex-query.js" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "`n=== Deploying codex-query function to Netlify ===" -ForegroundColor Green
Write-Host "Site ID: $siteId"
Write-Host "Functions path: $functionsPath"
Write-Host "Dist path: $distPath"

# Set environment variable
$env:NETLIFY_SITE_ID = $siteId

# Check if dist exists
if (-not (Test-Path $distPath)) {
    Write-Host "WARNING: dist directory not found. Netlify will try to build." -ForegroundColor Yellow
}

# Deploy using Netlify CLI
# Note: If CLI prompts for build command, you may need to manually select or deploy via dashboard
Write-Host "`nDeploying..." -ForegroundColor Yellow
try {
    # Try deployment - if it prompts, it will fail, but we'll provide instructions
    $deployOutput = netlify deploy --prod --site $siteId --dir=$distPath --functions=$functionsPath 2>&1 | Out-String
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
        Write-Host $deployOutput
    } else {
        Write-Host "`n⚠️  Deployment command had issues. Check output above." -ForegroundColor Yellow
        Write-Host $deployOutput
        
        Write-Host "`n=== Alternative: Deploy via Netlify Dashboard ===" -ForegroundColor Cyan
        Write-Host "1. Go to: https://app.netlify.com/sites/weldtrack-inspector/deploys"
        Write-Host "2. Click 'Trigger deploy' → 'Deploy site'"
        Write-Host "3. Or use 'Clear cache and deploy site' to ensure fresh deployment"
        Write-Host "`nFunction file is ready at: $functionsPath\codex-query.js"
    }
} catch {
    Write-Host "`n❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n=== Manual Deployment Instructions ===" -ForegroundColor Cyan
    Write-Host "The Netlify CLI is having interactive prompt issues."
    Write-Host "Please deploy manually via: https://app.netlify.com/sites/weldtrack-inspector/deploys"
}

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Test the function: .\test-codex-function.ps1"
Write-Host "2. Check logs: https://app.netlify.com/sites/weldtrack-inspector/functions/codex-query"
Write-Host "3. Look for: 'Calling ClauseBot API' and 'fetch completed in X ms'"

Pop-Location

