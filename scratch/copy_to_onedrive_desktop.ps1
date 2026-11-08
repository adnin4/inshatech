$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$sourceDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs\phase17"
$zipSource = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\IINSHA_PHASE17_PRODUCTION_EVIDENCE_REPORTS.zip"

if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    Write-Output "Created directory: $targetDir"
}

# Copy ZIP file
Copy-Item -Path $zipSource -Destination $targetDir -Force
Write-Output "Copied ZIP to: $targetDir"

# Copy all individual report files as well for convenience
Copy-Item -Path "$sourceDir\*" -Destination $targetDir -Force
Write-Output "Copied all 26 individual files to: $targetDir"

Get-ChildItem -Path $targetDir | Select-Object Name, Length
