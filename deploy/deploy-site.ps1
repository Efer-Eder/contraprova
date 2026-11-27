<#
  Publishes the project page (site/) to /projeto/contraprova/.

  The server address is NOT stored in this repository. Set it locally:
    $env:CONTRAPROVA_DEPLOY_HOST = 'user@host'
  Optional:
    $env:CONTRAPROVA_DEPLOY_KEY         (default: ~/.ssh/id_ed25519)
    $env:CONTRAPROVA_DEPLOY_KNOWN_HOSTS (default: ~/.ssh/known_hosts)

  Usage:
    .\deploy\deploy-site.ps1           # upload files
    .\deploy\deploy-site.ps1 -Nginx    # also install the Nginx snippet (nginx -t, rollback on error)
    .\deploy\deploy-site.ps1 -DryRun   # show what would be sent
#>
param(
  [switch]$Nginx,
  [switch]$DryRun
)
$ErrorActionPreference = 'Stop'

$Root = Split-Path $PSScriptRoot -Parent
$HostAddr = $env:CONTRAPROVA_DEPLOY_HOST
if (-not $HostAddr) { throw 'Defina $env:CONTRAPROVA_DEPLOY_HOST (user@host). O endereço não fica no repositório.' }
$Key = if ($env:CONTRAPROVA_DEPLOY_KEY) { $env:CONTRAPROVA_DEPLOY_KEY } else { Join-Path $env:USERPROFILE '.ssh\id_ed25519' }
$KnownHosts = if ($env:CONTRAPROVA_DEPLOY_KNOWN_HOSTS) { $env:CONTRAPROVA_DEPLOY_KNOWN_HOSTS } else { Join-Path $env:USERPROFILE '.ssh\known_hosts' }
$SshOpt = @('-i', $Key, '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', "UserKnownHostsFile=$KnownHosts", '-o', 'IdentitiesOnly=yes')
$TS = (Get-Date).ToUniversalTime().ToString("yyyyMMdd'T'HHmmss'Z'")
$Stage = "/tmp/contraprova-deploy-$TS"

Push-Location $Root
try {
  $Local = Join-Path $env:TEMP "contraprova-site-$TS"
  New-Item -ItemType Directory -Force $Local | Out-Null
  # Pack site/ as projeto/contraprova/ (copy to a staging folder with the final name).
  $Pack = Join-Path $Local 'pack'
  New-Item -ItemType Directory -Force (Join-Path $Pack 'contraprova') | Out-Null
  Copy-Item -Recurse -Force (Join-Path $Root 'site\*') (Join-Path $Pack 'contraprova')
  tar -czf (Join-Path $Local 'site.tgz') -C $Pack contraprova
  if ($LASTEXITCODE -ne 0) { throw 'tar falhou' }
  Copy-Item (Join-Path $PSScriptRoot 'remote-site.sh') $Local
  Copy-Item (Join-Path $PSScriptRoot 'nginx-contraprova.conf') $Local

  # Native tools (ssh, scp, tar) write progress and warnings to stderr; in
  # Windows PowerShell that would abort the script. Exit codes decide instead.
  $ErrorActionPreference = 'Continue'

  if ($DryRun) {
    Get-ChildItem $Local -File | Format-Table Name, Length
    Write-Host "DryRun: nada enviado. Destino seria $Stage (Nginx: $Nginx)."
    return
  }

  ssh @SshOpt $HostAddr "mkdir -p $Stage && chmod 700 $Stage"
  if ($LASTEXITCODE -ne 0) { throw 'ssh mkdir falhou' }
  $files = Get-ChildItem $Local -File | ForEach-Object FullName
  scp @SshOpt @files "${HostAddr}:$Stage/"
  if ($LASTEXITCODE -ne 0) { throw 'scp falhou' }
  $flag = if ($Nginx) { '--nginx' } else { '' }
  ssh @SshOpt $HostAddr "bash $Stage/remote-site.sh $Stage $flag"
  if ($LASTEXITCODE -ne 0) { throw 'instalação remota falhou (o script restaura o Nginx em caso de erro)' }
  Remove-Item -Recurse -Force $Local
  Write-Host 'Publicado: https://efer.online/projeto/contraprova/'
}
finally {
  Pop-Location
}
