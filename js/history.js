/**
 * Sistema de Histórico de Tentativas
 * Armazena e gerencia histórico de tentativas do quiz
 */

const HistoryManager = {
    dbName: 'QuizTechDB',
    dbVersion: 1,
    storeName: 'attempts',
    
    // Inicializar banco de dados IndexedDB
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('userId', 'userId', { unique: false });
                    objectStore.createIndex('quizType', 'quizType', { unique: false });
                    objectStore.createIndex('date', 'date', { unique: false });
                }
            };
        });
    },
    
    // Salvar tentativa
    async saveAttempt(attemptData) {
        try {
            const db = await this.initDB();
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const attempt = {
                userId: attemptData.userId || attemptData.userEmail,
                userName: attemptData.userName,
                userEmail: attemptData.userEmail,
                quizType: attemptData.quizType,
                selectedGroups: attemptData.selectedGroups,
                correctCount: attemptData.correctCount,
                incorrectCount: attemptData.incorrectCount,
                totalQuestions: attemptData.totalQuestions,
                percentage: attemptData.percentage,
                timeSpent: attemptData.timeSpent,
                questions: attemptData.questions, // Array com questões e respostas
                date: new Date().toISOString(),
                timestamp: Date.now()
            };
            
            const request = store.add(attempt);
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Erro ao salvar tentativa:', error);
            // Fallback para localStorage se IndexedDB falhar
            this.saveAttemptLocalStorage(attemptData);
        }
    },
    
    // Fallback para localStorage
    saveAttemptLocalStorage(attemptData) {
        try {
            const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
            attempts.push({
                ...attemptData,
                id: Date.now(),
                date: new Date().toISOString()
            });
            localStorage.setItem('quizAttempts', JSON.stringify(attempts));
        } catch (error) {
            console.error('Erro ao salvar em localStorage:', error);
        }
    },
    
    // Obter histórico do usuário
    async getUserHistory(userId) {
        try {
            const db = await this.initDB();
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('userId');
            
            const request = index.getAll(userId);
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const attempts = request.result.sort((a, b) => b.timestamp - a.timestamp);
                    resolve(attempts);
                };
                request.onerror = () => {
                    // Fallback para localStorage
                    const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
                    const userAttempts = attempts
                        .filter(a => (a.userId || a.userEmail) === userId)
                        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                    resolve(userAttempts);
                };
            });
        } catch (error) {
            console.error('Erro ao obter histórico:', error);
            const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
            const userAttempts = attempts
                .filter(a => (a.userId || a.userEmail) === userId)
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            return userAttempts;
        }
    },
    
    // Obter estatísticas do usuário
    async getUserStats(userId) {
        const attempts = await this.getUserHistory(userId);
        
        if (attempts.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                bestScore: 0,
                improvement: 0,
                topicsStats: {}
            };
        }
        
        const scores = attempts.map(a => a.percentage || 0);
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const bestScore = Math.max(...scores);
        const improvement = attempts.length > 1 
            ? scores[0] - scores[scores.length - 1] 
            : 0;
        
        // Estatísticas por tópico
        const topicsStats = {};
        attempts.forEach(attempt => {
            if (attempt.questions) {
                attempt.questions.forEach(q => {
                    const topic = q.topic || 'Geral';
                    if (!topicsStats[topic]) {
                        topicsStats[topic] = { correct: 0, total: 0 };
                    }
                    topicsStats[topic].total++;
                    if (q.isCorrect) {
                        topicsStats[topic].correct++;
                    }
                });
            }
        });
        
        // Calcular porcentagem por tópico
        Object.keys(topicsStats).forEach(topic => {
            const stats = topicsStats[topic];
            stats.percentage = stats.total > 0 
                ? Math.round((stats.correct / stats.total) * 100) 
                : 0;
        });
        
        return {
            totalAttempts: attempts.length,
            averageScore: Math.round(averageScore),
            bestScore: Math.round(bestScore),
            improvement: Math.round(improvement),
            topicsStats,
            lastAttempt: attempts[0] || null
        };
    },
    
    // Obter questões para revisão (apenas erradas)
    async getReviewQuestions(userId, quizType = null) {
        const attempts = await this.getUserHistory(userId);
        
        const wrongQuestions = new Map();
        
        attempts.forEach(attempt => {
            if (quizType && attempt.quizType !== quizType) return;
            
            if (attempt.questions) {
                attempt.questions.forEach(q => {
                    if (!q.isCorrect) {
                        const key = q.questionId || q.question;
                        if (!wrongQuestions.has(key) || q.date > wrongQuestions.get(key).date) {
                            wrongQuestions.set(key, {
                                ...q,
                                date: attempt.date,
                                attemptDate: attempt.date
                            });
                        }
                    }
                });
            }
        });
        
        return Array.from(wrongQuestions.values());
    }
};

