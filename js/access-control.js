/**
 * Controle de Acesso
 * Garante que quiz.html só possa ser acessado através de index.html
 */

(function() {
    'use strict';
    
    // Verificar se estamos na página do quiz
    if (window.location.pathname.includes('quiz.html')) {
        // Verificar se o acesso foi feito através de index.html
        const referrer = document.referrer;
        const fromIndex = referrer.includes('index.html') || 
                         sessionStorage.getItem('quizAccessGranted') === 'true';
        
        if (!fromIndex) {
            // Redirecionar para index.html se acesso direto
            alert('Por favor, acesse o quiz através da página inicial.');
            window.location.href = 'index.html';
            return;
        }
        
        // Limpar flag após uso
        sessionStorage.removeItem('quizAccessGranted');
    } else if (window.location.pathname.includes('index.html') || 
               window.location.pathname.endsWith('/') || 
               window.location.pathname.endsWith('index.html')) {
        // Se estamos em index.html, marcar permissão para links de quiz
        document.addEventListener('DOMContentLoaded', function() {
            const quizLinks = document.querySelectorAll('a[href*="quiz.html"]');
            quizLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // Marcar que o acesso foi autorizado
                    sessionStorage.setItem('quizAccessGranted', 'true');
                });
            });
        });
    }
})();

