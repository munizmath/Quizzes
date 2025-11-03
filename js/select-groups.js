/**
 * Gerenciamento da Seleção de Grupos
 * Permite selecionar até 3 grupos antes de iniciar o quiz
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se há dados do usuário
    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');
    const quizType = sessionStorage.getItem('quizType');
    
    // Se não houver dados, redirecionar para index.html
    if (!userName || !userEmail || !quizType) {
        alert('Por favor, preencha seus dados na página inicial.');
        window.location.href = 'index.html';
        return;
    }
    
    // Exibir informações do usuário
    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');
    const displayQuizType = document.getElementById('display-quiz-type');
    
    if (displayName) displayName.textContent = userName;
    if (displayEmail) displayEmail.textContent = userEmail;
    if (displayQuizType) {
        displayQuizType.textContent = quizType === 'aws' 
            ? 'Quiz AWS - Certificações Amazon Web Services'
            : 'Quiz COBIT - Governança e Gerenciamento de TI';
    }
    
    // Estado dos grupos selecionados
    let selectedGroups = [];
    
    // Combinações permitidas
    const allowedCombinations = [
        "1,2,3", "1,2,4", "1,2,5", "1,2,6", 
        "1,3,4", "2,3,4", "2,5,6", 
        "3,4,5", "3,4,6", "4,5,6", "1,5,6"
    ];
    
    // Botões de grupo
    const groupButtons = document.querySelectorAll('.group-button');
    const startButton = document.getElementById('start-quiz-button');
    const backButton = document.getElementById('back-button');
    const errorMessage = document.getElementById('error-message');
    const selectedCount = document.getElementById('selected-count');
    const selectedGroupsList = document.getElementById('selected-groups-list');
    
    // Função para atualizar UI
    function updateUI() {
        // Atualizar contador
        if (selectedCount) {
            selectedCount.textContent = selectedGroups.length;
        }
        
        // Atualizar lista de grupos selecionados
        if (selectedGroupsList) {
            if (selectedGroups.length === 0) {
                selectedGroupsList.textContent = 'Nenhum grupo selecionado';
            } else {
                selectedGroupsList.textContent = 'Grupos: ' + selectedGroups.sort((a, b) => a - b).join(', ');
            }
        }
        
        // Atualizar estado dos botões
        groupButtons.forEach(button => {
            const groupNum = parseInt(button.getAttribute('data-group'));
            const isSelected = selectedGroups.includes(groupNum);
            
            button.classList.toggle('selected', isSelected);
            button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });
        
        // Habilitar/desabilitar botão de iniciar
        if (startButton) {
            startButton.disabled = selectedGroups.length === 0;
            startButton.setAttribute('aria-disabled', selectedGroups.length === 0 ? 'true' : 'false');
        }
        
        // Limpar mensagem de erro
        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
        }
    }
    
    // Função para mostrar erro
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.setAttribute('role', 'alert');
        }
    }
    
    // Adicionar event listeners aos botões de grupo
    groupButtons.forEach(button => {
        button.addEventListener('click', function() {
            const groupNum = parseInt(this.getAttribute('data-group'));
            const index = selectedGroups.indexOf(groupNum);
            
            if (index > -1) {
                // Remover grupo
                selectedGroups.splice(index, 1);
                updateUI();
            } else {
                // Adicionar grupo
                if (selectedGroups.length >= 3) {
                    showError('Você já selecionou 3 grupos. Desmarque um grupo para selecionar outro.');
                    return;
                }
                
                selectedGroups.push(groupNum);
                
                // Verificar combinação permitida quando atingir 3 grupos
                if (selectedGroups.length === 3) {
                    const sortedGroups = [...selectedGroups].sort().join(',');
                    if (!allowedCombinations.includes(sortedGroups)) {
                        showError('Esta combinação de grupos não é permitida. Selecione uma combinação válida.');
                        selectedGroups.pop();
                        updateUI();
                        return;
                    }
                }
                
                updateUI();
            }
        });
    });
    
    // Botão de iniciar quiz
    if (startButton) {
        startButton.addEventListener('click', function() {
            if (selectedGroups.length === 0) {
                showError('Por favor, selecione pelo menos um grupo.');
                return;
            }
            
            // Salvar grupos selecionados
            sessionStorage.setItem('selectedGroups', JSON.stringify(selectedGroups));
            
            // Redirecionar para o quiz
            window.location.href = `quiz.html?type=${quizType}`;
        });
    }
    
    // Botão de voltar
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Limpar dados temporários
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('quizType');
            sessionStorage.removeItem('selectedGroups');
            
            window.location.href = 'index.html';
        });
    }
    
    // Inicializar UI
    updateUI();
});

