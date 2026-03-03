param(
  [string]$ProjectPath = "BackEnd/EjemploApi"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
  Write-Error "dotnet SDK no esta instalado. Instala .NET SDK 8 y vuelve a intentar."
}

if (-not (Test-Path $ProjectPath)) {
  Write-Error "No existe la carpeta del backend: $ProjectPath"
}

Push-Location $ProjectPath
try {
  Write-Host "Restaurando paquetes..."
  dotnet restore

  Write-Host "Restaurando herramientas locales (dotnet-ef)..."
  dotnet tool restore

  Write-Host "Aplicando migraciones..."
  dotnet ef database update

  Write-Host "Iniciando API..."
  dotnet run
}
finally {
  Pop-Location
}
