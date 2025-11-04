/**
 * QUIZ TECH - Gerenciador de Tamanho de Fonte
 */
const FontSizeManager = {
    init() {
        this.loadSettings();
        this.createControls();
        this.applyFontSize();
    },

    loadSettings() {
        const saved = localStorage.getItem('quiz-font-size') || 'medium';
        this.currentSize = saved;
    },

    createControls() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const existing = document.getElementById('font-size-controls');
        if (existing) return;

        const controls = document.createElement('div');
        controls.id = 'font-size-controls';
        controls.className = 'font-size-controls';
        controls.innerHTML = `
            <h2>Tamanho da Fonte</h2>
            <div class="font-size-buttons">
                <button class="font-size-btn" data-size="small">A</button>
                <button class="font-size-btn active" data-size="medium">A</button>
                <button class="font-size-btn" data-size="large">A</button>
                <button class="font-size-btn" data-size="xlarge">A</button>
            </div>
        `;

        const soundToggle = document.querySelector('.sound-toggle-container');
        if (soundToggle) {
            sidebar.insertBefore(controls, soundToggle.nextSibling);
        } else {
            const studyMode = document.querySelector('.study-mode-container');
            if (studyMode) {
                sidebar.insertBefore(controls, studyMode.nextSibling);
            }
        }

        controls.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const size = btn.getAttribute('data-size');
                this.setFontSize(size);
            });
        });

        this.updateActiveButton();
    },

    setFontSize(size) {
        this.currentSize = size;
        localStorage.setItem('quiz-font-size', size);
        this.applyFontSize();
        this.updateActiveButton();
    },

    applyFontSize() {
        const sizes = {
            small: '12px',
            medium: '14px',
            large: '16px',
            xlarge: '18px'
        };

        document.documentElement.style.setProperty('--quiz-font-size', sizes[this.currentSize] || sizes.medium);
        
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            quizContainer.style.fontSize = sizes[this.currentSize] || sizes.medium;
        }
    },

    updateActiveButton() {
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-size') === this.currentSize);
        });
    }
};

// Estilos para controles de fonte
const fontSizeStyles = `
.font-size-controls{
  background:rgba(8,12,24,.4);
  border:1px solid var(--border);
  border-radius:8px;
  padding:12px;
  margin:12px 0;
}

.font-size-controls h2{
  font-size:12px;
  font-weight:600;
  color:var(--muted);
  margin:0 0 12px;
  text-transform:uppercase;
}

.font-size-buttons{
  display:flex;
  gap:8px;
}

.font-size-btn{
  flex:1;
  padding:8px;
  border-radius:6px;
  border:1px solid var(--border);
  background:rgba(0,0,0,.3);
  color:var(--text);
  font-weight:700;
  cursor:pointer;
  transition:all .2s ease;
  font-size:14px;
}

.font-size-btn:hover{
  border-color:var(--primary);
  background:rgba(59,130,246,.1);
}

.font-size-btn.active{
  border-color:var(--primary);
  background:var(--primary);
  color:white;
}

.font-size-btn[data-size="small"]{font-size:12px}
.font-size-btn[data-size="medium"]{font-size:14px}
.font-size-btn[data-size="large"]{font-size:16px}
.font-size-btn[data-size="xlarge"]{font-size:18px}
`;

if (!document.getElementById('font-size-styles')) {
    const style = document.createElement('style');
    style.id = 'font-size-styles';
    style.textContent = fontSizeStyles;
    document.head.appendChild(style);
}

