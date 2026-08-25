$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$phase19Dir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs\phase19"
$docsDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs"
$localZip19 = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\IINSHA_PHASE19_PRODUCTION_OPERATIONALIZATION.zip"

# Create Phase 19 dedicated zip
Compress-Archive -Path "$phase19Dir\*" -DestinationPath $localZip19 -Force

# Copy to OneDrive Desktop folder
Copy-Item -Path $localZip19 -Destination "$targetDir\IINSHA_PHASE19_PRODUCTION_OPERATIONALIZATION.zip" -Force

# Also update the master zips
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\insha zip for 2.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech zip for.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech.zip" -Force

Write-Output "Created and updated all ZIP files in New folder:"
Get-ChildItem -Path "$targetDir\*.zip" | Select-Object Name, Length, LastWriteTime
