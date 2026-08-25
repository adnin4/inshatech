$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$docsDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs"
$localZipMaster = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\IINSHA_FINAL_OPERATING_SYSTEM_CHARTER.zip"

Compress-Archive -Path "$docsDir\*" -DestinationPath $localZipMaster -Force
Copy-Item -Path $localZipMaster -Destination "$targetDir\IINSHA_FINAL_OPERATING_SYSTEM_CHARTER.zip" -Force

Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\insha zip for 2.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech zip for.zip" -Force

Write-Output "Updated Master Zips in New folder:"
Get-ChildItem -Path "$targetDir\*.zip" | Select-Object Name, Length, LastWriteTime
