/**
 * Testes de Acessibilidade com axe-core
 * Executa testes automatizados de acessibilidade
 */

// Carregar axe-core se estiver no navegador
if (typeof window !== 'undefined') {
    // Carregar axe-core dinamicamente
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/axe-core@4.8.3/axe.min.js';
    script.onload = () => {
        if (typeof axe !== 'undefined') {
            runAccessibilityTests();
        }
    };
    document.head.appendChild(script);
}

async function runAccessibilityTests() {
    console.log('========================================');
    console.log('EXECUTANDO TESTES DE ACESSIBILIDADE');
    console.log('========================================\n');
    
    const results = {
        index: null,
        selectGroups: null,
        quiz: null
    };
    
    // Testar index.html
    if (window.location.pathname.includes('index.html')) {
        console.log('Testando index.html...');
        try {
            const result = await axe.run();
            results.index = result;
            displayResults('index.html', result);
        } catch (error) {
            console.error('Erro ao testar index.html:', error);
        }
    }
    
    // Testar select-groups.html
    if (window.location.pathname.includes('select-groups.html')) {
        console.log('Testando select-groups.html...');
        try {
            const result = await axe.run();
            results.selectGroups = result;
            displayResults('select-groups.html', result);
        } catch (error) {
            console.error('Erro ao testar select-groups.html:', error);
        }
    }
    
    // Testar quiz.html
    if (window.location.pathname.includes('quiz.html')) {
        console.log('Testando quiz.html...');
        try {
            const result = await axe.run();
            results.quiz = result;
            displayResults('quiz.html', result);
        } catch (error) {
            console.error('Erro ao testar quiz.html:', error);
        }
    }
    
    return results;
}

function displayResults(pageName, result) {
    console.log(`\nResultados para ${pageName}:`);
    console.log(`Violações encontradas: ${result.violations.length}`);
    console.log(`Passou: ${result.violations.length === 0 ? 'SIM' : 'NÃO'}\n`);
    
    if (result.violations.length > 0) {
        console.log('Violações:');
        result.violations.forEach((violation, index) => {
            console.log(`${index + 1}. ${violation.id}: ${violation.description}`);
            console.log(`   Impacto: ${violation.impact}`);
            console.log(`   Elementos afetados: ${violation.nodes.length}`);
        });
    }
    
    if (result.passes && result.passes.length > 0) {
        console.log(`\nTestes que passaram: ${result.passes.length}`);
    }
    
    console.log('\n========================================\n');
}

// Exportar para Node.js se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAccessibilityTests };
}

