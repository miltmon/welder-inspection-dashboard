# redeploy-and-verify-codex.ps1
Set-StrictMode -Version Latest
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $root

Write-Host "Working dir: $root`n"

# Ensure Node deps + build (safe install to avoid lockfile CI issues)
Write-Host "Installing node deps..."
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed" -ForegroundColor Red; Pop-Location; exit 1 }

Write-Host "Building..."
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "npm run build failed" -ForegroundColor Red; Pop-Location; exit 1 }

# Deploy to Netlify (requires netlify CLI & NETLIFY_SITE_ID env var)
$siteId = $env:NETLIFY_SITE_ID
if (-not $siteId) {
  Write-Host "`nNETLIFY_SITE_ID not set. Please set it before running, or run interactive netlify deploy." -ForegroundColor Yellow
  Write-Host "Example: $env:NETLIFY_SITE_ID = '796579bb-0b32-4b2f-a821-165c8b0175e3'"
} else {
  $netlify = Get-Command netlify -ErrorAction SilentlyContinue
  if ($netlify) {
    Write-Host "`nDeploying to Netlify site id: $siteId ..."
    netlify deploy --prod --site $siteId --dir=dist --functions=.netlify/functions
    if ($LASTEXITCODE -ne 0) { Write-Host "Netlify deploy failed" -ForegroundColor Red; Pop-Location; exit 1 }
  } else {
    Write-Host "`nNetlify CLI not found. Install it: npm i -g netlify-cli or run manual deploy." -ForegroundColor Yellow
  }
}

# Small pause to let functions warm up
Start-Sleep -Seconds 6

# Smoke test the function
$endpoint = "https://weldtrack-inspector.netlify.app/.netlify/functions/codex-query"
$body = @{ q = "preheat clause 6.5"; top_k = 3 } | ConvertTo-Json
Write-Host "`nCalling function endpoint: $endpoint`nPayload: $body`n"

try {
  $resp = Invoke-RestMethod -Uri $endpoint -Method Post -ContentType "application/json" -Body $body -TimeoutSec 120
  Write-Host "`n=== FUNCTION RESPONSE (raw) ===" -ForegroundColor Green
  $resp | ConvertTo-Json -Depth 6 | Write-Host
  # Quick sanity checks
  if ($resp.count -and $resp.results) {
    Write-Host "`nCount:" $resp.count
    Write-Host "Results.length:" $resp.results.Count
  } else {
    Write-Host "`nWarning: response missing 'count' or 'results' fields." -ForegroundColor Yellow
  }
} catch {
  Write-Host "`n=== REQUEST FAILED ===" -ForegroundColor Red
  Write-Host $_.Exception.Message
  try {
    if ($_.Exception.Response) {
      $stream = $_.Exception.Response.GetResponseStream()
      $reader = New-Object System.IO.StreamReader($stream)
      $bodyText = $reader.ReadToEnd()
      Write-Host "`nResponse body:`n$bodyText"
    }
  } catch {}
  Pop-Location; exit 1
}

Pop-Location
