# test-codex-function.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$endpoint = "https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query"
$payload = @{ q = "preheat clause 6.5"; top_k = 3 } | ConvertTo-Json

Write-Host "POST $endpoint"
try {
  $resp = Invoke-RestMethod -Uri $endpoint -Method Post -ContentType "application/json" -Body $payload -TimeoutSec 60
  Write-Host "`n=== SUCCESS RESPONSE ===" -ForegroundColor Green
  $json = $resp | ConvertTo-Json -Depth 6
  Write-Host $json
  if ($resp.count -and ($resp.results)) {
    Write-Host "`nCount:" $resp.count
    Write-Host "Results length:" $resp.results.Count
  } elseif ($resp.results) {
    Write-Host "`nResults length:" $resp.results.Count
  }
} catch {
  Write-Host "`n=== REQUEST FAILED ===" -ForegroundColor Red
  Write-Host $_.Exception.Message
  try {
    if ($_.Exception.Response) {
      $stream = $_.Exception.Response.GetResponseStream()
      $reader = New-Object System.IO.StreamReader($stream)
      $body = $reader.ReadToEnd()
      Write-Host "`nResponse body:`n" $body
    }
  } catch {}
  exit 1
}
