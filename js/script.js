/**
 * QUIZ TECH - Script Principal
 * Sistema de quiz interativo com suporte para múltiplos tipos de questões
 */

// Estado global da aplicação
const QuizApp = {
    quizContainer: null,
    correctCounter: null,
    incorrectCounter: null,
    statusMessage: null,
    restartButton: null,
    timerDisplay: null,
    pauseButton: null,
    resumeButton: null,
    submitButton: null,
    finishButton: null,
    homeButton: null,
    
    // Dados do quiz
    correctCount: 0,
    incorrectCount: 0,
    allQuestions: [],
    currentQuestions: [],
    passingPercentage: 80,
    selectedParts: [],
    remainingTime: 0,
    timerInterval: null,
    isPaused: false,
    quizStarted: false,
    quizType: null, // 'aws' ou 'cobit'
    
    // Inicialização
    init() {
        this.quizContainer = document.getElementById('quiz-container');
        this.correctCounter = document.getElementById('correct-counter');
        this.incorrectCounter = document.getElementById('incorrect-counter');
        this.statusMessage = document.getElementById('status-message');
        this.restartButton = document.getElementById('restart-button');
        this.timerDisplay = document.getElementById('timer');
        this.pauseButton = document.getElementById('pause-button');
        this.resumeButton = document.getElementById('resume-button');
        this.submitButton = document.getElementById('submit-button');
        this.finishButton = document.getElementById('finish-button');
        this.homeButton = document.getElementById('home-button');
        this.changeGroupsButton = document.getElementById('change-groups-button');
        
        // Obter dados do usuário do sessionStorage
        this.userName = sessionStorage.getItem('userName') || '';
        this.userEmail = sessionStorage.getItem('userEmail') || '';
        this.quizType = sessionStorage.getItem('quizType') || 'aws';
        const selectedGroupsStr = sessionStorage.getItem('selectedGroups');
        this.selectedParts = selectedGroupsStr ? JSON.parse(selectedGroupsStr) : [];
        
        // Exibir informações do usuário
        this.displayUserInfo();
        
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.loadQuizData();
    },
    
    // Exibir informações do usuário
    displayUserInfo() {
        const quizUserName = document.getElementById('quiz-user-name');
        const quizTypeDisplay = document.getElementById('quiz-type-display');
        const quizGroupsDisplay = document.getElementById('quiz-groups-display');
        
        if (quizUserName) quizUserName.textContent = this.userName;
        
        if (quizTypeDisplay) {
            quizTypeDisplay.textContent = this.quizType === 'aws' 
                ? 'Quiz AWS'
                : 'Quiz COBIT';
        }
        
        if (quizGroupsDisplay) {
            if (this.selectedParts.length > 0) {
                quizGroupsDisplay.textContent = this.selectedParts.sort((a, b) => a - b).join(', ');
            } else {
                quizGroupsDisplay.textContent = 'Nenhum grupo selecionado';
            }
        }
    },
    
    // Configurar event listeners
    setupEventListeners() {
        if (this.pauseButton) {
            this.pauseButton.addEventListener('click', () => this.pauseResumeTimer());
        }
        
        if (this.resumeButton) {
            this.resumeButton.addEventListener('click', () => this.pauseResumeTimer());
        }
        
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => this.resetParts());
        }
        
        if (this.submitButton) {
            this.submitButton.addEventListener('click', () => this.submitAnswers());
        }
        
        if (this.finishButton) {
            this.finishButton.addEventListener('click', () => this.finishQuiz());
        }
        
        if (this.homeButton) {
            this.homeButton.addEventListener('click', () => {
                sessionStorage.clear();
                window.location.href = 'index.html';
            });
        }
        
        if (this.changeGroupsButton) {
            this.changeGroupsButton.addEventListener('click', () => {
                window.location.href = 'select-groups.html';
            });
        }
        
        const historyButton = document.getElementById('history-button');
        if (historyButton) {
            historyButton.addEventListener('click', () => {
                window.location.href = 'history.html';
            });
        }
        
        // Expor funções globais para compatibilidade
        window.selectPart = (partNumber) => this.selectPart(partNumber);
        window.resetParts = () => this.resetParts();
    },
    
    // Configurar navegação por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Fechar modal com ESC
            if (e.key === 'Escape') {
                const modal = document.getElementById('custom-modal');
                if (modal && modal.style.display === 'block') {
                    const closeBtn = modal.querySelector('.close, .modal-button');
                    if (closeBtn) closeBtn.click();
                }
            }
            
            // Pausar/Retomar com barra de espaço quando focado no botão
            if (e.key === ' ' && (e.target === this.pauseButton || e.target === this.resumeButton)) {
                e.preventDefault();
                this.pauseResumeTimer();
            }
        });
        
        // Melhorar navegação por teclado em modais
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('custom-modal');
            if (modal && modal.style.display === 'block') {
                if (e.key === 'Tab') {
                    const focusableElements = modal.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    },
    
    // Notificar leitores de tela
    announceToScreenReader(message) {
        const statusRegion = document.getElementById('status-region');
        if (statusRegion) {
            statusRegion.textContent = message;
            // Limpar após 1 segundo para permitir nova notificação
            setTimeout(() => {
                statusRegion.textContent = '';
            }, 1000);
        }
    },
    
    // Carregar dados do quiz
    async loadQuizData() {
        try {
            const fileName = this.quizType === 'cobit' 
                ? 'data/Questions_COBIT.json' 
                : 'data/Questions_AWS.json';
            
            this.showLoading();
            
            const response = await fetch(fileName);
            if (!response.ok) {
                throw new Error(`Erro ao carregar questões: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.allQuestions = data.questions || [];
            
            this.hideLoading();
            
            // Carregar questões dos grupos selecionados automaticamente
            if (this.selectedParts.length > 0) {
                this.updateQuiz();
            } else {
                this.updateStatusMessage();
            }
        } catch (error) {
            console.error('Erro ao carregar dados do quiz:', error);
            this.showModal('Erro', `Não foi possível carregar as questões: ${error.message}`);
            this.hideLoading();
        }
    },
    
    // Mostrar loading
    showLoading() {
        if (this.quizContainer) {
            this.quizContainer.innerHTML = '<div class="loading">Carregando questões</div>';
        }
    },
    
    // Ocultar loading
    hideLoading() {
        // Removido pelo buildQuiz
    },
    
    // Embaralhar array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Construir quiz
    buildQuiz(questions) {
        if (!questions || questions.length === 0) {
            if (this.quizContainer) {
                this.quizContainer.innerHTML = '<p>Selecione grupos para começar o quiz.</p>';
            }
            return;
        }
        
        // Reset contadores
        this.correctCount = 0;
        this.incorrectCount = 0;
        if (this.correctCounter) this.correctCounter.textContent = '0';
        if (this.incorrectCounter) this.incorrectCounter.textContent = '0';
        
        const shuffledQuestions = this.shuffleArray(questions);
        
        const output = shuffledQuestions.map((currentQuestion, questionNumber) => {
            const inputType = Array.isArray(currentQuestion.correctAnswer) ? "checkbox" : "radio";
            const shuffledOptions = this.shuffleArray(Object.keys(currentQuestion.options));
            
            const answers = shuffledOptions.map((letter, idx) => `
                <label class="answer" for="question-${questionNumber}-option-${letter}">
                    <input 
                        type="${inputType}" 
                        name="question${questionNumber}" 
                        id="question-${questionNumber}-option-${letter}"
                        value="${letter}"
                        aria-label="${this.escapeHtml(currentQuestion.options[letter])}">
                    ${this.escapeHtml(currentQuestion.options[letter])}
                </label>
            `).join('');
            
            const explanation = currentQuestion.explanation 
                ? `<p class="explanation" style="display: none;" role="note" aria-label="Explicação da resposta">${this.escapeHtml(currentQuestion.explanation)}</p>` 
                : '';
            
            return `
                <div class="question" role="article" aria-labelledby="question-${questionNumber}">
                    <h3 id="question-${questionNumber}">${questionNumber + 1}. ${this.escapeHtml(currentQuestion.question)}</h3>
                    <fieldset role="group" aria-labelledby="question-${questionNumber}">
                        <legend class="sr-only">Opções de resposta para questão ${questionNumber + 1}</legend>
                        <div class="answers" role="radiogroup">${answers}</div>
                    </fieldset>
                    ${explanation}
                </div>
            `;
        }).join('');
        
        if (this.quizContainer) {
            this.quizContainer.innerHTML = output;
        }
        
        this.quizStarted = true;
        
        // Adicionar event listeners às questões
        this.attachQuestionListeners(shuffledQuestions);
    },
    
    // Escapar HTML para prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Anexar listeners às questões
    attachQuestionListeners(questions) {
        questions.forEach((currentQuestion, questionNumber) => {
            const answerContainer = this.quizContainer.querySelector(
                `.question:nth-child(${questionNumber + 1}) .answers`
            );
            const explanationElement = this.quizContainer.querySelector(
                `.question:nth-child(${questionNumber + 1}) .explanation`
            );
            
            if (!answerContainer) return;
            
            const maxAttempts = Array.isArray(currentQuestion.correctAnswer) ? 2 : 1;
            let attempts = 0;
            let selectedAnswers = new Set();
            let answeredCorrectly = false;
            
            const inputs = answerContainer.querySelectorAll(
                `input[type="${Array.isArray(currentQuestion.correctAnswer) ? "checkbox" : "radio"}"]`
            );
            
            inputs.forEach(input => {
                input.addEventListener('change', (event) => {
                    if (answeredCorrectly || attempts >= maxAttempts) return;
                    
                    const selectedOption = event.target.value;
                    const selectedLabel = event.target.parentElement;
                    
                    if (Array.isArray(currentQuestion.correctAnswer)) {
                        // Múltipla escolha
                        if (event.target.checked) {
                            selectedAnswers.add(selectedOption);
                        } else {
                            selectedAnswers.delete(selectedOption);
                        }
                        
                        if (selectedAnswers.size === 2) {
                            attempts++;
                            const selectedArray = Array.from(selectedAnswers);
                            const isCorrect = selectedArray.every(ans => 
                                currentQuestion.correctAnswer.includes(ans)
                            );
                            
                            if (isCorrect) {
                                this.correctCount++;
                                this.correctCounter.textContent = this.correctCount;
                                this.correctCounter.setAttribute('aria-label', `${this.correctCount} questões corretas`);
                                selectedArray.forEach(ans => {
                                    const label = answerContainer.querySelector(
                                        `input[value="${ans}"]`
                                    ).parentElement;
                                    label.classList.add('correct');
                                    label.setAttribute('aria-label', `${label.textContent.trim()} - Resposta correta`);
                                });
                                answeredCorrectly = true;
                                if (explanationElement) {
                                    explanationElement.style.display = 'block';
                                    explanationElement.setAttribute('aria-live', 'polite');
                                }
                                this.announceToScreenReader(`Questão ${questionNumber + 1} respondida corretamente`);
                            } else {
                                this.incorrectCount++;
                                this.incorrectCounter.textContent = this.incorrectCount;
                                this.incorrectCounter.setAttribute('aria-label', `${this.incorrectCount} questões erradas`);
                                selectedArray.forEach(ans => {
                                    const label = answerContainer.querySelector(
                                        `input[value="${ans}"]`
                                    ).parentElement;
                                    label.classList.add('incorrect');
                                    label.setAttribute('aria-label', `${label.textContent.trim()} - Resposta incorreta`);
                                });
                                inputs.forEach(input => input.disabled = true);
                                if (explanationElement) {
                                    explanationElement.style.display = 'block';
                                    explanationElement.setAttribute('aria-live', 'polite');
                                }
                                
                                // Mostrar resposta correta
                                currentQuestion.correctAnswer.forEach(correctOption => {
                                    const correctLabel = answerContainer.querySelector(
                                        `input[value="${correctOption}"]`
                                    )?.parentElement;
                                    if (correctLabel) {
                                        correctLabel.classList.add('correct');
                                        correctLabel.setAttribute('aria-label', `${correctLabel.textContent.trim()} - Resposta correta`);
                                    }
                                });
                                this.announceToScreenReader(`Questão ${questionNumber + 1} respondida incorretamente. A resposta correta foi marcada.`);
                            }
                        }
                    } else {
                        // Escolha única
                        attempts++;
                        if (selectedOption === currentQuestion.correctAnswer) {
                            this.correctCount++;
                            this.correctCounter.textContent = this.correctCount;
                            this.correctCounter.setAttribute('aria-label', `${this.correctCount} questões corretas`);
                            selectedLabel.classList.add('correct');
                            selectedLabel.setAttribute('aria-label', `${selectedLabel.textContent.trim()} - Resposta correta`);
                            answeredCorrectly = true;
                            inputs.forEach(input => input.disabled = true);
                            if (explanationElement) {
                                explanationElement.style.display = 'block';
                                explanationElement.setAttribute('aria-live', 'polite');
                            }
                            this.announceToScreenReader(`Questão ${questionNumber + 1} respondida corretamente`);
                        } else {
                            selectedLabel.classList.add('incorrect');
                            selectedLabel.setAttribute('aria-label', `${selectedLabel.textContent.trim()} - Resposta incorreta`);
                            this.incorrectCount++;
                            this.incorrectCounter.textContent = this.incorrectCount;
                            this.incorrectCounter.setAttribute('aria-label', `${this.incorrectCount} questões erradas`);
                            inputs.forEach(input => input.disabled = true);
                            if (explanationElement) {
                                explanationElement.style.display = 'block';
                                explanationElement.setAttribute('aria-live', 'polite');
                            }
                            
                            // Mostrar resposta correta
                            const correctLabel = answerContainer.querySelector(
                                `input[value="${currentQuestion.correctAnswer}"]`
                            )?.parentElement;
                            if (correctLabel) {
                                correctLabel.classList.add('correct');
                                correctLabel.setAttribute('aria-label', `${correctLabel.textContent.trim()} - Resposta correta`);
                            }
                            this.announceToScreenReader(`Questão ${questionNumber + 1} respondida incorretamente. A resposta correta foi marcada.`);
                        }
                    }
                    
                    this.updateStatusMessage();
                });
            });
        });
    },
    
    // Atualizar mensagem de status
    updateStatusMessage() {
        if (!this.quizStarted || !this.statusMessage) return;
        
        const totalQuestions = this.currentQuestions.length;
        if (totalQuestions === 0) {
            this.statusMessage.textContent = 'Selecione os grupos para começar o quiz.';
            return;
        }
        
        const requiredCorrectAnswers = Math.ceil((this.passingPercentage / 100) * totalQuestions);
        const remainingCorrectAnswers = requiredCorrectAnswers - this.correctCount;
        
        if (remainingCorrectAnswers > 0) {
            if (this.correctCount + this.incorrectCount === totalQuestions) {
                this.statusMessage.textContent = 'Você já respondeu todas as perguntas. Por favor, reinicie o quiz.';
            } else {
                this.statusMessage.textContent = `Acerte ${remainingCorrectAnswers} questões e atinja ${this.passingPercentage}% de acerto.`;
            }
        } else {
            this.statusMessage.textContent = `Parabéns! Você atingiu ${this.passingPercentage}% de acerto.`;
        }
    },
    
    // Selecionar parte/grupo (não usado mais - grupos são selecionados na página anterior)
    selectPart(partNumber) {
        // Função mantida para compatibilidade, mas grupos já vêm selecionados
        this.showModal('Informação', 'Para alterar os grupos, clique em "Alterar Grupos" e selecione novamente.');
    },
    
    // Atualizar timer
    updateTimer() {
        if (this.isPaused) return;
        
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        
        if (this.timerDisplay) {
            this.timerDisplay.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (this.remainingTime <= 0) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.showModal('Tempo Esgotado', 'O tempo acabou! O quiz será finalizado.');
            this.finishQuiz();
        } else {
            this.remainingTime--;
        }
    },
    
    // Pausar/Retomar timer
    pauseResumeTimer() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            if (this.pauseButton) {
                this.pauseButton.style.display = 'none';
                this.pauseButton.setAttribute('aria-pressed', 'true');
            }
            if (this.resumeButton) {
                this.resumeButton.style.display = 'block';
                this.resumeButton.setAttribute('aria-pressed', 'false');
                this.resumeButton.focus(); // Focar no botão de retomar
            }
            this.announceToScreenReader('Timer pausado');
        } else {
            if (this.pauseButton) {
                this.pauseButton.style.display = 'block';
                this.pauseButton.setAttribute('aria-pressed', 'false');
                this.pauseButton.focus(); // Focar no botão de pausar
            }
            if (this.resumeButton) {
                this.resumeButton.style.display = 'none';
                this.resumeButton.setAttribute('aria-pressed', 'true');
            }
            this.announceToScreenReader('Timer retomado');
        }
    },
    
    // Atualizar quiz
    updateQuiz() {
        if (this.selectedParts.length === 0) {
            this.currentQuestions = [];
            this.buildQuiz([]);
            this.updateStatusMessage();
            return;
        }
        
        this.currentQuestions = this.selectedParts.flatMap(partNumber => {
            const start = (partNumber - 1) * 25;
            return this.allQuestions.slice(start, start + 25);
        });
        
        this.buildQuiz(this.currentQuestions);
        this.updateStatusMessage();
        
        // Iniciar timer se ainda não estiver rodando
        if (!this.timerInterval && this.selectedParts.length > 0) {
            this.remainingTime = 30 * 60;
            this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        }
    },
    
    // Reiniciar partes
    resetParts() {
        this.selectedParts = [];
        this.currentQuestions = [];
        this.correctCount = 0;
        this.incorrectCount = 0;
        
        if (this.correctCounter) this.correctCounter.textContent = '0';
        if (this.incorrectCounter) this.incorrectCounter.textContent = '0';
        
        this.passingPercentage = 80;
        this.remainingTime = 0;
        
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        
        if (this.timerDisplay) this.timerDisplay.textContent = '00:00';
        this.quizStarted = false;
        this.isPaused = false;
        
        if (this.pauseButton) this.pauseButton.style.display = 'block';
        if (this.resumeButton) this.resumeButton.style.display = 'none';
        
        // Remover seleção dos botões
        document.querySelectorAll('.group-button').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        this.buildQuiz([]);
        this.updateStatusMessage();
    },
    
    // Enviar respostas
    async submitAnswers() {
        if (this.currentQuestions.length === 0) {
            this.showModal('Atenção', 'Selecione grupos para começar o quiz.');
            return;
        }
        
        const totalQuestions = this.currentQuestions.length;
        const percentage = Math.round((this.correctCount / totalQuestions) * 100);
        
        // Coletar dados das questões respondidas
        const questionsData = this.collectQuestionsData();
        
        // Salvar no histórico
        if (typeof HistoryManager !== 'undefined') {
            const timeSpent = (30 * 60) - this.remainingTime;
            await HistoryManager.saveAttempt({
                userId: this.userEmail,
                userName: this.userName,
                userEmail: this.userEmail,
                quizType: this.quizType,
                selectedGroups: this.selectedParts,
                correctCount: this.correctCount,
                incorrectCount: this.incorrectCount,
                totalQuestions: totalQuestions,
                percentage: percentage,
                timeSpent: timeSpent,
                questions: questionsData
            });
        }
        
        let message = `Resultado: ${this.correctCount} certas e ${this.incorrectCount} erradas.\n`;
        message += `Percentual: ${percentage}%`;
        
        if (percentage >= this.passingPercentage) {
            this.showModal('Parabéns!', `Você atingiu ${percentage}% de acerto! ${message}`, () => {
                // Mostrar botões de exportação e histórico
                this.showResultActions();
            });
        } else {
            this.showModal('Continue Estudando', `Você precisa de ${this.passingPercentage}% para passar. ${message}`, () => {
                this.showResultActions();
            });
        }
    },
    
    // Coletar dados das questões respondidas
    collectQuestionsData() {
        const questionsData = [];
        
        this.currentQuestions.forEach((q, index) => {
            const questionElement = this.quizContainer.querySelector(`.question:nth-child(${index + 1})`);
            if (!questionElement) return;
            
            const inputs = questionElement.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
            const userAnswers = Array.from(inputs).map(input => input.value);
            const correctAnswer = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
            const isCorrect = correctAnswer.every(ans => userAnswers.includes(ans)) && 
                            userAnswers.length === correctAnswer.length;
            
            questionsData.push({
                questionId: q.id || index,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                userAnswer: userAnswers.length > 0 ? (userAnswers.length === 1 ? userAnswers[0] : userAnswers) : null,
                isCorrect: isCorrect,
                explanation: q.explanation || ''
            });
        });
        
        return questionsData;
    },
    
    // Mostrar ações após resultado
    showResultActions() {
        const actionButtons = `
            <div id="result-actions" style="margin-top: 20px;">
                <button id="view-history-button" class="quiz-option secondary">
                    Ver Histórico
                </button>
                <button id="export-pdf-button" class="quiz-option secondary">
                    Exportar para PDF
                </button>
                <button id="view-stats-button" class="quiz-option secondary">
                    Ver Estatísticas
                </button>
            </div>
        `;
        
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !document.getElementById('result-actions')) {
            sidebar.insertAdjacentHTML('beforeend', actionButtons);
            
            document.getElementById('view-history-button')?.addEventListener('click', () => {
                window.location.href = 'history.html';
            });
            
            document.getElementById('export-pdf-button')?.addEventListener('click', async () => {
                const questionsData = this.collectQuestionsData();
                const totalQuestions = this.currentQuestions.length;
                const percentage = Math.round((this.correctCount / totalQuestions) * 100);
                
                if (typeof PDFExporter !== 'undefined') {
                    await PDFExporter.generatePDF({
                        userName: this.userName,
                        userEmail: this.userEmail,
                        quizType: this.quizType,
                        correctCount: this.correctCount,
                        incorrectCount: this.incorrectCount,
                        totalQuestions: totalQuestions,
                        percentage: percentage,
                        date: new Date().toISOString(),
                        questions: questionsData
                    });
                }
            });
            
            document.getElementById('view-stats-button')?.addEventListener('click', () => {
                window.location.href = 'history.html#stats';
            });
        }
    },
    
    // Finalizar quiz
    finishQuiz() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.submitAnswers();
    },
    
    // Mostrar modal
    showModal(title, message, onConfirm = null) {
        // Remover modal existente
        const existingModal = document.getElementById('custom-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'custom-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${this.escapeHtml(title)}</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <p>${this.escapeHtml(message)}</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-button modal-button-primary">OK</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        const closeBtn = modal.querySelector('.close');
        const okBtn = modal.querySelector('.modal-button');
        const closeModal = () => {
            modal.style.display = 'none';
            modal.remove();
            if (onConfirm) onConfirm();
        };
        
        closeBtn.addEventListener('click', closeModal);
        okBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    QuizApp.init();
});

