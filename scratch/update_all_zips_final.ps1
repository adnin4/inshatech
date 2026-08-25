$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$docsDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs"

$zipPath1 = "$targetDir\insha zip for 2.zip"
$zipPath2 = "$targetDir\inshatech zip for.zip"
$zipPath3 = "$targetDir\inshatech.zip"

Compress-Archive -Path "$docsDir\*" -DestinationPath $zipPath1 -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath $zipPath2 -Force
Compress-Archive -Path "$docsDir\*" -DestinationPath $zipPath3 -Force

Write-Output "Updated Master Zips in New folder:"
Get-ChildItem -Path "$targetDir\*.zip" | Select-Object Name, Length, LastWriteTime
