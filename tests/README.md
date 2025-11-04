# Testes do QUIZ TECH

Este diretório contém os testes do sistema de quiz.

## Estrutura de Testes

- `quiz.test.js` - Testes unitários básicos para funções principais

## Como Executar os Testes

### Opção 1: No Navegador

1. Abra `index.html` ou `quiz.html` no navegador
2. Abra o Console do Desenvolvedor (F12)
3. Clique no botão "Executar Testes" que aparece no canto inferior direito
4. Os resultados aparecerão no console

### Opção 2: Com Jest (Recomendado)

```bash
# Instalar Jest
npm install --save-dev jest

# Executar testes
npm test
```

### Opção 3: Com Vitest (Alternativa Moderna)

```bash
# Instalar Vitest
npm install --save-dev vitest

# Executar testes
npm run test
```

## Testes Implementados

### 1. Teste de Embaralhamento (shuffleArray)
- Verifica se todos os elementos são mantidos após embaralhar
- Verifica se o tamanho do array permanece o mesmo

### 2. Teste de Validação de Combinações
- Verifica combinações válidas de grupos
- Verifica combinações inválidas
- Verifica limite de 3 grupos

### 3. Teste de Cálculo de Pontuação
- Verifica cálculo de percentual
- Verifica verificação de aprovação
- Verifica cálculo de questões restantes

### 4. Teste de Escape HTML (XSS)
- Verifica escape de texto simples
- Verifica escape de HTML perigoso
- Verifica escape de caracteres especiais

### 5. Teste de Formatação de Timer
- Verifica formatação de 30 minutos
- Verifica formatação de minutos e segundos
- Verifica formatação de zero

### 6. Teste de Estrutura JSON
- Verifica campos obrigatórios
- Verifica tipos de dados válidos
- Verifica estrutura de opções

## Adicionando Novos Testes

Para adicionar novos testes, edite `quiz.test.js` e adicione uma nova função de teste:

```javascript
function testNovaFuncionalidade() {
    console.log('Testando nova funcionalidade...');
    
    // Seu código de teste aqui
    const resultado = minhaFuncao();
    const esperado = true;
    
    console.log('✓ Teste passou:', resultado === esperado);
    return resultado === esperado;
}
```

Depois adicione a função ao `runAllTests()`:

```javascript
const results = {
    // ... outros testes
    novaFuncionalidade: testNovaFuncionalidade()
};
```

## Próximos Passos

Para testes mais avançados, considere:

1. **Testes de Integração**: Testar fluxo completo do quiz
2. **Testes E2E**: Usar Cypress ou Playwright para testar interface
3. **Testes de Acessibilidade**: Usar axe-core ou WAVE
4. **Testes de Performance**: Medir tempo de carregamento e renderização

