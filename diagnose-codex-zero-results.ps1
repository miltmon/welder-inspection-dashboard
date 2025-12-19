# Diagnose codex-query Zero Results Issue
# Tests ClauseBot API directly and checks function behavior

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "codex-query Zero Results Diagnosis" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step B: Direct ClauseBot API Test
Write-Host "STEP B: Testing ClauseBot API Directly" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

$ep = $env:CLAUSEBOT_ENDPOINT
$key = $env:CLAUSEBOT_API_KEY

if (-not $ep) { 
    $ep = "https://clausebot-api.onrender.com"
    Write-Host "⚠️  CLAUSEBOT_ENDPOINT not set, using default: $ep" -ForegroundColor Yellow
} else {
    Write-Host "✅ Using CLAUSEBOT_ENDPOINT: $ep" -ForegroundColor Green
}

if (-not $key) { 
    $key = "cb_mobile_2025_secure_key_12345"
    Write-Host "⚠️  CLAUSEBOT_API_KEY not set, using default" -ForegroundColor Yellow
} else {
    Write-Host "✅ Using CLAUSEBOT_API_KEY: $($key.Substring(0, [Math]::Min(10, $key.Length)))..." -ForegroundColor Green
}

Write-Host "`nCalling ClauseBot endpoint: $ep" -ForegroundColor Cyan

# Test 1: Original query
Write-Host "`n--- Test 1: Original Query ---" -ForegroundColor Cyan
Write-Host "Query: 'preheat clause 6.5'" -ForegroundColor White

# Try GET method first (as function uses)
Write-Host "`n[GET] Testing: $ep/v1/clauses/search/preheat%20clause%206.5?limit=3" -ForegroundColor Gray
try {
    $headers = @{
        "Accept" = "application/json"
        "Authorization" = "Bearer $key"
    }
    $getResp = Invoke-RestMethod -Uri "$ep/v1/clauses/search/preheat%20clause%206.5?limit=3" `
        -Method Get -Headers $headers -TimeoutSec 30
    Write-Host "✅ GET Response:" -ForegroundColor Green
    $getResp | ConvertTo-Json -Depth 6 | Write-Host
    Write-Host "`nHits count: $($getResp.hits.Count)" -ForegroundColor Cyan
    Write-Host "Total hits: $($getResp.total_hits)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ GET failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        Write-Host "Response body: $body" -ForegroundColor Yellow
    }
}

# Try POST method (analyze endpoint)
Write-Host "`n[POST] Testing: $ep/v1/clauses/analyze" -ForegroundColor Gray
try {
    $payload = @{ text = "preheat clause 6.5"; top_k = 10 } | ConvertTo-Json
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $key"
    }
    $postResp = Invoke-RestMethod -Uri "$ep/v1/clauses/analyze" `
        -Method Post -Headers $headers -Body $payload -TimeoutSec 30
    Write-Host "✅ POST Response:" -ForegroundColor Green
    $postResp | ConvertTo-Json -Depth 6 | Write-Host
    if ($postResp.results) {
        Write-Host "`nResults count: $($postResp.results.Count)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ POST failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        Write-Host "Response body: $body" -ForegroundColor Yellow
    }
}

# Step C: Alternative Queries
Write-Host "`n`n========================================" -ForegroundColor Cyan
Write-Host "STEP C: Testing Alternative Queries" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

$testQueries = @(
    @{ text = "AWS D1.1 preheat minimum temperature clause"; top_k = 10 },
    @{ text = "AWS D1.1 Clause 5 preheat"; top_k = 10 },
    @{ text = "minimum preheat temperature"; top_k = 10 },
    @{ text = "preheat"; top_k = 10 },
    @{ text = "AWS D1.1 Clause 6.5"; top_k = 10 }
)

foreach ($query in $testQueries) {
    Write-Host "`n--- Testing: '$($query.text)' ---" -ForegroundColor Cyan
    try {
        $payload = $query | ConvertTo-Json
        $headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $key"
        }
        $resp = Invoke-RestMethod -Uri "$ep/v1/clauses/analyze" `
            -Method Post -Headers $headers -Body $payload -TimeoutSec 30
        
        if ($resp.results -and $resp.results.Count -gt 0) {
            Write-Host "✅ Found $($resp.results.Count) results!" -ForegroundColor Green
            Write-Host "First result score: $($resp.results[0].score)" -ForegroundColor Cyan
        } else {
            Write-Host "⚠️  Zero results" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n`n========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "1. Copy the JSON outputs above (GET and POST responses)" -ForegroundColor Cyan
Write-Host "2. Check Netlify function logs:" -ForegroundColor Cyan
Write-Host "   https://app.netlify.com/sites/weldtrack-inspector/functions/codex-query" -ForegroundColor White
Write-Host "3. Look for log lines showing:" -ForegroundColor Cyan
Write-Host "   - 'Calling ClauseBot API: ...'" -ForegroundColor White
Write-Host "   - 'API Response Status: ...'" -ForegroundColor White
Write-Host "   - 'API response received: ...'" -ForegroundColor White
Write-Host "`nPaste both:" -ForegroundColor Yellow
Write-Host "  A) Netlify function log block" -ForegroundColor White
Write-Host "  B) Direct API test JSON output (from above)" -ForegroundColor White

