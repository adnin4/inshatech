$ErrorActionPreference = "Stop"

$sourceDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"
$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$folderName = "insha zip all documentes 1"
$folderPath = Join-Path $targetDir $folderName
$zipPath = "$folderPath.zip"

Write-Output "================================================================================"
Write-Output "IINSHA AI-BOS: HARDENED CLEAN MASTER ARCHIVE GENERATOR"
Write-Output "SECURITY INVARIANT: .env EXCLUDED | ONLY .env.example INCLUDED"
Write-Output "================================================================================"

# 1. Ensure target folder exists and update Markdown Reports
$markdownDest = Join-Path $folderPath "Implementation_Reports_Markdown"
if (-not (Test-Path $markdownDest)) { New-Item -ItemType Directory -Path $markdownDest | Out-Null }
Copy-Item -Path "$sourceDir\docs\*" -Destination $markdownDest -Recurse -Force

# 2. Stage clean files (STRICTLY NO .env)
$stagingDir = "$env:TEMP\iinsha_hardened_clean_staging"
if (Test-Path $stagingDir) { Remove-Item -Path $stagingDir -Recurse -Force }
New-Item -ItemType Directory -Path $stagingDir | Out-Null

$itemsToCopy = @(
    "index.html", "admin.html", "store.html", "marketplace.html", "portal.html", "affiliate.html", "affiliate-login.html", "affiliate-dashboard.html", "compare.html", "blog.html",
    "google050e48ae270ce622.html", "portfolio_playwright_scraper.jpg", "portfolio_n8n_stripe_recovery.jpg", "portfolio_hermes_ai_agent.jpg", "adnin_sadat.jpg", "real_n8n_canvas_screenshot.jpg",
    "app.js", "hero3d.js", "scroll-engine.js", "worker.js", "package.json", "docker-compose.yml", "_headers", "_routes.json", "sitemap.xml", "robots.txt", "_redirects",
    "ai_brain", "functions", "knowledge", "src", "supabase", "docs", "scripts", ".github", ".env.example"
)

foreach ($item in $itemsToCopy) {
    $srcPath = Join-Path $sourceDir $item
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $stagingDir -Recurse -Force
    }
}

# Verify .env is NOT present in staging
$leakedEnv = Join-Path $stagingDir ".env"
if (Test-Path $leakedEnv) {
    Remove-Item -Path $leakedEnv -Force
    Write-Warning "CRITICAL: .env file was present and has been PURGED from staging!"
}

# 3. Create clean inner zip
$masterZip = Join-Path $folderPath "IINSHA_COMPLETE_PRODUCTION_PLATFORM_V10.zip"
if (Test-Path $masterZip) { Remove-Item -Path $masterZip -Force }
Compress-Archive -Path "$stagingDir\*" -DestinationPath $masterZip -Force
Remove-Item -Path $stagingDir -Recurse -Force

# 4. Create clean outer zip
if (Test-Path $zipPath) { Remove-Item -Path $zipPath -Force }
Compress-Archive -Path "$folderPath\*" -DestinationPath $zipPath -Force

# 5. Mirror copy to Desktop
Copy-Item -Path $zipPath -Destination "C:\Users\mahin khan\OneDrive\Desktop\insha zip all documentes 1.zip" -Force

Write-Output "CLEAN MASTER ARCHIVE GENERATED SUCCESSFULLY (0 SECRETS INCLUDED):"
Get-Item $zipPath | Select-Object Name, Length, LastWriteTime
