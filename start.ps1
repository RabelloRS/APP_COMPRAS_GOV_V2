# ===================================================================
# Script de Inicializacao para a Aplicacao Compras.gov
# Versao: 4.0 (Reescrita focada em estabilidade)
# ===================================================================

# Garante que o script pare em caso de erro
$ErrorActionPreference = "Stop"

# Funcao para verificar se um comando existe
function Command-Exists {
    param([string]$command)
    return (Get-Command $command -ErrorAction SilentlyContinue)
}

# Verifica se o Node.js está instalado
Write-Host "Verificando se o Node.js esta instalado..."
if (-not (Command-Exists "node")) {
    Write-Host "Node.js nao encontrado. Por favor, instale-o e tente novamente." -ForegroundColor Red
    exit 1
}
Write-Host "Node.js encontrado." -ForegroundColor Green

# Verifica se o npm está instalado
Write-Host "Verificando se o npm esta instalado..."
if (-not (Command-Exists "npm")) {
    Write-Host "npm nao encontrado. Por favor, instale-o e tente novamente." -ForegroundColor Red
    exit 1
}
Write-Host "npm encontrado." -ForegroundColor Green

# Muda para o diretorio do script
Push-Location (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)

# Verifica se as dependencias (node_modules) estao instaladas
Write-Host "Verificando dependencias do projeto..."
if (-not (Test-Path ".\node_modules")) {
    Write-Host "Diretorio 'node_modules' nao encontrado. Instalando dependencias..." -ForegroundColor Yellow
    npm install
    Write-Host "Dependencias instaladas com sucesso." -ForegroundColor Green
} else {
    Write-Host "Dependencias ja estao instaladas." -ForegroundColor Green
}

# Inicia a API local em segundo plano
Write-Host "Iniciando a API local (server.js)..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"

# Inicia a aplicacao
Write-Host "`nIniciando a aplicacao React... (Pressione Ctrl+C para parar)" -ForegroundColor Cyan
npm start

# Retorna ao diretorio original
Pop-Location

Write-Host "`n✅ Servidor finalizado." -ForegroundColor Green 