$sourceDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs\phase17"
$zipPath = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\IINSHA_PHASE17_PRODUCTION_EVIDENCE_REPORTS.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path "$sourceDir\*" -DestinationPath $zipPath -Force

Write-Output "ZIP created successfully at: $zipPath"
Write-Output "Size: $((Get-Item $zipPath).Length) bytes"
