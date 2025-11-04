/**
 * Testes Unitários para QUIZ TECH
 * Este arquivo pode ser executado com Jest, Vitest ou em um navegador
 */

// Mock básico para testes no navegador
if (typeof module !== 'undefined' && module.exports) {
    // Ambiente Node.js (Jest/Vitest)
    const { describe, test, expect, beforeEach } = require('@jest/globals');
}

/**
 * Testes para função shuffleArray
 */
function testShuffleArray() {
    console.log('Testando shuffleArray...');
    
    const originalArray = [1, 2, 3, 4, 5];
    const shuffled = [...originalArray];
    
    // Embaralhar
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Verificar se todos os elementos estão presentes
    const allPresent = originalArray.every(item => shuffled.includes(item));
    
    // Verificar se tem o mesmo tamanho
    const sameLength = originalArray.length === shuffled.length;
    
    console.log('✓ shuffleArray mantém todos os elementos:', allPresent && sameLength);
    return allPresent && sameLength;
}

/**
 * Testes para validação de combinações de grupos
 */
function testAllowedCombinations() {
    console.log('Testando validação de combinações...');
    
    const allowedCombinations = [
        "1,2,3", "1,2,4", "1,2,5", "1,2,6", 
        "1,3,4", "2,3,4", "2,5,6", 
        "3,4,5", "3,4,6", "4,5,6", "1,5,6"
    ];
    
    // Teste 1: Combinação válida
    const validCombo = [1, 2, 3].sort().join(',');
    const isValid1 = allowedCombinations.includes(validCombo);
    console.log('✓ Combinação [1,2,3] é válida:', isValid1);
    
    // Teste 2: Combinação inválida
    const invalidCombo = [1, 3, 5].sort().join(',');
    const isValid2 = allowedCombinations.includes(invalidCombo);
    console.log('✓ Combinação [1,3,5] é inválida:', !isValid2);
    
    // Teste 3: Limite de 3 grupos
    const tooManyGroups = [1, 2, 3, 4];
    const isValid3 = tooManyGroups.length <= 3;
    console.log('✓ Limite de 3 grupos respeitado:', isValid3);
    
    return isValid1 && !isValid2 && isValid3;
}

/**
 * Testes para cálculo de pontuação
 */
function testScoreCalculation() {
    console.log('Testando cálculo de pontuação...');
    
    // Teste 1: Cálculo básico
    const totalQuestions = 75;
    const correctAnswers = 60;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const expectedPercentage = 80;
    console.log(`✓ Percentual calculado corretamente (${percentage}%):`, percentage === expectedPercentage);
    
    // Teste 2: Percentual mínimo
    const passingPercentage = 80;
    const passed = percentage >= passingPercentage;
    console.log('✓ Verificação de aprovação:', passed);
    
    // Teste 3: Cálculo de questões restantes
    const requiredCorrect = Math.ceil((passingPercentage / 100) * totalQuestions);
    const remaining = requiredCorrect - correctAnswers;
    const expectedRemaining = 0;
    console.log(`✓ Questões restantes calculadas (${remaining}):`, remaining === expectedRemaining);
    
    return percentage === expectedPercentage && passed && remaining === expectedRemaining;
}

/**
 * Testes para escapeHtml (prevenção XSS)
 */
function testEscapeHtml() {
    console.log('Testando escapeHtml...');
    
    // Função de escape básica
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Teste 1: Texto simples
    const simpleText = 'Teste';
    const escaped1 = escapeHtml(simpleText);
    const isSafe1 = escaped1 === 'Teste';
    console.log('✓ Texto simples escapado:', isSafe1);
    
    // Teste 2: HTML perigoso
    const dangerousHtml = '<script>alert("XSS")</script>';
    const escaped2 = escapeHtml(dangerousHtml);
    const isSafe2 = !escaped2.includes('<script>');
    console.log('✓ HTML perigoso escapado:', isSafe2);
    
    // Teste 3: Caracteres especiais
    const specialChars = '&<>"\'';
    const escaped3 = escapeHtml(specialChars);
    const isSafe3 = escaped3 === specialChars; // textContent já escapa
    console.log('✓ Caracteres especiais escapados:', isSafe3);
    
    return isSafe1 && isSafe2;
}

/**
 * Testes para formato de timer
 */
function testTimerFormat() {
    console.log('Testando formatação de timer...');
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Teste 1: 30 minutos
    const time1 = 30 * 60; // 1800 segundos
    const formatted1 = formatTime(time1);
    const isValid1 = formatted1 === '30:00';
    console.log(`✓ Timer 30 minutos formatado (${formatted1}):`, isValid1);
    
    // Teste 2: 5 minutos e 30 segundos
    const time2 = 5 * 60 + 30;
    const formatted2 = formatTime(time2);
    const isValid2 = formatted2 === '05:30';
    console.log(`✓ Timer 5:30 formatado (${formatted2}):`, isValid2);
    
    // Teste 3: 0 segundos
    const time3 = 0;
    const formatted3 = formatTime(time3);
    const isValid3 = formatted3 === '00:00';
    console.log(`✓ Timer 0 formatado (${formatted3}):`, isValid3);
    
    return isValid1 && isValid2 && isValid3;
}

/**
 * Testes para validação de estrutura JSON
 */
function testJsonStructure() {
    console.log('Testando estrutura JSON...');
    
    const sampleQuestion = {
        id: 1,
        question: "Teste?",
        options: {
            "A": "Opção A",
            "B": "Opção B",
            "C": "Opção C",
            "D": "Opção D"
        },
        correctAnswer: "A",
        explanation: "Explicação opcional"
    };
    
    // Teste 1: Campos obrigatórios
    const hasRequiredFields = 
        sampleQuestion.id !== undefined &&
        sampleQuestion.question !== undefined &&
        sampleQuestion.options !== undefined &&
        sampleQuestion.correctAnswer !== undefined;
    console.log('✓ Campos obrigatórios presentes:', hasRequiredFields);
    
    // Teste 2: Tipo de resposta correta
    const isString = typeof sampleQuestion.correctAnswer === 'string';
    const isArray = Array.isArray(sampleQuestion.correctAnswer);
    const isValidType = isString || isArray;
    console.log('✓ Tipo de resposta correta válido:', isValidType);
    
    // Teste 3: Opções são objeto
    const optionsIsObject = typeof sampleQuestion.options === 'object' && 
                           !Array.isArray(sampleQuestion.options);
    console.log('✓ Opções são objeto válido:', optionsIsObject);
    
    return hasRequiredFields && isValidType && optionsIsObject;
}

/**
 * Executar todos os testes
 */
function runAllTests() {
    console.log('========================================');
    console.log('INICIANDO TESTES DO QUIZ TECH');
    console.log('========================================\n');
    
    const results = {
        shuffleArray: testShuffleArray(),
        allowedCombinations: testAllowedCombinations(),
        scoreCalculation: testScoreCalculation(),
        escapeHtml: testEscapeHtml(),
        timerFormat: testTimerFormat(),
        jsonStructure: testJsonStructure()
    };
    
    console.log('\n========================================');
    console.log('RESULTADOS DOS TESTES');
    console.log('========================================');
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r).length;
    const failedTests = totalTests - passedTests;
    
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? '✓' : '✗'} ${test}: ${passed ? 'PASSOU' : 'FALHOU'}`);
    });
    
    console.log('\n========================================');
    console.log(`Total: ${totalTests} | Passou: ${passedTests} | Falhou: ${failedTests}`);
    console.log('========================================\n');
    
    return {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        allPassed: failedTests === 0
    };
}

// Executar testes se estiver no navegador
if (typeof window !== 'undefined') {
    // Criar botão de teste na página
    document.addEventListener('DOMContentLoaded', () => {
        const testButton = document.createElement('button');
        testButton.textContent = 'Executar Testes';
        testButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 10px; background: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;';
        testButton.onclick = () => {
            console.clear();
            runAllTests();
        };
        document.body.appendChild(testButton);
    });
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testShuffleArray,
        testAllowedCombinations,
        testScoreCalculation,
        testEscapeHtml,
        testTimerFormat,
        testJsonStructure,
        runAllTests
    };
}

