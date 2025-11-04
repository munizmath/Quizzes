/**
 * Runner de Testes de Acessibilidade
 * Executa testes de acessibilidade usando axe-core CLI
 */

const { run } = require('@axe-core/cli');

async function runAccessibilityTests() {
    console.log('Iniciando testes de acessibilidade...\n');
    
    const urls = [
        'http://localhost:8000/index.html',
        'http://localhost:8000/select-groups.html',
        'http://localhost:8000/quiz.html?type=aws'
    ];
    
    try {
        for (const url of urls) {
            console.log(`Testando: ${url}`);
            await run(url, {
                tags: ['wcag2a', 'wcag2aa', 'best-practice']
            });
            console.log('');
        }
        
        console.log('Testes de acessibilidade concluídos!');
    } catch (error) {
        console.error('Erro ao executar testes:', error);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    runAccessibilityTests();
}

module.exports = { runAccessibilityTests };

