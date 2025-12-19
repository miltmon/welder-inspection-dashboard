# Remove Debug Logging from CODEX Function
# Run this script to clean up debug console.log statements

param(
    [switch]$DryRun  # Show what would be removed without making changes
)

$functionFile = "netlify/functions/codex-query.js"
$backupFile = "netlify/functions/codex-query.js.bak"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Remove Debug Logging from CODEX Function" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $functionFile)) {
    Write-Host "Error: Function file not found: $functionFile" -ForegroundColor Red
    exit 1
}

# Backup the file
Write-Host "Creating backup: $backupFile" -ForegroundColor Yellow
Copy-Item $functionFile $backupFile -Force

# Read the file
$content = Get-Content $functionFile -Raw

# Lines to remove (debug logging)
$debugPatterns = @(
    "console\.log\('codex-query invoked at'",
    "console\.log\('ENV CLAUSEBOT_KEY ='",
    "console\.log\('ENV CLAUSEBOT_ENDPOINT ='",
    "console\.log\('ENV VITE_CLAUSEBOT_KEY ='",
    "console\.log\('ENV VITE_CLAUSEBOT_ENDPOINT ='",
    "console\.log\('incoming payload preview:'",
    "// DEBUG: masked env visibility",
    "// helper: mask secrets"
)

Write-Host "Scanning for debug logging patterns..." -ForegroundColor Yellow
$linesToRemove = @()
$lines = Get-Content $functionFile

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    foreach ($pattern in $debugPatterns) {
        if ($line -match $pattern) {
            $linesToRemove += @{
                LineNumber = $i + 1
                Content = $line.Trim()
                Pattern = $pattern
            }
        }
    }
}

if ($linesToRemove.Count -eq 0) {
    Write-Host "No debug logging found. File is already clean." -ForegroundColor Green
    Remove-Item $backupFile -ErrorAction SilentlyContinue
    exit 0
}

Write-Host ""
Write-Host "Found $($linesToRemove.Count) debug logging lines:" -ForegroundColor Yellow
foreach ($item in $linesToRemove) {
    Write-Host "  Line $($item.LineNumber): $($item.Content.Substring(0, [Math]::Min(60, $item.Content.Length)))..." -ForegroundColor Gray
}

if ($DryRun) {
    Write-Host ""
    Write-Host "DRY RUN: No changes made. Remove -DryRun to apply changes." -ForegroundColor Cyan
    exit 0
}

# Remove the lines (in reverse order to preserve line numbers)
$newLines = $lines
for ($i = $linesToRemove.Count - 1; $i -ge 0; $i--) {
    $lineNum = $linesToRemove[$i].LineNumber - 1
    if ($lineNum -ge 0 -and $lineNum -lt $newLines.Count) {
        $newLines = $newLines[0..($lineNum-1)] + $newLines[($lineNum+1)..($newLines.Count-1)]
    }
}

# Also remove the maskEnv function if it exists and is only used for debugging
$content = $newLines -join "`n"
if ($content -notmatch "maskEnv") {
    # Remove maskEnv function definition if it's not used elsewhere
    $content = $content -replace "(?s)function maskEnv\([^}]+\}\s*", ""
}

# Write the cleaned file
$newLines | Set-Content $functionFile -NoNewline

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✓ Debug logging removed successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backup saved to: $backupFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review the changes: git diff $functionFile" -ForegroundColor White
Write-Host "2. Build and test: npm run build" -ForegroundColor White
Write-Host "3. Deploy: netlify deploy --prod --dir=dist --site 796579bb-0b32-4b2f-a821-165c8b0175e3" -ForegroundColor White
Write-Host "4. Test CODEX: .\scripts\test-codex-debug.ps1" -ForegroundColor White
Write-Host ""

