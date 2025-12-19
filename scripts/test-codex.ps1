# CODEX Serverless Function Smoke Test (PowerShell)
# Tests the CODEX query endpoint and validates response format

param(
    [string]$ProdUrl = "https://weldtrack-inspector.netlify.app",
    [string]$TestQuery = "preheat clause 6.5"
)

$ErrorActionPreference = "Stop"

$endpoint = "$ProdUrl/.netlify/functions/codex-query"
$body = @{
    q = $TestQuery
} | ConvertTo-Json

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CODEX Serverless Function Smoke Test" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Endpoint: $endpoint"
Write-Host "Query: $TestQuery"
Write-Host ""

# Test 1: Basic connectivity
Write-Host "Test 1: Basic connectivity" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "✓ HTTP 200 OK" -ForegroundColor Green
} catch {
    Write-Host "✗ Request failed: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Response structure
Write-Host ""
Write-Host "Test 2: Response structure" -ForegroundColor Yellow

if ($response.results -and $response.results.Count -gt 0) {
    Write-Host "✓ Results array present ($($response.results.Count) results)" -ForegroundColor Green
} else {
    Write-Host "✗ No results returned" -ForegroundColor Red
    exit 1
}

if ($response.query) {
    Write-Host "✓ Query field present" -ForegroundColor Green
} else {
    Write-Host "⚠ Query field missing (non-critical)" -ForegroundColor Yellow
}

# Test 3: Required metadata fields
Write-Host ""
Write-Host "Test 3: Required metadata fields" -ForegroundColor Yellow

$firstResult = $response.results[0]
if ($firstResult.metadata.NLM_ID) {
    Write-Host "✓ NLM_ID present: $($firstResult.metadata.NLM_ID)" -ForegroundColor Green
} else {
    Write-Host "✗ NLM_ID missing" -ForegroundColor Red
}

if ($firstResult.metadata.Code_Reference_Primary) {
    Write-Host "✓ Code_Reference_Primary present: $($firstResult.metadata.Code_Reference_Primary)" -ForegroundColor Green
} else {
    Write-Host "✗ Code_Reference_Primary missing" -ForegroundColor Red
}

# Display full response
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Full Response:" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
$response | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✓ All tests completed" -ForegroundColor Green
Write-Host ""
Write-Host "If you see errors above, check:" -ForegroundColor Yellow
Write-Host "1. Environment variables set in Netlify (VITE_CLAUSEBOT_KEY, VITE_CLAUSEBOT_ENDPOINT)"
Write-Host "2. Serverless function deployed correctly"
Write-Host "3. Function logs in Netlify dashboard"
Write-Host ""


