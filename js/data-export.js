/**
 * QUIZ TECH - Exportação de Dados do Usuário
 */
const DataExporter = {
    async exportUserData() {
        try {
            const data = await this.collectAllData();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quiz-tech-dados-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('Dados exportados com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            this.showToast('Erro ao exportar dados.');
        }
    },

    async collectAllData() {
        const data = {
            exportDate: new Date().toISOString(),
            userInfo: {
                name: sessionStorage.getItem('userName') || '',
                email: sessionStorage.getItem('userEmail') || ''
            },
            preferences: {
                theme: localStorage.getItem('quiz-theme') || 'dark',
                language: localStorage.getItem('quiz-language') || 'pt-BR',
                fontSize: localStorage.getItem('quiz-font-size') || 'medium',
                soundsEnabled: localStorage.getItem('quiz-sounds-enabled') !== 'false'
            },
            bookmarks: JSON.parse(localStorage.getItem('quiz-bookmarks') || '[]'),
            history: await this.getHistoryData()
        };

        return data;
    },

    async getHistoryData() {
        try {
            if (typeof HistoryManager !== 'undefined') {
                return await HistoryManager.getHistory();
            }
            return [];
        } catch (error) {
            console.error('Erro ao obter histórico:', error);
            return [];
        }
    },

    async deleteAllData() {
        if (!confirm('Tem certeza que deseja deletar TODOS os seus dados? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            // Limpar sessionStorage
            sessionStorage.clear();

            // Limpar localStorage
            localStorage.clear();

            // Limpar IndexedDB
            if (typeof HistoryManager !== 'undefined') {
                await HistoryManager.clearHistory();
            }

            this.showToast('Todos os dados foram deletados.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            console.error('Erro ao deletar dados:', error);
            this.showToast('Erro ao deletar dados.');
        }
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'data-export-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
};

// Estilos para toast de exportação
const dataExportStyles = `
.data-export-toast{
  position:fixed;
  bottom:80px;
  left:50%;
  transform:translateX(-50%) translateY(20px);
  background:rgba(21,27,49,.95);
  border:1px solid var(--border);
  color:var(--text);
  padding:12px 20px;
  border-radius:8px;
  box-shadow:var(--shadow-md);
  opacity:0;
  transition:all .3s ease;
  z-index:1001;
}

.data-export-toast.show{
  transform:translateX(-50%) translateY(0);
  opacity:1;
}
`;

if (!document.getElementById('data-export-styles')) {
    const style = document.createElement('style');
    style.id = 'data-export-styles';
    style.textContent = dataExportStyles;
    document.head.appendChild(style);
}

