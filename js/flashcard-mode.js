/**
 * QUIZ TECH - Modo Flashcard
 */
const FlashcardMode = {
    enabled: false,
    currentCard: 0,
    cards: [],

    init() {
        this.createToggle();
    },

    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.enterFlashcardMode();
        } else {
            this.exitFlashcardMode();
        }
    },

    enterFlashcardMode() {
        const questions = document.querySelectorAll('.question');
        this.cards = Array.from(questions).map((q, index) => ({
            question: q.querySelector('h3')?.textContent || '',
            options: Array.from(q.querySelectorAll('.answer')).map(a => a.textContent.trim()),
            correctAnswer: q.dataset.correctAnswer || '',
            explanation: q.querySelector('.explanation')?.textContent || '',
            element: q
        }));

        questions.forEach(q => q.style.display = 'none');
        
        this.currentCard = 0;
        this.showCard(0);
    },

    exitFlashcardMode() {
        const flashcardContainer = document.getElementById('flashcard-container');
        if (flashcardContainer) {
            flashcardContainer.remove();
        }

        const questions = document.querySelectorAll('.question');
        questions.forEach(q => q.style.display = 'block');
    },

    showCard(index) {
        if (index < 0 || index >= this.cards.length) return;

        const card = this.cards[index];
        const container = document.getElementById('quiz-container');
        if (!container) return;

        let flashcardContainer = document.getElementById('flashcard-container');
        if (!flashcardContainer) {
            flashcardContainer = document.createElement('div');
            flashcardContainer.id = 'flashcard-container';
            flashcardContainer.className = 'flashcard-container';
            container.innerHTML = '';
            container.appendChild(flashcardContainer);
        }

        flashcardContainer.innerHTML = `
            <div class="flashcard" data-showing="question">
                <div class="flashcard-side question-side">
                    <div class="flashcard-progress">${index + 1} / ${this.cards.length}</div>
                    <div class="flashcard-question">${card.question}</div>
                    <div class="flashcard-options">
                        ${card.options.map((opt, i) => `
                            <div class="flashcard-option">${String.fromCharCode(65 + i)}. ${opt}</div>
                        `).join('')}
                    </div>
                    <button class="flashcard-flip" onclick="FlashcardMode.flipCard()">Ver Resposta</button>
                </div>
                <div class="flashcard-side answer-side" style="display:none">
                    <div class="flashcard-progress">${index + 1} / ${this.cards.length}</div>
                    <div class="flashcard-question">${card.question}</div>
                    <div class="flashcard-answer">
                        <strong>Resposta Correta:</strong> ${card.correctAnswer}
                    </div>
                    ${card.explanation ? `<div class="flashcard-explanation">${card.explanation}</div>` : ''}
                    <div class="flashcard-actions">
                        <button class="flashcard-flip" onclick="FlashcardMode.flipCard()">Ver Questão</button>
                        <button class="flashcard-next" onclick="FlashcardMode.nextCard()">Próxima</button>
                        <button class="flashcard-prev" onclick="FlashcardMode.prevCard()">Anterior</button>
                    </div>
                </div>
            </div>
        `;

        this.currentCard = index;
    },

    flipCard() {
        const flashcard = document.querySelector('.flashcard');
        if (!flashcard) return;

        const questionSide = flashcard.querySelector('.question-side');
        const answerSide = flashcard.querySelector('.answer-side');
        const showing = flashcard.getAttribute('data-showing');

        if (showing === 'question') {
            questionSide.style.display = 'none';
            answerSide.style.display = 'block';
            flashcard.setAttribute('data-showing', 'answer');
        } else {
            questionSide.style.display = 'block';
            answerSide.style.display = 'none';
            flashcard.setAttribute('data-showing', 'question');
        }
    },

    nextCard() {
        if (this.currentCard < this.cards.length - 1) {
            this.showCard(this.currentCard + 1);
        }
    },

    prevCard() {
        if (this.currentCard > 0) {
            this.showCard(this.currentCard - 1);
        }
    },

    createToggle() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const existing = document.getElementById('flashcard-toggle');
        if (existing) return;

        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'flashcard-toggle-container';
        toggleContainer.innerHTML = `
            <label class="flashcard-toggle-label">
                <input type="checkbox" id="flashcard-toggle">
                <span>Modo Flashcard</span>
            </label>
        `;

        const studyModeContainer = document.querySelector('.study-mode-container');
        if (studyModeContainer) {
            sidebar.insertBefore(toggleContainer, studyModeContainer.nextSibling);
        }

        const toggle = document.getElementById('flashcard-toggle');
        if (toggle) {
            toggle.addEventListener('change', () => this.toggle());
        }
    }
};

// Estilos para flashcard
const flashcardStyles = `
.flashcard-container{
  max-width:600px;
  margin:0 auto;
}

.flashcard{
  background:linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.05));
  border:1px solid var(--border);
  border-radius:calc(var(--radius) + 2px);
  padding:32px;
  box-shadow: var(--shadow-lg);
  min-height:400px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
}

.flashcard-progress{
  text-align:center;
  font-size:12px;
  color:var(--muted);
  margin-bottom:16px;
}

.flashcard-question{
  font-size:20px;
  font-weight:600;
  color:var(--text);
  margin-bottom:24px;
  line-height:1.6;
}

.flashcard-options{
  margin:24px 0;
}

.flashcard-option{
  padding:12px;
  margin:8px 0;
  background:rgba(8,12,24,.4);
  border:1px solid var(--border);
  border-radius:8px;
  color:var(--text);
}

.flashcard-answer{
  background:rgba(16,185,129,.1);
  border:1px solid var(--success);
  border-radius:8px;
  padding:16px;
  margin:16px 0;
  color:var(--text);
  font-size:16px;
}

.flashcard-explanation{
  background:rgba(59,130,246,.1);
  border:1px solid var(--primary);
  border-radius:8px;
  padding:16px;
  margin:16px 0;
  color:var(--text);
  line-height:1.6;
}

.flashcard-flip,
.flashcard-next,
.flashcard-prev{
  padding:12px 24px;
  border-radius:8px;
  border:none;
  background:var(--primary);
  color:white;
  font-weight:600;
  cursor:pointer;
  margin:8px;
  transition:filter .2s ease;
}

.flashcard-flip:hover,
.flashcard-next:hover,
.flashcard-prev:hover{
  filter:brightness(1.1);
}

.flashcard-actions{
  display:flex;
  justify-content:center;
  gap:12px;
  margin-top:24px;
}

.flashcard-toggle-container{
  background:rgba(8,12,24,.4);
  border:1px solid var(--border);
  border-radius:8px;
  padding:12px;
  margin:12px 0;
}

.flashcard-toggle-label{
  display:flex;
  align-items:center;
  gap:8px;
  cursor:pointer;
  color:var(--text);
  font-weight:600;
  font-size:14px;
}

.flashcard-toggle-label input[type="checkbox"]{
  width:18px;
  height:18px;
  cursor:pointer;
  accent-color:var(--primary);
}
`;

if (!document.getElementById('flashcard-styles')) {
    const style = document.createElement('style');
    style.id = 'flashcard-styles';
    style.textContent = flashcardStyles;
    document.head.appendChild(style);
}

