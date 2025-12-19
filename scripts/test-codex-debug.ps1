# Test CODEX Function with Debug Output
# This script calls the function and shows the response

$url = "https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query"
$body = @{
    q = "preheat clause 6.5"
    top_k = 3
} | ConvertTo-Json

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Testing CODEX Function" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL: $url" -ForegroundColor Yellow
Write-Host "Body: $body" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error Response:" -ForegroundColor Red
    $_.Exception.Response | Format-List
    if ($_.ErrorDetails.Message) {
        Write-Host "Error Details:" -ForegroundColor Red
        $_.ErrorDetails.Message
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Check logs at:" -ForegroundColor Yellow
Write-Host "https://app.netlify.com/projects/weldtrack-inspector/logs-and-metrics/functions" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

