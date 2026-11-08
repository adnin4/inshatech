$sourceDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"
$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"

Write-Output "================================================================================"
Write-Output "👑 PACKAGING ENTIRE IINSHA PRODUCTION PLATFORM WORKSPACE TO DESKTOP ZIPS"
Write-Output "================================================================================"

# Create temporary staging directory excluding node_modules / temp files
$stagingDir = "$env:TEMP\iinsha_complete_staging"
if (Test-Path $stagingDir) { Remove-Item -Path $stagingDir -Recurse -Force }
New-Item -ItemType Directory -Path $stagingDir | Out-Null

# Copy all essential project files & folders
$itemsToCopy = @(
    "index.html", "admin.html", "store.html", "marketplace.html", "portal.html", "affiliate.html", "affiliate-login.html", "affiliate-dashboard.html", "compare.html", "blog.html",
    "app.js", "hero3d.js", "scroll-engine.js", "worker.js", "package.json", "docker-compose.yml", "_headers", "_routes.json", "sitemap.xml", "robots.txt",
    "ai_brain", "functions", "knowledge", "src", "supabase", "docs", "scratch"
)

foreach ($item in $itemsToCopy) {
    $srcPath = Join-Path $sourceDir $item
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $stagingDir -Recurse -Force
    }
}

$masterZip = Join-Path $sourceDir "IINSHA_COMPLETE_PRODUCTION_PLATFORM_V10.zip"
if (Test-Path $masterZip) { Remove-Item -Path $masterZip -Force }
Compress-Archive -Path "$stagingDir\*" -DestinationPath $masterZip -Force

# Distribute to all Target Desktop Zip files
$targetZips = @(
    "IINSHA_COMPLETE_PRODUCTION_PLATFORM_V10.zip",
    "IINSHA_AUTONOMOUS_GROWTH_AND_FREE_VPS_SUITE.zip",
    "IINSHA_ADAPTIVE_LEARNING_ENGINE.zip",
    "IINSHA_FINAL_PRODUCTION_CERTIFICATION_MASTER.zip",
    "IINSHA_FOUNDATION_GATE_CERTIFIED.zip",
    "IINSHA_FOUNDATION_GATE_LOCKED.zip",
    "IINSHA_FOUNDATION_GATE_V1.zip",
    "IINSHA_GOLDEN_BASELINE_AUDIT.zip",
    "IINSHA_PRODUCTION_HARDENING_MASTER_DIRECTIVE.zip",
    "IINSHA_FINAL_OPERATING_SYSTEM_CHARTER.zip",
    "IINSHA_PHASE1_RELEASE_PARITY.zip",
    "IINSHA_SAFE_EVOLUTION_PROTOCOL.zip",
    "insha zip for 2.zip",
    "inshatech.zip",
    "inshatech zip for.zip"
)

foreach ($zipName in $targetZips) {
    $destPath = Join-Path $targetDir $zipName
    Copy-Item -Path $masterZip -Destination $destPath -Force
}

# Clean staging directory
Remove-Item -Path $stagingDir -Recurse -Force

Write-Output "Master Workspace packaging complete! Updated files in target directory:"
Get-ChildItem -Path "$targetDir\*.zip" | Select-Object Name, Length, LastWriteTime
