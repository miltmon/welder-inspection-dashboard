# Set ClauseBot API Key for CODEX Function
# This script helps you securely set the CLAUSEBOT_KEY environment variable

param(
    [string]$ApiKey  # Optional: pass key as parameter (less secure)
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Set ClauseBot API Key for CODEX Function" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check current state
Write-Host "Checking current environment variables..." -ForegroundColor Yellow
$current = netlify env:list 2>&1
if ($current -match "CLAUSEBOT_KEY") {
    Write-Host "⚠ Warning: CLAUSEBOT_KEY already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite existing? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit 0
    }
}

# Get API key
if ($ApiKey) {
    $key = $ApiKey
    Write-Host "Using provided API key (first 8 chars: $($key.Substring(0, [Math]::Min(8, $key.Length)))...)" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Enter your ClauseBot API key:" -ForegroundColor Green
    Write-Host "  (Get it from: https://dashboard.render.com → clausebot-api → Environment)" -ForegroundColor Gray
    Write-Host ""
    $key = Read-Host "API Key" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($key)
    $key = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
}

if ([string]::IsNullOrWhiteSpace($key)) {
    Write-Host "Error: No API key provided" -ForegroundColor Red
    exit 1
}

# Confirm
Write-Host ""
Write-Host "API Key (masked): $($key.Substring(0, [Math]::Min(8, $key.Length)))...$($key.Substring([Math]::Max(0, $key.Length - 4)))" -ForegroundColor Yellow
$confirm = Read-Host "Set this key? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

# Set the key
Write-Host ""
Write-Host "Setting CLAUSEBOT_KEY..." -ForegroundColor Yellow
$result = netlify env:set CLAUSEBOT_KEY $key 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ CLAUSEBOT_KEY set successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to set CLAUSEBOT_KEY: $result" -ForegroundColor Red
    exit 1
}

# Verify
Write-Host ""
Write-Host "Verifying environment variables..." -ForegroundColor Yellow
netlify env:list

# Clear sensitive data
$key = $null

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✓ API Key Set Successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait 1-2 minutes for Netlify to pick up the change" -ForegroundColor White
Write-Host "2. Or redeploy: npm run build && netlify deploy --prod --dir=dist" -ForegroundColor White
Write-Host "3. Test CODEX: .\scripts\test-codex-debug.ps1" -ForegroundColor White
Write-Host ""

