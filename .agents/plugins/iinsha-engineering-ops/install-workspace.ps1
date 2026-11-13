param(
    [Parameter(Mandatory = $true)]
    [string]$WorkspacePath
)

$ErrorActionPreference = 'Stop'
$source = Join-Path $PSScriptRoot 'iinsha-engineering-ops'
if (-not (Test-Path -LiteralPath $source -PathType Container)) {
    throw "Plugin source folder not found: $source"
}
if (-not (Test-Path -LiteralPath (Join-Path $WorkspacePath '.git'))) {
    $gitRoot = & git -C $WorkspacePath rev-parse --show-toplevel 2>$null
    if (-not $gitRoot) {
        throw "WorkspacePath is not a Git repository: $WorkspacePath"
    }
}
$target = Join-Path $WorkspacePath '.agents/plugins/iinsha-engineering-ops'
if (Test-Path -LiteralPath $target) {
    throw "Target already exists; refusing to overwrite: $target. Back it up and inspect it first."
}
New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
Copy-Item -LiteralPath $source -Destination $target -Recurse
Write-Host "Installed workspace plugin: $target" -ForegroundColor Green
Write-Host "Next: reload Antigravity IDE, open Agent > ... > Customizations, inspect the plugin, and configure MCP variables." -ForegroundColor Cyan
Write-Host "No source files, Git refs, database, Cloudflare settings, or global configuration were modified."
