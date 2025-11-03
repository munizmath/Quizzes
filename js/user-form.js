/**
 * Gerenciamento do Formulário de Usuário
 * Coleta nome, email e tipo de prova e redireciona para seleção de grupos
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('user-form');
    const startButton = document.getElementById('start-quiz-button');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('user-name').value.trim();
            const email = document.getElementById('user-email').value.trim();
            const quizType = document.getElementById('quiz-type').value;
            
            // Validação básica
            if (!name || !email || !quizType) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            // Salvar dados do usuário no sessionStorage
            sessionStorage.setItem('userName', name);
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('quizType', quizType);
            
            // Redirecionar para página de seleção de grupos
            window.location.href = 'select-groups.html';
        });
    }
});

