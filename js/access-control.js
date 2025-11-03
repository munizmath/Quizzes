/**
 * Controle de Acesso
 * Garante que quiz.html só possa ser acessado através de index.html
 */

(function() {
    'use strict';
    
    // Verificar se estamos na página do quiz
    if (window.location.pathname.includes('quiz.html')) {
        // Verificar se há dados do usuário e grupos selecionados
        const userName = sessionStorage.getItem('userName');
        const userEmail = sessionStorage.getItem('userEmail');
        const quizType = sessionStorage.getItem('quizType');
        const selectedGroups = sessionStorage.getItem('selectedGroups');
        
        const hasUserData = userName && userEmail && quizType && selectedGroups;
        const referrer = document.referrer;
        const fromSelectGroups = referrer.includes('select-groups.html');
        
        if (!hasUserData || !fromSelectGroups) {
            // Redirecionar para index.html se acesso direto ou sem dados
            alert('Por favor, acesse o quiz através da página inicial.');
            sessionStorage.clear();
            window.location.href = 'index.html';
            return;
        }
    }
    
    // Verificar se estamos na página de seleção de grupos
    if (window.location.pathname.includes('select-groups.html')) {
        const userName = sessionStorage.getItem('userName');
        const userEmail = sessionStorage.getItem('userEmail');
        const quizType = sessionStorage.getItem('quizType');
        
        if (!userName || !userEmail || !quizType) {
            // Redirecionar para index.html se não houver dados do usuário
            alert('Por favor, preencha seus dados na página inicial.');
            window.location.href = 'index.html';
            return;
        }
    }
})();

