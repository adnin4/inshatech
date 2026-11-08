$targetDir = "C:\Users\mahin khan\OneDrive\Desktop\New folder"
$folderName = "insha zip all documentes 1"
$folderPath = Join-Path $targetDir $folderName
$zipPath = "$folderPath.zip"

Write-Output "================================================================================"
Write-Output "👑 MOVING ALL ZIP FILES INTO: $folderPath"
Write-Output "================================================================================"

if (-not (Test-Path $folderPath)) {
    New-Item -ItemType Directory -Path $folderPath | Out-Null
}

$allZips = Get-ChildItem -Path $targetDir -Filter "*.zip" | Where-Object { 
    $_.Name -ne "$folderName.zip" -and $_.Name -notmatch "mknet"
}

foreach ($zip in $allZips) {
    $dest = Join-Path $folderPath $zip.Name
    Write-Output "Moving: $($zip.Name) -> $folderName"
    Move-Item -Path $zip.FullName -Destination $dest -Force
}

# Re-create the master zip file containing this folder
Write-Output "Compressing entire folder into: $zipPath"
if (Test-Path $zipPath) { Remove-Item -Path $zipPath -Force }
Compress-Archive -Path "$folderPath\*" -DestinationPath $zipPath -Force

Write-Output "================================================================================"
Write-Output "✅ Organization complete! Current state of: $targetDir"
Write-Output "================================================================================"
Get-ChildItem -Path $targetDir | Select-Object Name, Length, LastWriteTime

Write-Output "`nContents inside '$folderName':"
Get-ChildItem -Path $folderPath | Select-Object Name, Length, LastWriteTime
