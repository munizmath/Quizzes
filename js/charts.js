/**
 * QUIZ TECH - Gráficos de Desempenho
 * Usa Chart.js via CDN
 */
const ChartsManager = {
    chartLibLoaded: false,
    
    async loadChartLibrary() {
        if (this.chartLibLoaded) return;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
            script.onload = () => {
                this.chartLibLoaded = true;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    async createPerformanceChart(containerId, data) {
        await this.loadChartLibrary();
        
        const canvas = document.createElement('canvas');
        const container = document.getElementById(containerId);
        if (!container) return null;

        container.innerHTML = '';
        container.appendChild(canvas);

        return new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Pontuação (%)',
                    data: data.scores,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'var(--text)'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: 'var(--text)'
                        },
                        grid: {
                            color: 'var(--border)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'var(--text)'
                        },
                        grid: {
                            color: 'var(--border)'
                        }
                    }
                }
            }
        });
    },

    async createTopicChart(containerId, data) {
        await this.loadChartLibrary();
        
        const canvas = document.createElement('canvas');
        const container = document.getElementById(containerId);
        if (!container) return null;

        container.innerHTML = '';
        container.appendChild(canvas);

        return new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.topics,
                datasets: [{
                    label: 'Acertos (%)',
                    data: data.percentages,
                    backgroundColor: data.percentages.map(p => 
                        p >= 80 ? 'rgba(16, 185, 129, 0.8)' : 
                        p >= 60 ? 'rgba(255, 193, 7, 0.8)' : 
                        'rgba(239, 68, 68, 0.8)'
                    )
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: 'var(--text)'
                        },
                        grid: {
                            color: 'var(--border)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'var(--text)'
                        },
                        grid: {
                            color: 'var(--border)'
                        }
                    }
                }
            }
        });
    }
};

