$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$docsDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs"
$localZip1 = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\IINSHA_PHASE1_RELEASE_PARITY.zip"

Compress-Archive -Path "$docsDir\*" -DestinationPath $localZip1 -Force
Copy-Item -Path $localZip1 -Destination "$targetDir\IINSHA_PHASE1_RELEASE_PARITY.zip" -Force

Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\insha zip for 2.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech zip for.zip" -Force

Write-Output "Updated Master Zips in New folder:"
Get-ChildItem -Path "$targetDir\*.zip" | Select-Object Name, Length, LastWriteTime
