# Sync .env.local vars to Vercel (Production, Preview, Development)
# Usage: .\scripts\sync-vercel-env.ps1

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
  Write-Error ".env.local not found"
  exit 1
}

$parsed = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
  if ($_ -match '^([^=]+)=(.*)$') {
    $parsed[$matches[1].Trim()] = $matches[2].Trim().Trim('"').Trim("'")
  }
}

$environments = @("production", "preview", "development")

foreach ($name in $parsed.Keys) {
  $value = $parsed[$name]
  foreach ($env in $environments) {
    Write-Host "Setting $name -> $env"
    $value | npx vercel env add $name $env --force 2>&1 | Out-Null
  }
}

Write-Host ""
Write-Host "Done. Redeploy required for NEXT_PUBLIC_* vars to take effect:"
Write-Host "  npx vercel --prod"
