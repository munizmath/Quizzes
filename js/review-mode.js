/**
 * Modo de Revisão de Questões
 * Permite revisar apenas questões que foram respondidas incorretamente
 */

const ReviewMode = {
    // Inicializar modo de revisão
    init(reviewQuestions) {
        if (!reviewQuestions || reviewQuestions.length === 0) {
            return {
                success: false,
                message: 'Nenhuma questão para revisar. Continue estudando!'
            };
        }
        
        // Preparar questões para revisão
        const formattedQuestions = reviewQuestions.map(q => ({
            id: q.questionId || q.id,
            question: q.question,
            options: q.options || {},
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            userAnswer: q.userAnswer,
            isCorrect: q.isCorrect,
            attempts: q.attempts || 1,
            lastAttemptDate: q.attemptDate || q.date
        }));
        
        return {
            success: true,
            questions: formattedQuestions,
            totalQuestions: formattedQuestions.length
        };
    },
    
    // Construir UI de revisão
    buildReviewUI(reviewData) {
        const { questions, totalQuestions } = reviewData;
        
        let html = `
            <div class="review-header">
                <h2>Modo de Revisão</h2>
                <p>Revisando ${totalQuestions} questão(ões) que você errou anteriormente</p>
            </div>
        `;
        
        questions.forEach((q, index) => {
            html += `
                <div class="review-question" data-question-id="${q.id}">
                    <div class="review-question-header">
                        <span class="question-number">${index + 1} de ${totalQuestions}</span>
                        <span class="question-status ${q.isCorrect ? 'correct' : 'incorrect'}">
                            ${q.isCorrect ? '✓ Correta' : '✗ Errada'}
                        </span>
                        <span class="attempts-info">Tentativas: ${q.attempts}</span>
                    </div>
                    <h3>${this.escapeHtml(q.question)}</h3>
                    <div class="review-options">
                        ${this.buildOptions(q.options, q.correctAnswer, q.userAnswer)}
                    </div>
                    ${q.explanation ? `
                        <div class="review-explanation">
                            <strong>Explicação:</strong>
                            <p>${this.escapeHtml(q.explanation)}</p>
                        </div>
                    ` : ''}
                    <div class="review-answer-info">
                        <p><strong>Sua resposta:</strong> ${q.userAnswer || 'Não respondida'}</p>
                        <p><strong>Resposta correta:</strong> ${Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}</p>
                    </div>
                </div>
            `;
        });
        
        return html;
    },
    
    // Construir opções
    buildOptions(options, correctAnswer, userAnswer) {
        let html = '';
        const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : (userAnswer ? [userAnswer] : []);
        
        Object.keys(options).forEach(key => {
            const isCorrect = correctAnswers.includes(key);
            const isUserAnswer = userAnswers.includes(key);
            let className = 'review-option';
            
            if (isCorrect && isUserAnswer) {
                className += ' correct-selected';
            } else if (isCorrect && !isUserAnswer) {
                className += ' correct-not-selected';
            } else if (!isCorrect && isUserAnswer) {
                className += ' incorrect-selected';
            }
            
            html += `
                <div class="${className}">
                    <strong>${key}:</strong> ${this.escapeHtml(options[key])}
                    ${isCorrect ? '<span class="correct-badge">✓ Correta</span>' : ''}
                    ${isUserAnswer && !isCorrect ? '<span class="incorrect-badge">✗ Sua resposta</span>' : ''}
                </div>
            `;
        });
        
        return html;
    },
    
    // Escapar HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

