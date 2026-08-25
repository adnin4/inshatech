$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$auditDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs\audit"
$docsDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs"
$localZipAudit = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\IINSHA_GOLDEN_BASELINE_AUDIT.zip"

Compress-Archive -Path "$auditDir\*" -DestinationPath $localZipAudit -Force
Copy-Item -Path $localZipAudit -Destination "$targetDir\IINSHA_GOLDEN_BASELINE_AUDIT.zip" -Force

Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\insha zip for 2.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech zip for.zip" -Force

Write-Output "Updated Master Zips in New folder:"
Get-ChildItem -Path "$targetDir\*.zip" | Select-Object Name, Length, LastWriteTime
