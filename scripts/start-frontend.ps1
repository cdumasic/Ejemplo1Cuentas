param(
  [string]$ProjectPath = "FrontEnd/Ejemplo-app"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js/npm no esta instalado. Instala Node.js 20+ y vuelve a intentar."
}

if (-not (Test-Path $ProjectPath)) {
  Write-Error "No existe la carpeta del frontend: $ProjectPath"
}

Push-Location $ProjectPath
try {
  if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..."
    npm install
  }

  Write-Host "Iniciando Angular..."
  npm start
}
finally {
  Pop-Location
}
