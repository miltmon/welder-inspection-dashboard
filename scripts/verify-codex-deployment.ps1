# CODEX Deployment Verification Script
# Run this after Render deployment completes

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "CODEX Integration Verification" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: API Health
Write-Host "Test 1: API Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri 'https://clausebot-api.onrender.com/health' -Method Get -ErrorAction Stop
    Write-Host "  ✅ PASSED - Service: $($health.service), Version: $($health.version)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Clauses Search Endpoint (CRITICAL)
Write-Host "Test 2: Clauses Search Endpoint" -ForegroundColor Yellow
try {
    $search = Invoke-RestMethod -Uri 'https://clausebot-api.onrender.com/v1/clauses/search/preheat?limit=3' -Method Get -ErrorAction Stop
    Write-Host "  ✅ PASSED - Search Term: $($search.search_term), Total Hits: $($search.total_hits)" -ForegroundColor Green
    if ($search.hits -and $search.hits.Count -gt 0) {
        Write-Host "  ✅ First Hit: $($search.hits[0].clause_reference)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ❌ FAILED - Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  ⚠️  Deployment may still be in progress. Wait 2-3 minutes and retry." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 3: CODEX Function (Full Integration)
Write-Host "Test 3: CODEX Function Integration" -ForegroundColor Yellow
$body = @{ q='preheat clause 6.5'; top_k=3 } | ConvertTo-Json
try {
    $codex = Invoke-RestMethod -Uri 'https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query' -Method Post -Body $body -ContentType 'application/json' -ErrorAction Stop -TimeoutSec 30
    Write-Host "  ✅ PASSED - Query: $($codex.query), Results: $($codex.count)" -ForegroundColor Green
    if ($codex.results -and $codex.results.Count -gt 0) {
        $first = $codex.results[0]
        Write-Host "  ✅ First Result: $($first.metadata.Code_Reference_Primary)" -ForegroundColor Gray
        Write-Host "  ✅ NLM_ID: $($first.metadata.NLM_ID)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ❌ FAILED - Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        try {
            $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "  Error: $($errorJson.error)" -ForegroundColor Yellow
        } catch {
            Write-Host "  Error: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
        }
    }
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "🎉 ALL TESTS PASSED - CODEX INTEGRATION WORKING!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Remove debug logging from codex-query.js (CURSOR task)" -ForegroundColor White
Write-Host "  2. Test WPS AI feature in WeldTrack Inspector app" -ForegroundColor White
Write-Host "  3. Monitor function logs for any issues" -ForegroundColor White



