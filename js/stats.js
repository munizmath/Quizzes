/**
 * Estatísticas Detalhadas por Tópico
 * Analisa e apresenta estatísticas por tópico do quiz
 */

const StatsManager = {
    // Extrair tópicos das questões
    extractTopics(questions) {
        const topics = new Map();
        
        questions.forEach(q => {
            // Tentar extrair tópico da pergunta ou ID
            let topic = 'Geral';
            
            // Procurar palavras-chave na pergunta
            const keywords = {
                'EC2': ['ec2', 'instância', 'instance'],
                'S3': ['s3', 'bucket', 'storage'],
                'RDS': ['rds', 'database', 'banco de dados'],
                'IAM': ['iam', 'acesso', 'permissão'],
                'VPC': ['vpc', 'rede', 'network'],
                'Lambda': ['lambda', 'função', 'function'],
                'CloudWatch': ['cloudwatch', 'monitoramento', 'log'],
                'SNS': ['sns', 'notificação', 'notification'],
                'SQS': ['sqs', 'fila', 'queue'],
                'Route53': ['route53', 'dns', 'domínio'],
                'COBIT': ['cobit', 'governança', 'governance'],
                'ITIL': ['itil', 'serviço', 'service'],
                'Segurança': ['segurança', 'security', 'criptografia', 'encryption'],
                'Backup': ['backup', 'restore', 'recuperação'],
                'Disaster Recovery': ['disaster', 'recuperação de desastre', 'dr']
            };
            
            const questionLower = q.question.toLowerCase();
            for (const [topicName, terms] of Object.entries(keywords)) {
                if (terms.some(term => questionLower.includes(term))) {
                    topic = topicName;
                    break;
                }
            }
            
            if (!topics.has(topic)) {
                topics.set(topic, []);
            }
            topics.get(topic).push(q);
        });
        
        return topics;
    },
    
    // Calcular estatísticas por tópico
    calculateTopicStats(questions, userAnswers) {
        const topics = this.extractTopics(questions);
        const stats = {};
        
        topics.forEach((topicQuestions, topicName) => {
            let correct = 0;
            let total = topicQuestions.length;
            
            topicQuestions.forEach(q => {
                const questionId = q.id || q.question;
                const userAnswer = userAnswers[questionId];
                const correctAnswer = q.correctAnswer;
                
                if (userAnswer) {
                    const isCorrect = Array.isArray(correctAnswer)
                        ? correctAnswer.every(ans => userAnswer.includes(ans))
                        : userAnswer === correctAnswer;
                    
                    if (isCorrect) correct++;
                }
            });
            
            stats[topicName] = {
                total,
                correct,
                incorrect: total - correct,
                percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
                questions: topicQuestions
            };
        });
        
        return stats;
    },
    
    // Gerar gráfico de estatísticas (usando canvas ou biblioteca)
    generateStatsHTML(stats) {
        let html = '<div class="stats-container">';
        html += '<h2>Estatísticas por Tópico</h2>';
        html += '<div class="stats-grid">';
        
        // Ordenar por porcentagem (menor para maior - mostrar fraquezas primeiro)
        const sortedStats = Object.entries(stats)
            .sort((a, b) => a[1].percentage - b[1].percentage);
        
        sortedStats.forEach(([topic, data]) => {
            const percentage = data.percentage;
            const barColor = percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545';
            
            html += `
                <div class="stat-card">
                    <h3>${topic}</h3>
                    <div class="stat-bar">
                        <div class="stat-bar-fill" style="width: ${percentage}%; background-color: ${barColor};"></div>
                    </div>
                    <div class="stat-details">
                        <span>${data.correct}/${data.total} corretas</span>
                        <span class="stat-percentage">${percentage}%</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    },
    
    // Obter recomendações de estudo
    getStudyRecommendations(stats) {
        const recommendations = [];
        
        // Tópicos com menos de 60%
        const weakTopics = Object.entries(stats)
            .filter(([topic, data]) => data.percentage < 60)
            .sort((a, b) => a[1].percentage - b[1].percentage);
        
        if (weakTopics.length > 0) {
            recommendations.push({
                type: 'urgent',
                message: `Foque em: ${weakTopics.slice(0, 3).map(t => t[0]).join(', ')}`,
                topics: weakTopics.map(t => t[0])
            });
        }
        
        // Tópicos com 60-79%
        const mediumTopics = Object.entries(stats)
            .filter(([topic, data]) => data.percentage >= 60 && data.percentage < 80);
        
        if (mediumTopics.length > 0) {
            recommendations.push({
                type: 'improve',
                message: `Melhore em: ${mediumTopics.map(t => t[0]).join(', ')}`,
                topics: mediumTopics.map(t => t[0])
            });
        }
        
        // Tópicos fortes
        const strongTopics = Object.entries(stats)
            .filter(([topic, data]) => data.percentage >= 80);
        
        if (strongTopics.length > 0) {
            recommendations.push({
                type: 'maintain',
                message: `Mantenha o bom desempenho em: ${strongTopics.map(t => t[0]).join(', ')}`,
                topics: strongTopics.map(t => t[0])
            });
        }
        
        return recommendations;
    }
};

