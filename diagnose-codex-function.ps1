# Diagnose codex-query Function
# Checks function logs and verifies configuration

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "codex-query Function Diagnostics" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Check function exists locally
Write-Host "Test 1: Checking function file..." -ForegroundColor Yellow
$functionPaths = @(
    ".netlify\functions\codex-query.js",
    "netlify\functions\codex-query.js"
)

$foundPath = $null
foreach ($path in $functionPaths) {
    if (Test-Path $path) {
        Write-Host "  ✅ Found: $path" -ForegroundColor Green
        $foundPath = $path
        break
    }
}

if (-not $foundPath) {
    Write-Host "  ❌ Function file not found!" -ForegroundColor Red
    exit 1
}

# Test 2: Check if function has Authorization header
Write-Host "`nTest 2: Checking function code for Authorization header..." -ForegroundColor Yellow
$functionCode = Get-Content $foundPath -Raw

if ($functionCode -match "Authorization.*Bearer") {
    Write-Host "  ✅ Authorization header found in function code" -ForegroundColor Green
} else {
    Write-Host "  ❌ Authorization header NOT found in function code!" -ForegroundColor Red
    Write-Host "  The function needs to include: 'Authorization': \`Bearer \${apiKey}\`" -ForegroundColor Yellow
}

# Test 3: Check if function checks for API key
if ($functionCode -match "CLAUSEBOT_API_KEY|CLAUSEBOT_KEY") {
    Write-Host "  ✅ Function checks for API key environment variable" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Function may not check for API key" -ForegroundColor Yellow
}

# Test 4: Test API directly with auth
Write-Host "`nTest 3: Testing ClauseBot API directly..." -ForegroundColor Yellow
$headers = @{
    'Authorization' = 'Bearer cb_mobile_2025_secure_key_12345'
    'Accept' = 'application/json'
}

try {
    $apiResponse = Invoke-RestMethod -Uri 'https://clausebot-api.onrender.com/v1/clauses/search/preheat?limit=3' `
        -Method Get -Headers $headers -ErrorAction Stop
    
    Write-Host "  ✅ API call successful" -ForegroundColor Green
    Write-Host "  Response:" -ForegroundColor Cyan
    Write-Host "    search_term: $($apiResponse.search_term)" -ForegroundColor White
    Write-Host "    total_hits: $($apiResponse.total_hits)" -ForegroundColor White
    Write-Host "    hits count: $($apiResponse.hits.Count)" -ForegroundColor White
    
    if ($apiResponse.hits.Count -gt 0) {
        Write-Host "  ✅ API returns data - function should work" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  API returns empty hits - may be a data issue" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ API call failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  ⚠️  401 Unauthorized - API key may be invalid" -ForegroundColor Yellow
    }
}

# Test 5: Check Netlify environment variables
Write-Host "`nTest 4: Checking Netlify environment variables..." -ForegroundColor Yellow
Write-Host "  Go to: https://app.netlify.com/projects/weldtrack-inspector/settings/env" -ForegroundColor Cyan
Write-Host "  Verify these are set:" -ForegroundColor White
Write-Host "    - CLAUSEBOT_API_KEY" -ForegroundColor White
Write-Host "    - CLAUSEBOT_ENDPOINT" -ForegroundColor White

# Test 6: Check function logs
Write-Host "`nTest 5: Check function logs..." -ForegroundColor Yellow
Write-Host "  Go to: https://app.netlify.com/sites/weldtrack-inspector/functions/codex-query" -ForegroundColor Cyan
Write-Host "  Look for:" -ForegroundColor White
Write-Host "    - 'Calling ClauseBot API: ...'" -ForegroundColor White
Write-Host "    - 'API Response Status: ...'" -ForegroundColor White
Write-Host "    - 'Using API key: ...'" -ForegroundColor White
Write-Host "    - Any error messages" -ForegroundColor White

# Test 7: Show function code snippet
Write-Host "`nTest 6: Function code snippet (fetch call)..." -ForegroundColor Yellow
$lines = Get-Content $foundPath
$fetchLine = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "fetch\(url") {
        $fetchLine = $i
        break
    }
}

if ($fetchLine -ge 0) {
    Write-Host "  Fetch call found at line $($fetchLine + 1):" -ForegroundColor Cyan
    $start = [Math]::Max(0, $fetchLine - 5)
    $end = [Math]::Min($lines.Count - 1, $fetchLine + 10)
    for ($i = $start; $i -le $end; $i++) {
        $marker = if ($i -eq $fetchLine) { ">>> " } else { "    " }
        Write-Host "$marker$($i + 1): $($lines[$i])" -ForegroundColor $(if ($i -eq $fetchLine) { "Yellow" } else { "Gray" })
    }
} else {
    Write-Host "  ⚠️  Fetch call not found in function code" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Diagnostics Complete" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Check Netlify function logs for errors" -ForegroundColor White
Write-Host "2. Verify CLAUSEBOT_API_KEY is set in Netlify environment variables" -ForegroundColor White
Write-Host "3. Check if function code was actually deployed (may need to redeploy)" -ForegroundColor White
Write-Host "4. Test function again after checking logs" -ForegroundColor White

