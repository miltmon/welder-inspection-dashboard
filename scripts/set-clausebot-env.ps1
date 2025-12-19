# Set ClauseBot Environment Variables for Netlify
# This script helps you securely set CLAUSEBOT_KEY and CLAUSEBOT_ENDPOINT

param(
    [switch]$Interactive  # Use interactive mode (prompts for key)
)

$SITE_ID = "796579bb-0b32-4b2f-a821-165c8b0175e3"
$DEFAULT_ENDPOINT = "https://api.clausebot.internal/retrieve"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Set ClauseBot Environment Variables" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Site ID: $SITE_ID" -ForegroundColor Yellow
Write-Host ""

# Check if variables already exist
Write-Host "Checking existing environment variables..." -ForegroundColor Yellow
$existing = netlify env:list --site $SITE_ID 2>&1

if ($existing -match "CLAUSEBOT_KEY") {
    Write-Host "⚠ Warning: CLAUSEBOT_KEY already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite existing? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit 0
    }
}

# Get CLAUSEBOT_KEY
if ($Interactive) {
    Write-Host "Enter CLAUSEBOT_KEY (will be hidden):" -ForegroundColor Green
    $secureKey = Read-Host -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
    $CLAUSEBOT_KEY = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
} else {
    Write-Host "Enter CLAUSEBOT_KEY (or press Enter to skip):" -ForegroundColor Green
    $CLAUSEBOT_KEY = Read-Host
    if ([string]::IsNullOrWhiteSpace($CLAUSEBOT_KEY)) {
        Write-Host "No key provided. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Get CLAUSEBOT_ENDPOINT
Write-Host ""
Write-Host "Enter CLAUSEBOT_ENDPOINT (default: $DEFAULT_ENDPOINT):" -ForegroundColor Green
$CLAUSEBOT_ENDPOINT = Read-Host
if ([string]::IsNullOrWhiteSpace($CLAUSEBOT_ENDPOINT)) {
    $CLAUSEBOT_ENDPOINT = $DEFAULT_ENDPOINT
}

# Confirm
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Configuration Summary:" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CLAUSEBOT_KEY: $($CLAUSEBOT_KEY.Substring(0, [Math]::Min(8, $CLAUSEBOT_KEY.Length)))..." -ForegroundColor Yellow
Write-Host "CLAUSEBOT_ENDPOINT: $CLAUSEBOT_ENDPOINT" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Proceed with setting these variables? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

# Set environment variables
Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Yellow

try {
    # Set CLAUSEBOT_KEY
    Write-Host "Setting CLAUSEBOT_KEY..." -ForegroundColor Cyan
    $result1 = netlify env:set CLAUSEBOT_KEY $CLAUSEBOT_KEY --site $SITE_ID 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ CLAUSEBOT_KEY set successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to set CLAUSEBOT_KEY: $result1" -ForegroundColor Red
        exit 1
    }

    # Set CLAUSEBOT_ENDPOINT
    Write-Host "Setting CLAUSEBOT_ENDPOINT..." -ForegroundColor Cyan
    $result2 = netlify env:set CLAUSEBOT_ENDPOINT $CLAUSEBOT_ENDPOINT --site $SITE_ID 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ CLAUSEBOT_ENDPOINT set successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to set CLAUSEBOT_ENDPOINT: $result2" -ForegroundColor Red
        exit 1
    }

    # Optional: Set VITE_CLAUSEBOT_ENDPOINT for frontend
    Write-Host ""
    $setVite = Read-Host "Also set VITE_CLAUSEBOT_ENDPOINT for frontend? (y/N)"
    if ($setVite -eq "y" -or $setVite -eq "Y") {
        $result3 = netlify env:set VITE_CLAUSEBOT_ENDPOINT $CLAUSEBOT_ENDPOINT --site $SITE_ID 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ VITE_CLAUSEBOT_ENDPOINT set successfully" -ForegroundColor Green
        }
    }

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "✓ Environment variables set successfully!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Verify: netlify env:list --site $SITE_ID" -ForegroundColor Cyan
    Write-Host "2. Test function: .\scripts\test-codex-debug.ps1" -ForegroundColor Cyan
    Write-Host "3. Check logs: https://app.netlify.com/projects/weldtrack-inspector/logs-and-metrics/functions" -ForegroundColor Cyan
    Write-Host ""

} catch {
    Write-Host "Error setting environment variables: $_" -ForegroundColor Red
    exit 1
}

# Clear sensitive data from memory
$CLAUSEBOT_KEY = $null
$secureKey = $null

