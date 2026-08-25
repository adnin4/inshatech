$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$sourceDocs = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs\phase17"

# Zip with the requested names in the New folder
$zipPath1 = "$targetDir\inshatech.zip"
$zipPath2 = "$targetDir\inshatech zip for.zip"
$zipPath3 = "$targetDir\inshatech zip.zip"

Compress-Archive -Path "$sourceDocs\*" -DestinationPath $zipPath1 -Force
Compress-Archive -Path "$sourceDocs\*" -DestinationPath $zipPath2 -Force
Compress-Archive -Path "$sourceDocs\*" -DestinationPath $zipPath3 -Force

Write-Output "Created Zips in $targetDir:"
Get-ChildItem -Path "$targetDir\inshatech*.zip" | Select-Object Name, Length, LastWriteTime
