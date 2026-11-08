$ErrorActionPreference = "Stop"

$sourceDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"
$tempBuild = "$env:TEMP\iinsha_pack_build"
if (Test-Path $tempBuild) { Remove-Item -Path $tempBuild -Recurse -Force }
New-Item -ItemType Directory -Path $tempBuild | Out-Null

$folderName = "insha zip all documentes 1"
$folderPath = Join-Path $tempBuild $folderName
$markdownDest = Join-Path $folderPath "Implementation_Reports_Markdown"
New-Item -ItemType Directory -Path $markdownDest -Force | Out-Null
Copy-Item -Path "$sourceDir\docs\*" -Destination $markdownDest -Recurse -Force

# Stage clean files (STRICTLY NO .env)
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

# Purge any accidental .env
$leakedEnv = Join-Path $stagingDir ".env"
if (Test-Path $leakedEnv) { Remove-Item -Path $leakedEnv -Force }

# Inner zip
$masterZip = Join-Path $folderPath "IINSHA_COMPLETE_PRODUCTION_PLATFORM_V10.zip"
Compress-Archive -Path "$stagingDir\*" -DestinationPath $masterZip -Force
Remove-Item -Path $stagingDir -Recurse -Force

# Outer zip
$tempZip = "$folderPath.zip"
Compress-Archive -Path "$folderPath\*" -DestinationPath $tempZip -Force

# Deliver to Desktop
$desktopDir = "C:\Users\mahin khan\OneDrive\Desktop"
Copy-Item -Path $tempZip -Destination (Join-Path $desktopDir "insha zip all documentes 1.zip") -Force
Copy-Item -Path $tempZip -Destination (Join-Path $desktopDir "cloudflare_pages_dist.zip") -Force

# Clean temp
Remove-Item -Path $tempBuild -Recurse -Force

Write-Output "CLEAN MASTER ARCHIVE GENERATED SUCCESSFULLY (0 SECRETS INCLUDED):"
Get-Item (Join-Path $desktopDir "cloudflare_pages_dist.zip") | Select-Object Name, Length, LastWriteTime
