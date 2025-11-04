/**
 * QUIZ TECH - Gerenciador de Compartilhamento
 */
const ShareManager = {
    init() {
        this.createShareButtons();
    },

    createShareButtons() {
        const resultActions = document.getElementById('result-actions');
        if (!resultActions) return;

        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-container';
        shareContainer.innerHTML = `
            <button id="share-twitter" class="share-btn" data-platform="twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
                Twitter
            </button>
            <button id="share-facebook" class="share-btn" data-platform="facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
                Facebook
            </button>
            <button id="share-whatsapp" class="share-btn" data-platform="whatsapp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.978 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
            </button>
            <button id="share-link" class="share-btn" data-platform="link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                Copiar Link
            </button>
        `;

        resultActions.appendChild(shareContainer);
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.currentTarget.getAttribute('data-platform');
                this.share(platform);
            });
        });
    },

    async share(platform) {
        const result = this.getQuizResult();
        const text = `Consegui ${result.correctCount} acertos de ${result.totalQuestions} questões no Quiz Tech!`;
        const url = window.location.href;

        switch(platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            case 'link':
                await navigator.clipboard.writeText(url);
                this.showToast('Link copiado para a área de transferência!');
                break;
        }
    },

    getQuizResult() {
        const correctCount = parseInt(document.getElementById('correct-counter')?.textContent || '0');
        const incorrectCount = parseInt(document.getElementById('incorrect-counter')?.textContent || '0');
        const totalQuestions = correctCount + incorrectCount;
        
        return { correctCount, incorrectCount, totalQuestions };
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
};

// Estilos para compartilhamento
const shareStyles = `
.share-container{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-top:16px;
}

.share-btn{
  flex:1;
  min-width:100px;
  padding:10px 16px;
  border-radius:8px;
  border:1px solid var(--border);
  background:rgba(255,255,255,.08);
  color:var(--text);
  font-weight:600;
  font-size:12px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  transition:all .2s ease;
}

.share-btn:hover{
  background:rgba(255,255,255,.12);
  border-color:var(--primary);
}

.share-btn svg{
  width:16px;
  height:16px;
}

.share-toast{
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

.share-toast.show{
  transform:translateX(-50%) translateY(0);
  opacity:1;
}
`;

if (!document.getElementById('share-styles')) {
    const style = document.createElement('style');
    style.id = 'share-styles';
    style.textContent = shareStyles;
    document.head.appendChild(style);
}

