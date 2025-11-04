/**
 * QUIZ TECH - Sistema de Internacionalização (i18n)
 */
const I18n = {
    currentLanguage: 'pt-BR',
    translations: {
        'pt-BR': {
            'quiz.title': 'Quiz Tech',
            'quiz.start': 'Iniciar Prova',
            'quiz.name': 'Nome completo',
            'quiz.email': 'E-mail',
            'quiz.type': 'Tipo de prova',
            'quiz.selectOption': 'Selecione uma opção',
            'quiz.groups': 'Selecione os Grupos',
            'quiz.timer': 'Tempo total',
            'quiz.pause': 'Pausar',
            'quiz.resume': 'Retomar',
            'quiz.submit': 'Enviar Respostas',
            'quiz.finish': 'Finalizar Quiz',
            'quiz.restart': 'Reiniciar Quiz',
            'quiz.correct': 'Certas',
            'quiz.incorrect': 'Erradas'
        },
        'en-US': {
            'quiz.title': 'Quiz Tech',
            'quiz.start': 'Start Quiz',
            'quiz.name': 'Full Name',
            'quiz.email': 'Email',
            'quiz.type': 'Quiz Type',
            'quiz.selectOption': 'Select an option',
            'quiz.groups': 'Select Groups',
            'quiz.timer': 'Total Time',
            'quiz.pause': 'Pause',
            'quiz.resume': 'Resume',
            'quiz.submit': 'Submit Answers',
            'quiz.finish': 'Finish Quiz',
            'quiz.restart': 'Restart Quiz',
            'quiz.correct': 'Correct',
            'quiz.incorrect': 'Incorrect'
        },
        'es-ES': {
            'quiz.title': 'Quiz Tech',
            'quiz.start': 'Iniciar Prueba',
            'quiz.name': 'Nombre completo',
            'quiz.email': 'Correo electrónico',
            'quiz.type': 'Tipo de prueba',
            'quiz.selectOption': 'Seleccione una opción',
            'quiz.groups': 'Seleccionar Grupos',
            'quiz.timer': 'Tiempo total',
            'quiz.pause': 'Pausar',
            'quiz.resume': 'Reanudar',
            'quiz.submit': 'Enviar Respuestas',
            'quiz.finish': 'Finalizar Quiz',
            'quiz.restart': 'Reiniciar Quiz',
            'quiz.correct': 'Correctas',
            'quiz.incorrect': 'Incorrectas'
        }
    },

    init() {
        const savedLang = localStorage.getItem('quiz-language') || 'pt-BR';
        this.setLanguage(savedLang);
        this.createLanguageSelector();
    },

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('quiz-language', lang);
        document.documentElement.setAttribute('lang', lang);
        this.translatePage();
    },

    translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                if (el.tagName === 'INPUT' && el.type === 'submit') {
                    el.value = translation;
                } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
    },

    t(key) {
        return this.translations[this.currentLanguage]?.[key] || this.translations['pt-BR'][key] || key;
    },

    createLanguageSelector() {
        const existing = document.getElementById('language-selector');
        if (existing) return;

        const selector = document.createElement('div');
        selector.id = 'language-selector';
        selector.className = 'language-selector';
        selector.innerHTML = `
            <select id="lang-select" aria-label="Selecionar idioma">
                <option value="pt-BR" ${this.currentLanguage === 'pt-BR' ? 'selected' : ''}>🇧🇷 Português</option>
                <option value="en-US" ${this.currentLanguage === 'en-US' ? 'selected' : ''}>🇺🇸 English</option>
                <option value="es-ES" ${this.currentLanguage === 'es-ES' ? 'selected' : ''}>🇪🇸 Español</option>
            </select>
        `;

        const topbar = document.querySelector('.topbar');
        if (topbar) {
            topbar.appendChild(selector);
        } else {
            document.body.insertBefore(selector, document.body.firstChild);
        }

        const select = document.getElementById('lang-select');
        if (select) {
            select.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }
};

// Estilos para seletor de idioma
const languageSelectorStyles = `
.language-selector{
  display:flex;
  align-items:center;
}

.language-selector select{
  padding:6px 10px;
  border-radius:8px;
  border:1px solid var(--border);
  background:rgba(255,255,255,.08);
  color:var(--text);
  font-size:12px;
  cursor:pointer;
}
`;

if (!document.getElementById('language-selector-styles')) {
    const style = document.createElement('style');
    style.id = 'language-selector-styles';
    style.textContent = languageSelectorStyles;
    document.head.appendChild(style);
}

