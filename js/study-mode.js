/**
 * QUIZ TECH - Modo Estudo/Prática
 */
const StudyMode = {
    enabled: false,
    
    init() {
        this.loadSettings();
        this.createToggle();
    },

    loadSettings() {
        const saved = sessionStorage.getItem('study-mode');
        this.enabled = saved === 'true';
    },

    toggle() {
        this.enabled = !this.enabled;
        sessionStorage.setItem('study-mode', this.enabled.toString());
        this.updateUI();
        
        if (typeof QuizApp !== 'undefined' && QuizApp.quizStarted) {
            QuizApp.updateStudyMode();
        }
    },

    createToggle() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const existingToggle = document.getElementById('study-mode-toggle');
        if (existingToggle) return;

        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'study-mode-container';
        toggleContainer.innerHTML = `
            <label class="study-mode-label">
                <input type="checkbox" id="study-mode-toggle" ${this.enabled ? 'checked' : ''}>
                <span>Modo Estudo</span>
            </label>
            <small class="study-mode-help">Sem timer e sem limite de tentativas</small>
        `;

        const timerSection = sidebar.querySelector('section[aria-labelledby="timer-label"]');
        if (timerSection) {
            sidebar.insertBefore(toggleContainer, timerSection.nextSibling);
        } else {
            sidebar.insertBefore(toggleContainer, sidebar.firstChild);
        }

        const toggle = document.getElementById('study-mode-toggle');
        if (toggle) {
            toggle.addEventListener('change', () => this.toggle());
        }

        this.updateUI();
    },

    updateUI() {
        const toggle = document.getElementById('study-mode-toggle');
        if (toggle) {
            toggle.checked = this.enabled;
        }

        if (this.enabled && typeof QuizApp !== 'undefined') {
            if (QuizApp.timerDisplay) {
                QuizApp.timerDisplay.style.opacity = '0.5';
            }
            if (QuizApp.pauseButton) {
                QuizApp.pauseButton.disabled = true;
            }
        } else {
            if (QuizApp && QuizApp.timerDisplay) {
                QuizApp.timerDisplay.style.opacity = '1';
            }
            if (QuizApp && QuizApp.pauseButton) {
                QuizApp.pauseButton.disabled = false;
            }
        }
    },

    isEnabled() {
        return this.enabled;
    }
};

// Estilos para o modo estudo
const studyModeStyles = `
.study-mode-container{
  background:rgba(59,130,246,.1);
  border:1px solid var(--primary);
  border-radius:8px;
  padding:12px;
  margin:12px 0;
}

.study-mode-label{
  display:flex;
  align-items:center;
  gap:8px;
  cursor:pointer;
  color:var(--text);
  font-weight:600;
  font-size:14px;
}

.study-mode-label input[type="checkbox"]{
  width:18px;
  height:18px;
  cursor:pointer;
  accent-color:var(--primary);
}

.study-mode-help{
  display:block;
  color:var(--muted);
  font-size:11px;
  margin-top:4px;
}
`;

if (!document.getElementById('study-mode-styles')) {
    const style = document.createElement('style');
    style.id = 'study-mode-styles';
    style.textContent = studyModeStyles;
    document.head.appendChild(style);
}

