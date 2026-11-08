$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$sourceDocs = "C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\docs\phase17"

$zipPath1 = "$targetDir\inshatech.zip"
$zipPath2 = "$targetDir\inshatech zip for.zip"

Compress-Archive -Path "$sourceDocs\*" -DestinationPath $zipPath1 -Force
Compress-Archive -Path "$sourceDocs\*" -DestinationPath $zipPath2 -Force

Write-Output "Created Zips:"
Get-ChildItem -Path "$targetDir\inshatech*.zip" | Select-Object Name, Length
