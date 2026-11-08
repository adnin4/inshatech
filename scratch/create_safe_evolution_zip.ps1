$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$docsDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs"
$localZip = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\IINSHA_SAFE_EVOLUTION_PROTOCOL.zip"

Compress-Archive -Path "$docsDir\*" -DestinationPath $localZip -Force
Copy-Item -Path $localZip -Destination "$targetDir\IINSHA_SAFE_EVOLUTION_PROTOCOL.zip" -Force

Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\insha zip for 2.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech zip for.zip" -Force

Write-Output "Created IINSHA_SAFE_EVOLUTION_PROTOCOL.zip and updated all Desktop Zips:"
Get-ChildItem -Path "$targetDir\*.zip" | Select-Object Name, Length, LastWriteTime
