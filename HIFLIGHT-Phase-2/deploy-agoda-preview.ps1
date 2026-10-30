$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$env:CLOUDFLARE_ACCOUNT_ID = '0e347c14aca97a02f4f6fb6b971d69df'
$env:WRANGLER_SEND_METRICS = 'false'
function Invoke-Step {
 param([string]$Program, [string[]]$Arguments)
 & $Program @Arguments
 if ($LASTEXITCODE -ne 0) { throw "Echec de $Program. Consultez le message ci-dessus." }
}
$version = & node --version
if ($LASTEXITCODE -ne 0) { throw 'Node.js doit etre installe.' }
if ([int]($version.TrimStart('v').Split('.')[0]) -lt 22) { throw 'Installez Node.js 22 ou 24 avant de continuer.' }
Write-Host 'Preparation du site de TEST hiflight-agoda-preview. Aucun domaine de production ne sera modifie.'
Invoke-Step -Program npm.cmd -Arguments @('ci','--legacy-peer-deps')
Invoke-Step -Program npx.cmd -Arguments @('wrangler','login')
Invoke-Step -Program npx.cmd -Arguments @('wrangler','whoami')
Invoke-Step -Program npm.cmd -Arguments @('run','build:agoda-preview')
# The info command is read-only. If the bucket is absent, create only the dedicated preview bucket.
& npx.cmd wrangler r2 bucket info hiflight-agoda-preview-catalogue
if ($LASTEXITCODE -ne 0) {
 Invoke-Step -Program npx.cmd -Arguments @('wrangler','r2','bucket','create','hiflight-agoda-preview-catalogue')
}
Invoke-Step -Program npx.cmd -Arguments @('wrangler','r2','object','put','hiflight-agoda-preview-catalogue/destinations-v1.json','--file','lib/agoda/destinations-full.json','--remote')
Invoke-Step -Program npm.cmd -Arguments @('run','deploy:agoda-preview')
$oldEnv = Join-Path $HOME 'Downloads\hiflight-agoda-test\HIFLIGHT-Phase-2\.env.local'
$auth = $null
if (Test-Path $oldEnv) {
 foreach ($line in [IO.File]::ReadAllLines($oldEnv)) {
  if ($line -match '^\s*AGODA_AUTH\s*=\s*(.*?)\s*$') { $auth = $Matches[1].Trim().Trim('"').Trim("'") }
 }
}
if ($auth) {
 $auth | & npx.cmd wrangler secret put AGODA_AUTH --config wrangler.agoda-preview.jsonc
 $auth = $null
 if ($LASTEXITCODE -ne 0) { throw 'Impossible de configurer la cle Agoda.' }
} else {
 Write-Host 'Saisissez la cle Agoda complete (identifiant:cle) dans la demande suivante.'
 Invoke-Step -Program npx.cmd -Arguments @('wrangler','secret','put','AGODA_AUTH','--config','wrangler.agoda-preview.jsonc')
}
Write-Host 'Publication terminee. Ouvrez l URL workers.dev affichee ci-dessus, puis /hotels/.'
Write-Host 'Verifier la carte, les offres, les liens et le mobile avant toute mise en production.'
