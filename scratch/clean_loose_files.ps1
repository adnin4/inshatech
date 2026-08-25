$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$phase17Files = Get-ChildItem "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs\phase17" | Select-Object -ExpandProperty Name

foreach ($f in $phase17Files) {
    $loosePath = Join-Path $targetDir $f
    if (Test-Path $loosePath) {
        Remove-Item $loosePath -Force
    }
}

# Also remove previous temporary zip name if needed
if (Test-Path "$targetDir\IINSHA_PHASE17_PRODUCTION_EVIDENCE_REPORTS.zip") {
    Remove-Item "$targetDir\IINSHA_PHASE17_PRODUCTION_EVIDENCE_REPORTS.zip" -Force
}

Write-Output "Folder contents after cleanup:"
Get-ChildItem $targetDir | Select-Object Name, Length
