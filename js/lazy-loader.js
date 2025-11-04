/**
 * QUIZ TECH - Carregamento Lazy de Questões
 */
const LazyLoader = {
    questionsPerBatch: 10,
    loadedQuestions: 0,
    observer: null,

    init() {
        this.setupIntersectionObserver();
    },

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback para navegadores antigos
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const questionElement = entry.target;
                    this.loadQuestion(questionElement);
                    this.observer.unobserve(questionElement);
                }
            });
        }, {
            rootMargin: '100px'
        });
    },

    observeQuestions() {
        const questions = document.querySelectorAll('.question:not(.loaded)');
        questions.forEach(q => {
            this.observer?.observe(q);
        });
    },

    loadQuestion(questionElement) {
        questionElement.classList.add('loaded');
        questionElement.style.opacity = '0';
        questionElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            questionElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            questionElement.style.opacity = '1';
            questionElement.style.transform = 'translateY(0)';
        }, 50);
    },

    loadBatch(questions, startIndex) {
        const batch = questions.slice(startIndex, startIndex + this.questionsPerBatch);
        return batch;
    }
};

