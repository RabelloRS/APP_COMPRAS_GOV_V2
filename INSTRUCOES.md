# Instruções de Uso - Aplicação Compras.gov

Este projeto agora utiliza um único script para facilitar a inicialização.

## Como Iniciar a Aplicação

Use o script `start.ps1` para verificar o ambiente, instalar as dependências e iniciar o servidor de desenvolvimento.

### Passos:

1.  **Abra o terminal PowerShell.**
2.  **Navegue até a pasta raiz do projeto:**
    ```powershell
    cd CAMINHO\PARA\SEU\PROJETO\APP_COMPRAS_GOV
    ```
3.  **Execute o script de inicialização:**
    ```powershell
    .\start.ps1
    ```

### O que o script faz:
- **Verifica** se `Node.js` e `npm` estão instalados.
- **Instala** as dependências (`node_modules`) se não existirem.
- **Inicia** o servidor da aplicação com `npm start`.

Se você encontrar um erro de política de execução, execute este comando no PowerShell **como Administrador** uma única vez:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Depois disso, você poderá executar o script normalmente em qualquer terminal. 