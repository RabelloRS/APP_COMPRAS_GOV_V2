# Script PowerShell para iniciar a aplicação Compras.gov
# Autor: Rodrigo
# Data: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🚀 Iniciando Aplicação Compras.gov" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Função para verificar se um comando existe
function Test-Command {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Função para verificar versão do Node.js
function Get-NodeVersion {
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            return $nodeVersion.Trim()
        }
        return $null
    }
    catch {
        return $null
    }
}

# Função para verificar versão do npm
function Get-NpmVersion {
    try {
        $npmVersion = npm --version 2>$null
        if ($npmVersion) {
            return $npmVersion.Trim()
        }
        return $null
    }
    catch {
        return $null
    }
}

# Verificar se estamos no diretório correto
$currentDir = Get-Location
$packageJsonPath = Join-Path $currentDir "package.json"

if (-not (Test-Path $packageJsonPath)) {
    Write-Host "❌ Erro: package.json não encontrado no diretório atual" -ForegroundColor Red
    Write-Host "   Certifique-se de estar no diretório raiz do projeto" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Diretório do projeto verificado" -ForegroundColor Green

# Verificar Node.js
Write-Host "`n🔍 Verificando Node.js..." -ForegroundColor Cyan
if (Test-Command "node") {
    $nodeVersion = Get-NodeVersion
    if ($nodeVersion) {
        Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
        
        # Verificar versão mínima (16+)
        $versionNumber = $nodeVersion -replace 'v', ''
        $majorVersion = [int]($versionNumber.Split('.')[0])
        
        if ($majorVersion -ge 16) {
            Write-Host "✅ Versão do Node.js é compatível (>= 16)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Aviso: Versão do Node.js pode ser muito antiga. Recomendado: 16+" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Erro ao obter versão do Node.js" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "   Por favor, instale o Node.js em: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "   Versão recomendada: 16.x ou superior" -ForegroundColor Yellow
    exit 1
}

# Verificar npm
Write-Host "`n🔍 Verificando npm..." -ForegroundColor Cyan
if (Test-Command "npm") {
    $npmVersion = Get-NpmVersion
    if ($npmVersion) {
        Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao obter versão do npm" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ npm não encontrado!" -ForegroundColor Red
    Write-Host "   O npm geralmente vem com o Node.js" -ForegroundColor Yellow
    exit 1
}

# Verificar se node_modules existe
Write-Host "`n🔍 Verificando dependências..." -ForegroundColor Cyan
$nodeModulesPath = Join-Path $currentDir "node_modules"

if (Test-Path $nodeModulesPath) {
    Write-Host "✅ node_modules encontrado" -ForegroundColor Green
    
    # Verificar se as dependências principais estão instaladas
    $reactPath = Join-Path $nodeModulesPath "react"
    $typescriptPath = Join-Path $nodeModulesPath "typescript"
    
    if (Test-Path $reactPath -and Test-Path $typescriptPath) {
        Write-Host "✅ Dependências principais verificadas" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Algumas dependências podem estar faltando" -ForegroundColor Yellow
        Write-Host "   Executando npm install..." -ForegroundColor Cyan
        npm install
    }
} else {
    Write-Host "📦 node_modules não encontrado. Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Verificar se a instalação foi bem-sucedida
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "❌ Falha na instalação das dependências" -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo de configuração do TypeScript existe
Write-Host "`n🔍 Verificando configurações..." -ForegroundColor Cyan
$tsConfigPath = Join-Path $currentDir "tsconfig.json"
$tailwindConfigPath = Join-Path $currentDir "tailwind.config.js"

if (Test-Path $tsConfigPath) {
    Write-Host "✅ tsconfig.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ tsconfig.json não encontrado" -ForegroundColor Red
    exit 1
}

if (Test-Path $tailwindConfigPath) {
    Write-Host "✅ tailwind.config.js encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ tailwind.config.js não encontrado" -ForegroundColor Red
    exit 1
}

# Verificar se os arquivos principais da aplicação existem
Write-Host "`n🔍 Verificando arquivos da aplicação..." -ForegroundColor Cyan
$srcPath = Join-Path $currentDir "src"
$appPath = Join-Path $srcPath "App.tsx"
$indexPath = Join-Path $srcPath "index.tsx"

if (Test-Path $srcPath) {
    Write-Host "✅ Diretório src encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Diretório src não encontrado" -ForegroundColor Red
    exit 1
}

if (Test-Path $appPath) {
    Write-Host "✅ App.tsx encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ App.tsx não encontrado" -ForegroundColor Red
    exit 1
}

if (Test-Path $indexPath) {
    Write-Host "✅ index.tsx encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ index.tsx não encontrado" -ForegroundColor Red
    exit 1
}

# Verificar se o servidor já está rodando
Write-Host "`n🔍 Verificando se o servidor já está rodando..." -ForegroundColor Cyan
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if ($port3000 -or $port3001) {
    Write-Host "⚠️  Servidor já está rodando em uma das portas 3000 ou 3001" -ForegroundColor Yellow
    if ($port3000) {
        Write-Host "   Porta 3000 está em uso" -ForegroundColor Yellow
    }
    if ($port3001) {
        Write-Host "   Porta 3001 está em uso" -ForegroundColor Yellow
    }
    
    $response = Read-Host "Deseja continuar mesmo assim? (s/N)"
    if ($response -ne "s" -and $response -ne "S") {
        Write-Host "Operação cancelada pelo usuário" -ForegroundColor Yellow
        exit 0
    }
}

# Iniciar a aplicação
Write-Host "`n🚀 Iniciando a aplicação..." -ForegroundColor Green
Write-Host "   A aplicação será aberta em: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host "`n" -ForegroundColor White

# Executar npm start (isso bloqueia até o usuário parar o servidor)
npm start

Write-Host "`nAplicacao finalizada" -ForegroundColor Green 