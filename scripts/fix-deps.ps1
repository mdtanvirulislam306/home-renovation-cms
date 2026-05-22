# Fixes corrupted node_modules on Windows (ENOTEMPTY errors)
Write-Host "Stopping Node processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Removing node_modules (may take a minute)..."
if (Test-Path "node_modules") {
  npx --yes rimraf@5 node_modules
}

if (Test-Path "package-lock.json") {
  Remove-Item "package-lock.json" -Force
}

Write-Host "Installing dependencies..."
npm install --legacy-peer-deps

if (Test-Path "node_modules\.bin\next.cmd") {
  Write-Host "Success! Run: npm run dev"
} else {
  Write-Host "Install may have failed. Try closing Cursor/VS Code and run this script again."
}
