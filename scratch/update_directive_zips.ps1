$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$docsDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs"
$localZipDirective = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\IINSHA_PRODUCTION_HARDENING_MASTER_DIRECTIVE.zip"

Compress-Archive -Path "$docsDir\*" -DestinationPath $localZipDirective -Force
Copy-Item -Path $localZipDirective -Destination "$targetDir\IINSHA_PRODUCTION_HARDENING_MASTER_DIRECTIVE.zip" -Force

Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\insha zip for 2.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech.zip" -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath "$targetDir\inshatech zip for.zip" -Force

Write-Output "Updated Master Zips in New folder:"
Get-ChildItem -Path "$targetDir\*.zip" | Select-Object Name, Length, LastWriteTime
