$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$scratchDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\scratch\insha_zip_for_2_staging"

if (Test-Path $scratchDir) {
    Remove-Item $scratchDir -Recurse -Force
}
New-Item -ItemType Directory -Path $scratchDir -Force | Out-Null

# List of 17 core audit files
$coreAuditFiles = @(
    "docs/PROJECT_AUDIT.md",
    "docs/FEATURE_INVENTORY.md",
    "docs/FRONTEND_AUDIT.md",
    "docs/BACKEND_API_AUDIT.md",
    "docs/DATABASE_AUDIT.md",
    "docs/AUTH_SECURITY_AUDIT.md",
    "docs/PAYMENT_AUDIT.md",
    "docs/AI_AUTOMATION_AUDIT.md",
    "docs/SECURITY_AUDIT.md",
    "docs/PERFORMANCE_AUDIT.md",
    "docs/UI_UX_AUDIT.md",
    "docs/DEVOPS_AUDIT.md",
    "docs/DISASTER_RECOVERY_AUDIT.md",
    "docs/TEST_REPORT.md",
    "docs/60_SECTOR_SCORECARD.md",
    "docs/MASTER_IMPLEMENTATION_ROADMAP.md",
    "docs/EXECUTIVE_SUMMARY.md",
    "docs/FINAL_GAP_REPORT.md",
    "docs/PAYMENT_RECONCILIATION_REPORT.md",
    "docs/WEBHOOK_VERIFICATION_REPORT.md",
    "docs/LEDGER_INTEGRITY_REPORT.json",
    "docs/FINAL_RELEASE_CERTIFICATE.md",
    "docs/FINAL_DEPLOYMENT_MANIFEST.json",
    "docs/IMPLEMENTATION_STATUS.md"
)

foreach ($f in $coreAuditFiles) {
    $srcPath = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\$f"
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $scratchDir -Force
    }
}

$zipPath = "$targetDir\insha zip for 2.zip"

Compress-Archive -Path "$scratchDir\*" -DestinationPath $zipPath -Force

Write-Output "Created: $zipPath"
Write-Output "Size: $((Get-Item $zipPath).Length) bytes"

Get-ChildItem -Path $targetDir | Select-Object Name, Length, LastWriteTime
