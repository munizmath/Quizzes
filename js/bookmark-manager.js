/**
 * QUIZ TECH - Gerenciador de Marcação de Questões
 */
const BookmarkManager = {
    bookmarks: new Set(),

    init() {
        this.loadBookmarks();
    },

    loadBookmarks() {
        try {
            const saved = localStorage.getItem('quiz-bookmarks');
            if (saved) {
                this.bookmarks = new Set(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Erro ao carregar marcadores:', e);
        }
    },

    saveBookmarks() {
        try {
            localStorage.setItem('quiz-bookmarks', JSON.stringify(Array.from(this.bookmarks)));
        } catch (e) {
            console.error('Erro ao salvar marcadores:', e);
        }
    },

    toggleBookmark(questionId) {
        if (this.bookmarks.has(questionId)) {
            this.bookmarks.delete(questionId);
        } else {
            this.bookmarks.add(questionId);
        }
        this.saveBookmarks();
        this.updateBookmarkUI(questionId);
    },

    isBookmarked(questionId) {
        return this.bookmarks.has(questionId);
    },

    updateBookmarkUI(questionId) {
        const bookmarkBtn = document.querySelector(`[data-question-id="${questionId}"] .bookmark-btn`);
        if (bookmarkBtn) {
            bookmarkBtn.classList.toggle('active', this.isBookmarked(questionId));
            bookmarkBtn.setAttribute('aria-pressed', this.isBookmarked(questionId).toString());
        }
    },

    addBookmarkButton(questionElement, questionId) {
        const existingBtn = questionElement.querySelector('.bookmark-btn');
        if (existingBtn) return;

        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'bookmark-btn';
        bookmarkBtn.setAttribute('aria-label', 'Marcar questão para revisão');
        bookmarkBtn.setAttribute('aria-pressed', this.isBookmarked(questionId).toString());
        bookmarkBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
        `;
        
        if (this.isBookmarked(questionId)) {
            bookmarkBtn.classList.add('active');
        }

        bookmarkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleBookmark(questionId);
        });

        const questionHeader = questionElement.querySelector('h3');
        if (questionHeader) {
            const headerContainer = document.createElement('div');
            headerContainer.style.display = 'flex';
            headerContainer.style.alignItems = 'center';
            headerContainer.style.justifyContent = 'space-between';
            headerContainer.style.gap = '12px';
            
            questionHeader.parentNode.insertBefore(headerContainer, questionHeader);
            headerContainer.appendChild(questionHeader);
            headerContainer.appendChild(bookmarkBtn);
        }
    },

    getBookmarkedQuestions() {
        return Array.from(this.bookmarks);
    }
};

// Estilos para botão de marcação
const bookmarkStyles = `
.bookmark-btn{
  width:36px;
  height:36px;
  border-radius:8px;
  border:1px solid var(--border);
  background:rgba(8,12,24,.4);
  color:var(--muted);
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:all .2s ease;
  flex-shrink:0;
}

.bookmark-btn:hover{
  border-color:var(--primary);
  color:var(--primary);
  background:rgba(59,130,246,.1);
}

.bookmark-btn.active{
  border-color:var(--primary);
  color:var(--primary);
  background:rgba(59,130,246,.15);
}

.bookmark-btn.active svg{
  fill:var(--primary);
}
`;

if (!document.getElementById('bookmark-styles')) {
    const style = document.createElement('style');
    style.id = 'bookmark-styles';
    style.textContent = bookmarkStyles;
    document.head.appendChild(style);
}

