# Script PowerShell para verificar a saúde da aplicação Compras.gov
# Autor: Rodrigo
# Data: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🏥 Verificação de Saúde - Aplicação Compras.gov" -ForegroundColor Blue
Write-Host "===============================================" -ForegroundColor Blue

# Função para fazer requisição HTTP
function Test-HttpRequest {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 10
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec $TimeoutSeconds -UseBasicParsing
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            ResponseTime = $response.BaseResponse.ResponseTime
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Função para verificar se um processo está rodando
function Test-ProcessRunning {
    param([string]$ProcessName)
    
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    return $processes.Count -gt 0
}

# Função para verificar se uma porta está em uso
function Test-PortInUse {
    param([int]$Port)
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connections.Count -gt 0
}

# Verificar ambiente Node.js
Write-Host "`n🔍 Verificando ambiente Node.js..." -ForegroundColor Cyan

$nodeVersion = node --version 2>$null
$npmVersion = npm --version 2>$null

if ($nodeVersion) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js não encontrado" -ForegroundColor Red
}

if ($npmVersion) {
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm não encontrado" -ForegroundColor Red
}

# Verificar dependências
Write-Host "`n🔍 Verificando dependências..." -ForegroundColor Cyan

$nodeModulesPath = "node_modules"
if (Test-Path $nodeModulesPath) {
    Write-Host "✅ node_modules encontrado" -ForegroundColor Green
    
    # Verificar dependências principais
    $dependencies = @("react", "typescript", "axios", "lucide-react", "tailwindcss")
    foreach ($dep in $dependencies) {
        $depPath = Join-Path $nodeModulesPath $dep
        if (Test-Path $depPath) {
            Write-Host "✅ $dep instalado" -ForegroundColor Green
        } else {
            Write-Host "❌ $dep não encontrado" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ node_modules não encontrado" -ForegroundColor Red
}

# Verificar arquivos de configuração
Write-Host "`n🔍 Verificando arquivos de configuração..." -ForegroundColor Cyan

$configFiles = @{
    "package.json" = "Configuração do projeto"
    "tsconfig.json" = "Configuração TypeScript"
    "tailwind.config.js" = "Configuração Tailwind CSS"
    "postcss.config.js" = "Configuração PostCSS"
}

foreach ($file in $configFiles.Keys) {
    if (Test-Path $file) {
        Write-Host "✅ $($configFiles[$file]): $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $($configFiles[$file]): $file não encontrado" -ForegroundColor Red
    }
}

# Verificar arquivos da aplicação
Write-Host "`n🔍 Verificando arquivos da aplicação..." -ForegroundColor Cyan

$appFiles = @{
    "src/App.tsx" = "Componente principal"
    "src/index.tsx" = "Ponto de entrada"
    "src/index.css" = "Estilos globais"
    "src/types/index.ts" = "Definições de tipos"
    "src/services/api.ts" = "Serviços da API"
    "public/index.html" = "HTML principal"
}

foreach ($file in $appFiles.Keys) {
    if (Test-Path $file) {
        Write-Host "✅ $($appFiles[$file]): $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $($appFiles[$file]): $file não encontrado" -ForegroundColor Red
    }
}

# Verificar se o servidor está rodando
Write-Host "`n🔍 Verificando servidor de desenvolvimento..." -ForegroundColor Cyan

$ports = @(3000, 3001)
$serverRunning = $false

foreach ($port in $ports) {
    if (Test-PortInUse $port) {
        Write-Host "✅ Servidor rodando na porta $port" -ForegroundColor Green
        $serverRunning = $true
        
        # Testar se a aplicação responde
        $appUrl = "http://localhost:$port"
        Write-Host "   Testando resposta da aplicação..." -ForegroundColor Cyan
        
        $response = Test-HttpRequest -Url $appUrl -TimeoutSeconds 5
        if ($response.Success) {
            Write-Host "   ✅ Aplicação respondendo (Status: $($response.StatusCode))" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Aplicação não responde: $($response.Error)" -ForegroundColor Red
        }
        break
    }
}

if (-not $serverRunning) {
    Write-Host "❌ Servidor não está rodando" -ForegroundColor Red
    Write-Host "   Execute: npm start" -ForegroundColor Yellow
}

# Verificar conectividade com a API do Compras.gov
Write-Host "`n🔍 Verificando conectividade com a API do Compras.gov..." -ForegroundColor Cyan

$apiUrls = @{
    "https://dadosabertos.compras.gov.br/modulo-material/1_consultarGrupoMaterial?pagina=1" = "API Grupos de Materiais"
    "https://dadosabertos.compras.gov.br/modulo-material/2_consultarClasseMaterial?pagina=1" = "API Classes de Materiais"
    "https://dadosabertos.compras.gov.br/modulo-servico/6_consultarItemServico?pagina=1" = "API Serviços"
}

foreach ($url in $apiUrls.Keys) {
    Write-Host "   Testando $($apiUrls[$url])..." -ForegroundColor Cyan
    $response = Test-HttpRequest -Url $url -TimeoutSeconds 10
    
    if ($response.Success) {
        Write-Host "   ✅ $($apiUrls[$url]) - OK (Status: $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($apiUrls[$url]) - Erro: $($response.Error)" -ForegroundColor Red
    }
}

# Verificar conectividade geral com a internet
Write-Host "`n🔍 Verificando conectividade com a internet..." -ForegroundColor Cyan

$testUrls = @("https://www.google.com", "https://www.github.com")

foreach ($url in $testUrls) {
    $response = Test-HttpRequest -Url $url -TimeoutSeconds 5
    if ($response.Success) {
        Write-Host "✅ Conectividade com $url - OK" -ForegroundColor Green
        break
    }
}

if (-not $response.Success) {
    Write-Host "❌ Problemas de conectividade com a internet" -ForegroundColor Red
}

# Verificar espaço em disco
Write-Host "`n🔍 Verificando espaço em disco..." -ForegroundColor Cyan

$drive = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
$freeSpaceGB = [math]::Round($drive.FreeSpace / 1GB, 2)
$totalSpaceGB = [math]::Round($drive.Size / 1GB, 2)
$usedSpaceGB = $totalSpaceGB - $freeSpaceGB
$usedPercentage = [math]::Round(($usedSpaceGB / $totalSpaceGB) * 100, 1)

Write-Host "💾 Espaço em disco C:" -ForegroundColor White
Write-Host "   Total: ${totalSpaceGB}GB" -ForegroundColor White
Write-Host "   Usado: ${usedSpaceGB}GB (${usedPercentage}%)" -ForegroundColor White
Write-Host "   Livre: ${freeSpaceGB}GB" -ForegroundColor White

if ($freeSpaceGB -lt 1) {
    Write-Host "   ⚠️  Pouco espaço livre (< 1GB)" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Espaço suficiente disponível" -ForegroundColor Green
}

# Verificar memória RAM
Write-Host "`n🔍 Verificando memória RAM..." -ForegroundColor Cyan

$memory = Get-WmiObject -Class Win32_OperatingSystem
$totalMemoryGB = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 2)
$freeMemoryGB = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)
$usedMemoryGB = $totalMemoryGB - $freeMemoryGB
$memoryUsagePercentage = [math]::Round(($usedMemoryGB / $totalMemoryGB) * 100, 1)

Write-Host "🧠 Memória RAM:" -ForegroundColor White
Write-Host "   Total: ${totalMemoryGB}GB" -ForegroundColor White
Write-Host "   Usado: ${usedMemoryGB}GB (${memoryUsagePercentage}%)" -ForegroundColor White
Write-Host "   Livre: ${freeMemoryGB}GB" -ForegroundColor White

if ($memoryUsagePercentage -gt 90) {
    Write-Host "   ⚠️  Uso de memória alto (> 90%)" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Uso de memória normal" -ForegroundColor Green
}

# Resumo final
Write-Host "`n📊 Resumo da Verificação:" -ForegroundColor Blue
Write-Host "=========================" -ForegroundColor Blue

$issues = @()

if (-not $nodeVersion) { $issues += "Node.js não instalado" }
if (-not $npmVersion) { $issues += "npm não encontrado" }
if (-not (Test-Path $nodeModulesPath)) { $issues += "Dependências não instaladas" }
if (-not $serverRunning) { $issues += "Servidor não está rodando" }
if ($freeSpaceGB -lt 1) { $issues += "Pouco espaço em disco" }
if ($memoryUsagePercentage -gt 90) { $issues += "Uso de memória alto" }

if ($issues.Count -eq 0) {
    Write-Host "✅ Tudo parece estar funcionando corretamente!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Encontrados $($issues.Count) problema(s):" -ForegroundColor Yellow
    foreach ($issue in $issues) {
        Write-Host "   • $issue" -ForegroundColor Yellow
    }
}

Write-Host "`n🏁 Verificação concluída em $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Blue 