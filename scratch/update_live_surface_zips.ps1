$sourceDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"
$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$folderName = "insha zip all documentes 1"
$folderPath = Join-Path $targetDir $folderName
$zipPath = "$folderPath.zip"

Write-Output "================================================================================"
Write-Output "👑 UPDATING FINAL MASTER ARCHIVE (LIVE SURFACE & BUTTON PARITY 100%): $zipPath"
Write-Output "================================================================================"

# 1. Update Markdown Reports
$markdownDest = Join-Path $folderPath "Implementation_Reports_Markdown"
if (-not (Test-Path $markdownDest)) { New-Item -ItemType Directory -Path $markdownDest | Out-Null }
Copy-Item -Path "$sourceDir\docs\*" -Destination $markdownDest -Recurse -Force

# 2. Update Complete Workspace Master Zip inside
$stagingDir = "$env:TEMP\iinsha_complete_staging_live_surface_button_parity"
if (Test-Path $stagingDir) { Remove-Item -Path $stagingDir -Recurse -Force }
New-Item -ItemType Directory -Path $stagingDir | Out-Null

$itemsToCopy = @(
    "index.html", "admin.html", "store.html", "marketplace.html", "portal.html", "affiliate.html", "affiliate-login.html", "affiliate-dashboard.html", "compare.html", "blog.html",
    "google050e48ae270ce622.html", "app.js", "hero3d.js", "scroll-engine.js", "worker.js", "package.json", "docker-compose.yml", "_headers", "_routes.json", "sitemap.xml", "robots.txt", "_redirects",
    "ai_brain", "functions", "knowledge", "src", "supabase", "docs", "scratch", "scripts", ".github"
)

foreach ($item in $itemsToCopy) {
    $srcPath = Join-Path $sourceDir $item
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $stagingDir -Recurse -Force
    }
}

$masterZip = Join-Path $folderPath "IINSHA_COMPLETE_PRODUCTION_PLATFORM_V10.zip"
Compress-Archive -Path "$stagingDir\*" -DestinationPath $masterZip -Force
Remove-Item -Path $stagingDir -Recurse -Force

# 3. Compress entire folder to master zip
if (Test-Path $zipPath) { Remove-Item -Path $zipPath -Force }
Compress-Archive -Path "$folderPath\*" -DestinationPath $zipPath -Force

# 4. Copy to desktop root
Copy-Item -Path $zipPath -Destination "C:\Users\mahin khan\OneDrive\Desktop\insha zip all documentes 1.zip" -Force

Write-Output "Updated Master Zip Files:"
Get-Item $zipPath | Select-Object Name, Length, LastWriteTime
