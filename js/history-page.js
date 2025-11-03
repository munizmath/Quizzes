/**
 * Página de Histórico
 * Gerencia exibição do histórico e estatísticas
 */

document.addEventListener('DOMContentLoaded', async () => {
    const userName = sessionStorage.getItem('userName') || 'Usuário';
    const userEmail = sessionStorage.getItem('userEmail');
    const userId = userEmail || 'guest';
    
    // Exibir nome do usuário
    const userNameSpan = document.getElementById('history-user-name');
    if (userNameSpan) userNameSpan.textContent = userName;
    
    // Carregar estatísticas
    const stats = await HistoryManager.getUserStats(userId);
    displayStats(stats);
    
    // Carregar histórico
    const history = await HistoryManager.getUserHistory(userId);
    displayHistory(history);
    
    // Botões
    const reviewButton = document.getElementById('start-review-button');
    const exportButton = document.getElementById('export-stats-button');
    const backButton = document.getElementById('back-button');
    
    if (reviewButton) {
        reviewButton.addEventListener('click', async () => {
            const reviewQuestions = await HistoryManager.getReviewQuestions(userId);
            if (reviewQuestions.length === 0) {
                alert('Nenhuma questão para revisar. Continue estudando!');
                return;
            }
            
            sessionStorage.setItem('reviewQuestions', JSON.stringify(reviewQuestions));
            window.location.href = 'review.html';
        });
    }
    
    if (exportButton) {
        exportButton.addEventListener('click', async () => {
            const history = await HistoryManager.getUserHistory(userId);
            if (history.length === 0) {
                alert('Nenhum histórico para exportar.');
                return;
            }
            
            const latest = history[0];
            await PDFExporter.generatePDF({
                userName,
                userEmail,
                quizType: latest.quizType,
                correctCount: latest.correctCount,
                incorrectCount: latest.incorrectCount,
                totalQuestions: latest.totalQuestions,
                percentage: latest.percentage,
                date: latest.date,
                questions: latest.questions
            });
        });
    }
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

function displayStats(stats) {
    const statsContent = document.getElementById('stats-content');
    if (!statsContent) return;
    
    if (stats.totalAttempts === 0) {
        statsContent.innerHTML = '<p>Nenhuma tentativa registrada ainda.</p>';
        return;
    }
    
    statsContent.innerHTML = `
        <div class="stat-card-large">
            <h3>Total de Tentativas</h3>
            <p class="stat-number">${stats.totalAttempts}</p>
        </div>
        <div class="stat-card-large">
            <h3>Média de Acertos</h3>
            <p class="stat-number">${stats.averageScore}%</p>
        </div>
        <div class="stat-card-large">
            <h3>Melhor Pontuação</h3>
            <p class="stat-number">${stats.bestScore}%</p>
        </div>
        <div class="stat-card-large">
            <h3>Evolução</h3>
            <p class="stat-number ${stats.improvement >= 0 ? 'positive' : 'negative'}">
                ${stats.improvement >= 0 ? '+' : ''}${stats.improvement}%
            </p>
        </div>
    `;
    
    // Estatísticas por tópico
    if (Object.keys(stats.topicsStats).length > 0) {
        const topicsHTML = StatsManager.generateStatsHTML(stats.topicsStats);
        statsContent.innerHTML += topicsHTML;
    }
}

function displayHistory(history) {
    const historyItems = document.getElementById('history-items');
    if (!historyItems) return;
    
    if (history.length === 0) {
        historyItems.innerHTML = '<p>Nenhuma tentativa registrada.</p>';
        return;
    }
    
    historyItems.innerHTML = history.map(attempt => {
        const date = new Date(attempt.date).toLocaleDateString('pt-BR');
        const time = new Date(attempt.date).toLocaleTimeString('pt-BR');
        const status = attempt.percentage >= 80 ? 'Aprovado' : 'Reprovado';
        const statusClass = attempt.percentage >= 80 ? 'status-approved' : 'status-failed';
        
        return `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">${date} ${time}</span>
                    <span class="history-status ${statusClass}">${status}</span>
                </div>
                <div class="history-details">
                    <p><strong>Quiz:</strong> ${attempt.quizType === 'aws' ? 'AWS' : 'COBIT'}</p>
                    <p><strong>Grupos:</strong> ${Array.isArray(attempt.selectedGroups) ? attempt.selectedGroups.join(', ') : 'N/A'}</p>
                    <p><strong>Resultado:</strong> ${attempt.correctCount}/${attempt.totalQuestions} corretas (${attempt.percentage}%)</p>
                    <p><strong>Tempo:</strong> ${attempt.timeSpent ? formatTime(attempt.timeSpent) : 'N/A'}</p>
                </div>
            </div>
        `;
    }).join('');
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

