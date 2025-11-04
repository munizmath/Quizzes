/**
 * QUIZ TECH - Gerenciador de Sons
 */
const SoundManager = {
    enabled: false,
    sounds: {
        correct: null,
        incorrect: null,
        click: null,
        complete: null
    },

    init() {
        this.loadSettings();
        this.createSounds();
        this.createToggle();
    },

    loadSettings() {
        const saved = localStorage.getItem('quiz-sounds-enabled');
        this.enabled = saved !== 'false'; // Por padrão, habilitado
    },

    createSounds() {
        // Usar Web Audio API para gerar sons simples
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.sounds.correct = () => this.playTone(audioContext, 800, 0.1, 'sine');
        this.sounds.incorrect = () => this.playTone(audioContext, 300, 0.1, 'sawtooth');
        this.sounds.click = () => this.playTone(audioContext, 600, 0.05, 'square');
        this.sounds.complete = () => {
            this.playTone(audioContext, 523, 0.1, 'sine'); // C
            setTimeout(() => this.playTone(audioContext, 659, 0.1, 'sine'), 100); // E
            setTimeout(() => this.playTone(audioContext, 784, 0.2, 'sine'), 200); // G
        };
    },

    playTone(audioContext, frequency, duration, type = 'sine') {
        if (!this.enabled) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    },

    play(soundName) {
        if (this.sounds[soundName] && this.enabled) {
            this.sounds[soundName]();
        }
    },

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('quiz-sounds-enabled', this.enabled.toString());
        this.updateToggle();
    },

    createToggle() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const existing = document.getElementById('sound-toggle');
        if (existing) return;

        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'sound-toggle-container';
        toggleContainer.innerHTML = `
            <label class="sound-toggle-label">
                <input type="checkbox" id="sound-toggle" ${this.enabled ? 'checked' : ''}>
                <span>Sons</span>
            </label>
        `;

        const studyModeContainer = document.querySelector('.study-mode-container');
        if (studyModeContainer) {
            sidebar.insertBefore(toggleContainer, studyModeContainer.nextSibling);
        } else {
            const timerSection = sidebar.querySelector('section[aria-labelledby="timer-label"]');
            if (timerSection) {
                sidebar.insertBefore(toggleContainer, timerSection.nextSibling);
            }
        }

        const toggle = document.getElementById('sound-toggle');
        if (toggle) {
            toggle.addEventListener('change', () => this.toggle());
        }

        this.updateToggle();
    },

    updateToggle() {
        const toggle = document.getElementById('sound-toggle');
        if (toggle) {
            toggle.checked = this.enabled;
        }
    }
};

// Estilos para toggle de sons
const soundToggleStyles = `
.sound-toggle-container{
  background:rgba(8,12,24,.4);
  border:1px solid var(--border);
  border-radius:8px;
  padding:12px;
  margin:12px 0;
}

.sound-toggle-label{
  display:flex;
  align-items:center;
  gap:8px;
  cursor:pointer;
  color:var(--text);
  font-weight:600;
  font-size:14px;
}

.sound-toggle-label input[type="checkbox"]{
  width:18px;
  height:18px;
  cursor:pointer;
  accent-color:var(--primary);
}
`;

if (!document.getElementById('sound-toggle-styles')) {
    const style = document.createElement('style');
    style.id = 'sound-toggle-styles';
    style.textContent = soundToggleStyles;
    document.head.appendChild(style);
}

