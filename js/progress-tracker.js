/**
 * QUIZ TECH - Rastreador de Progresso
 */
const ProgressTracker = {
    init() {
        this.createProgressBar();
    },

    createProgressBar() {
        const existingBar = document.getElementById('quiz-progress-bar');
        if (existingBar) return;

        const progressContainer = document.createElement('div');
        progressContainer.id = 'quiz-progress-container';
        progressContainer.innerHTML = `
            <div id="quiz-progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso do quiz">
                <div id="quiz-progress-fill"></div>
            </div>
            <div id="quiz-progress-text">0%</div>
        `;

        const quizBox = document.getElementById('quiz-box');
        if (quizBox) {
            quizBox.insertBefore(progressContainer, quizBox.firstChild);
        }
    },

    updateProgress(current, total) {
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        const progressBar = document.getElementById('quiz-progress-bar');
        const progressFill = document.getElementById('quiz-progress-fill');
        const progressText = document.getElementById('quiz-progress-text');

        if (progressBar) {
            progressBar.setAttribute('aria-valuenow', percentage);
            progressBar.setAttribute('aria-valuetext', `${current} de ${total} questões respondidas`);
        }

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
    },

    reset() {
        this.updateProgress(0, 0);
    }
};

// Estilos para a barra de progresso
const progressBarStyles = `
#quiz-progress-container{
  position:sticky;
  top:0;
  z-index:50;
  background:linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.05));
  border-bottom:1px solid var(--border);
  padding:12px 20px;
  margin:-20px -20px 20px -20px;
  backdrop-filter:blur(10px);
}

#quiz-progress-bar{
  width:100%;
  height:8px;
  background:rgba(0,0,0,.2);
  border-radius:999px;
  overflow:hidden;
  position:relative;
}

#quiz-progress-fill{
  height:100%;
  background:linear-gradient(90deg, var(--primary), var(--success));
  border-radius:999px;
  transition:width .3s ease;
  width:0%;
}

#quiz-progress-text{
  text-align:center;
  font-size:12px;
  font-weight:600;
  color:var(--muted);
  margin-top:8px;
}

@media (max-width: 768px){
  #quiz-progress-container{
    padding:10px 12px;
    margin:-12px -12px 12px -12px;
  }
}
`;

if (!document.getElementById('progress-bar-styles')) {
    const style = document.createElement('style');
    style.id = 'progress-bar-styles';
    style.textContent = progressBarStyles;
    document.head.appendChild(style);
}

