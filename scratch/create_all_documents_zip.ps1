$sourceDocs = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs"
$desktopNewFolder = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$targetFolderName = "insha zip all documentes 1"
$stagingPath = "$env:TEMP\$targetFolderName"

Write-Output "================================================================================"
Write-Output "👑 CREATING MASTER IMPLEMENTATION REPORTS BUNDLE: $targetFolderName"
Write-Output "================================================================================"

if (Test-Path $stagingPath) { Remove-Item -Path $stagingPath -Recurse -Force }
New-Item -ItemType Directory -Path $stagingPath | Out-Null
New-Item -ItemType Directory -Path "$stagingPath\Implementation_Reports_Markdown" | Out-Null
New-Item -ItemType Directory -Path "$stagingPath\Implementation_Zip_Packages" | Out-Null

# 1. Copy all implementation report markdown files from docs
Copy-Item -Path "$sourceDocs\*" -Destination "$stagingPath\Implementation_Reports_Markdown" -Recurse -Force

# 2. Copy all IINSHA implementation zip files from Desktop New folder
$iinshaZips = Get-ChildItem -Path $desktopNewFolder -Filter "*.zip" | Where-Object { $_.Name -notmatch "mknet" }

foreach ($zip in $iinshaZips) {
    Copy-Item -Path $zip.FullName -Destination "$stagingPath\Implementation_Zip_Packages" -Force
}

# 3. Create a master index README inside the package
$readmeContent = @"
# 👑 IINSHA AI-BOS: ALL IMPLEMENTATION REPORTS & DOCUMENTATION MASTER (1)

## 📌 Contents of this Master Archive
This bundle contains all official implementation reports, certification matrices, audit documents, architecture blueprints, and implementation ZIP packages for the IINSHA AI-BOS platform.

### 📁 1. Implementation_Reports_Markdown/
- **FOUNDATION_GATE_REPORT.md**: 16-point Foundation Gate certification ledger (100% PASS).
- **PRODUCTION_CERTIFICATION_MATRIX.md**: 26-gate production verification matrix.
- **60_SECTOR_SCORECARD.md & UPDATED_60_SECTOR_SCORECARD.md**: 60-sector empirical evaluation (Score: 9.42 / 10).
- **IINSHA_CONTINUOUS_LEARNING_AND_ADAPTIVE_ARCHITECTURE.md**: Continuous learning and dynamic adaptation engine blueprint.
- **100_PERCENT_FREE_N8N_AND_VPS_GUIDE.md**: 100% Free n8n deployment guide (Oracle Cloud Always Free & Cloudflare Tunnel).
- **IINSHA_FINAL_PRODUCTION_ARCHITECTURE_ROADMAP.md**: 18-phase master production architecture.
- **IINSHA_PRODUCTION_ENGINEERING_RULESET.md**: 12-step change execution protocol.
- **MASTER_VERIFICATION_PROGRAM_55_TRACKS.md**: 55 behavioral verification tracks.
- **docs/audit/**: 14 reality audit maps (01-system-map to 14-known-risks).
- **docs/baseline/**: Baseline tags, commit SHAs, database state, and environment state.

### 📁 2. Implementation_Zip_Packages/
- **IINSHA_COMPLETE_PRODUCTION_PLATFORM_V10.zip**: Full codebase with all 10 HTML pages, edge functions, AI brain, and DB schemas.
- **IINSHA_AUTONOMOUS_GROWTH_AND_FREE_VPS_SUITE.zip**: Autonomous lead hunter & free VPS package.
- **IINSHA_ADAPTIVE_LEARNING_ENGINE.zip**: Adaptive learning engine package.
- **IINSHA_FINAL_PRODUCTION_CERTIFICATION_MASTER.zip**: Full production certification master package.
- **IINSHA_FOUNDATION_GATE_CERTIFIED.zip**: Foundation gate certified package.
- **IINSHA_FOUNDATION_GATE_V1.zip**: Foundation gate V1 package.
- **insha zip for 2.zip / inshatech.zip**: Mirror production archives.

---
**Author:** Adnin Sadat Mahin | Founder & Lead AI Engineer  
**Status:** 100% CERTIFIED & PRODUCTION READY
"@
$readmeContent | Out-File -Encoding utf8 "$stagingPath\README_MASTER_INDEX.md"

# 4. Copy the folder to Desktop New folder
$finalFolderInNewFolder = "$desktopNewFolder\$targetFolderName"
if (Test-Path $finalFolderInNewFolder) { Remove-Item -Path $finalFolderInNewFolder -Recurse -Force }
Copy-Item -Path $stagingPath -Destination $desktopNewFolder -Recurse -Force

# 5. Compress into the target zip file in Desktop New folder and on Desktop
$finalZipInNewFolder = "$desktopNewFolder\$targetFolderName.zip"
$finalZipOnDesktop = "C:\Users\mahin khan\OneDrive\Desktop\$targetFolderName.zip"

if (Test-Path $finalZipInNewFolder) { Remove-Item -Path $finalZipInNewFolder -Force }
Compress-Archive -Path "$stagingPath\*" -DestinationPath $finalZipInNewFolder -Force

Copy-Item -Path $finalZipInNewFolder -Destination $finalZipOnDesktop -Force

# Clean temp staging
Remove-Item -Path $stagingPath -Recurse -Force

Write-Output "✅ Successfully generated:"
Write-Output "1. Folder: $finalFolderInNewFolder"
Write-Output "2. Zip in New folder: $finalZipInNewFolder ($(Get-Item $finalZipInNewFolder).Length bytes)"
Write-Output "3. Zip on Desktop: $finalZipOnDesktop ($(Get-Item $finalZipOnDesktop).Length bytes)"
