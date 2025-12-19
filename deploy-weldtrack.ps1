# deploy-weldtrack.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Working directory: $root"
Push-Location $root

# 1) Git status info
if (Test-Path .git) {
  Write-Host "`n=== Git status ==="
  git status --porcelain
} else {
  Write-Host ".git not found in $root"
}

# 2) Install & build
if (Test-Path package.json) {
  Write-Host "`n=== Installing npm dependencies (npm install) ==="
  npm install
  if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed. Aborting." -ForegroundColor Red
    Pop-Location; exit 1
  }
  Write-Host "`n=== Building (npm run build) ==="
  npm run build
  if ($LASTEXITCODE -ne 0) {
    Write-Host "npm run build failed. Aborting." -ForegroundColor Red
    Pop-Location; exit 1
  }
} else {
  Write-Host "package.json not found. Aborting build." -ForegroundColor Yellow
  Pop-Location; exit 1
}

# 3) Netlify deploy (optional)
$netlifyCmd = (Get-Command netlify -ErrorAction SilentlyContinue)
if ($netlifyCmd) {
  $siteId = $env:NETLIFY_SITE_ID
  if ($siteId) {
    Write-Host "`n=== Deploying to Netlify site id: $siteId ==="
    netlify deploy --prod --site $siteId --dir=dist --functions=netlify/functions
  } else {
    Write-Host "`nNetlify CLI found but NETLIFY_SITE_ID is not set."
    Write-Host "Run: `$env:NETLIFY_SITE_ID = \"796579bb-0b32-4b2f-a821-165c8b0175e3\"" -ForegroundColor Yellow
    Write-Host "Then: netlify deploy --prod --site $env:NETLIFY_SITE_ID --dir=dist --functions=netlify/functions" -ForegroundColor Yellow
  }
} else {
  Write-Host "`nNetlify CLI not found. Install: npm i -g netlify-cli" -ForegroundColor Yellow
}

Pop-Location
