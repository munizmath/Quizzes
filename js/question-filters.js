/**
 * QUIZ TECH - Filtros de Questões
 */
const QuestionFilters = {
    filters: {
        topic: null,
        difficulty: null,
        answered: null,
        incorrect: null
    },

    init() {
        this.createFilterUI();
    },

    createFilterUI() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const existingFilters = document.getElementById('question-filters');
        if (existingFilters) return;

        const filterContainer = document.createElement('div');
        filterContainer.id = 'question-filters';
        filterContainer.className = 'question-filters-container';
        filterContainer.innerHTML = `
            <h2>Filtros de Questões</h2>
            <div class="filter-group">
                <label for="filter-topic">Tópico:</label>
                <select id="filter-topic">
                    <option value="">Todos os tópicos</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="filter-difficulty">Dificuldade:</label>
                <select id="filter-difficulty">
                    <option value="">Todas</option>
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                </select>
            </div>
            <div class="filter-group">
                <label>
                    <input type="checkbox" id="filter-answered"> Apenas respondidas
                </label>
            </div>
            <div class="filter-group">
                <label>
                    <input type="checkbox" id="filter-incorrect"> Apenas erradas
                </label>
            </div>
            <button id="apply-filters" class="filter-btn">Aplicar Filtros</button>
            <button id="clear-filters" class="filter-btn secondary">Limpar Filtros</button>
        `;

        const submitButton = document.getElementById('submit-button');
        if (submitButton) {
            sidebar.insertBefore(filterContainer, submitButton);
        } else {
            sidebar.appendChild(filterContainer);
        }

        this.setupEventListeners();
    },

    setupEventListeners() {
        const applyBtn = document.getElementById('apply-filters');
        const clearBtn = document.getElementById('clear-filters');

        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
    },

    extractTopics(questions) {
        const topics = new Set();
        questions.forEach(q => {
            if (q.topic) topics.add(q.topic);
        });
        return Array.from(topics).sort();
    },

    populateTopics(questions) {
        const topicSelect = document.getElementById('filter-topic');
        if (!topicSelect) return;

        const topics = this.extractTopics(questions);
        topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic;
            topicSelect.appendChild(option);
        });
    },

    applyFilters() {
        const topic = document.getElementById('filter-topic')?.value || null;
        const difficulty = document.getElementById('filter-difficulty')?.value || null;
        const answered = document.getElementById('filter-answered')?.checked || false;
        const incorrect = document.getElementById('filter-incorrect')?.checked || false;

        this.filters = { topic, difficulty, answered, incorrect };

        if (typeof QuizApp !== 'undefined' && QuizApp.quizStarted) {
            QuizApp.applyFilters(this.filters);
        }
    },

    clearFilters() {
        document.getElementById('filter-topic').value = '';
        document.getElementById('filter-difficulty').value = '';
        document.getElementById('filter-answered').checked = false;
        document.getElementById('filter-incorrect').checked = false;

        this.filters = { topic: null, difficulty: null, answered: null, incorrect: null };

        if (typeof QuizApp !== 'undefined' && QuizApp.quizStarted) {
            QuizApp.applyFilters({});
        }
    }
};

// Estilos para filtros
const filterStyles = `
.question-filters-container{
  background:rgba(8,12,24,.4);
  border:1px solid var(--border);
  border-radius:8px;
  padding:12px;
  margin:12px 0;
}

.question-filters-container h2{
  font-size:12px;
  font-weight:600;
  color:var(--muted);
  margin:0 0 12px;
  text-transform:uppercase;
}

.filter-group{
  margin-bottom:12px;
}

.filter-group label{
  display:block;
  font-size:12px;
  color:var(--text);
  margin-bottom:6px;
  font-weight:600;
}

.filter-group select{
  width:100%;
  padding:8px;
  border-radius:6px;
  border:1px solid var(--border);
  background:rgba(0,0,0,.3);
  color:var(--text);
  font-size:12px;
}

.filter-group input[type="checkbox"]{
  width:16px;
  height:16px;
  accent-color:var(--primary);
  margin-right:6px;
}

.filter-btn{
  width:100%;
  padding:8px;
  border-radius:6px;
  border:none;
  background:var(--primary);
  color:white;
  font-weight:600;
  font-size:12px;
  cursor:pointer;
  margin:6px 0;
  transition:filter .2s ease;
}

.filter-btn:hover{
  filter:brightness(1.1);
}

.filter-btn.secondary{
  background:rgba(255,255,255,.08);
  color:var(--text);
}
`;

if (!document.getElementById('filter-styles')) {
    const style = document.createElement('style');
    style.id = 'filter-styles';
    style.textContent = filterStyles;
    document.head.appendChild(style);
}

