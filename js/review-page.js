/**
 * Página de Revisão
 * Gerencia exibição das questões para revisão
 */

document.addEventListener('DOMContentLoaded', () => {
    const reviewQuestionsStr = sessionStorage.getItem('reviewQuestions');
    if (!reviewQuestionsStr) {
        alert('Nenhuma questão para revisar.');
        window.location.href = 'history.html';
        return;
    }
    
    const reviewQuestions = JSON.parse(reviewQuestionsStr);
    const reviewData = ReviewMode.init(reviewQuestions);
    
    if (!reviewData.success) {
        alert(reviewData.message);
        window.location.href = 'history.html';
        return;
    }
    
    // Exibir questões
    const quizContainer = document.getElementById('quiz-container');
    const reviewInfo = document.getElementById('review-info');
    
    if (quizContainer) {
        quizContainer.innerHTML = ReviewMode.buildReviewUI(reviewData);
    }
    
    if (reviewInfo) {
        reviewInfo.textContent = `Revisando ${reviewData.totalQuestions} questão(ões)`;
    }
    
    // Botões
    const backButton = document.getElementById('back-review-button');
    const exportButton = document.getElementById('export-review-button');
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'history.html';
        });
    }
    
    if (exportButton) {
        exportButton.addEventListener('click', async () => {
            const userName = sessionStorage.getItem('userName') || 'Usuário';
            const userEmail = sessionStorage.getItem('userEmail') || '';
            
            await PDFExporter.generatePDF({
                userName,
                userEmail,
                quizType: 'review',
                correctCount: 0,
                incorrectCount: reviewData.totalQuestions,
                totalQuestions: reviewData.totalQuestions,
                percentage: 0,
                date: new Date().toISOString(),
                questions: reviewData.questions
            });
        });
    }
});

