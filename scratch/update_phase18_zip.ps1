$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$docsDir = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs"

# Create updated master zip containing phase17 and phase18
$zipPath1 = "$targetDir\inshatech.zip"
$zipPath2 = "$targetDir\inshatech zip for.zip"

Compress-Archive -Path "$docsDir\phase17", "$docsDir\phase18" -DestinationPath $zipPath1 -Force
Compress-Archive -Path "$docsDir\phase17", "$docsDir\phase18" -DestinationPath $zipPath2 -Force

Write-Output "Updated Master Zips created successfully:"
Get-ChildItem -Path "$targetDir\inshatech*.zip" | Select-Object Name, Length, LastWriteTime
