/**
 * QUIZ TECH - Gerenciador de Tema (Modo Escuro/Claro)
 */
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('quiz-theme') || 'dark';
        this.setTheme(savedTheme);
        this.createThemeToggle();
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('quiz-theme', theme);
        
        if (theme === 'light') {
            document.documentElement.style.setProperty('--bg', '#f5f7fa');
            document.documentElement.style.setProperty('--bg-alt', '#ffffff');
            document.documentElement.style.setProperty('--text', '#1a1a1a');
            document.documentElement.style.setProperty('--muted', '#6b7280');
            document.documentElement.style.setProperty('--border', 'rgba(0,0,0,.12)');
            document.documentElement.style.setProperty('--surface', 'rgba(0,0,0,.04)');
        } else {
            document.documentElement.style.setProperty('--bg', '#0b1020');
            document.documentElement.style.setProperty('--bg-alt', '#0d1328');
            document.documentElement.style.setProperty('--text', '#e6edf3');
            document.documentElement.style.setProperty('--muted', '#a9b1bd');
            document.documentElement.style.setProperty('--border', 'rgba(255,255,255,.12)');
            document.documentElement.style.setProperty('--surface', 'rgba(255,255,255,.06)');
        }
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.updateToggleButton(newTheme);
    },

    createThemeToggle() {
        const existingToggle = document.getElementById('theme-toggle');
        if (existingToggle) return;

        const toggle = document.createElement('button');
        toggle.id = 'theme-toggle';
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Alternar tema');
        toggle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;
        toggle.addEventListener('click', () => this.toggleTheme());
        
        const topbar = document.querySelector('.topbar');
        if (topbar) {
            topbar.appendChild(toggle);
        } else {
            document.body.insertBefore(toggle, document.body.firstChild);
        }
        
        this.updateToggleButton(document.documentElement.getAttribute('data-theme') || 'dark');
    },

    updateToggleButton(theme) {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.setAttribute('aria-label', theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro');
        }
    }
};

// Estilos para o botão de toggle
const themeToggleStyles = `
.theme-toggle{
  position:fixed;
  top:18px;
  right:18px;
  z-index:1000;
  width:44px;
  height:44px;
  border-radius:50%;
  border:1px solid var(--border);
  background:linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.05));
  color:var(--text);
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow: var(--shadow-md);
  transition: transform .2s ease, filter .2s ease;
}

.theme-toggle:hover{
  filter:brightness(1.1);
  transform:scale(1.05);
}

.theme-toggle:active{
  transform:scale(.95);
}

@media (max-width: 768px){
  .theme-toggle{
    top:12px;
    right:12px;
    width:40px;
    height:40px;
  }
}
`;

// Adicionar estilos ao head se não existirem
if (!document.getElementById('theme-toggle-styles')) {
    const style = document.createElement('style');
    style.id = 'theme-toggle-styles';
    style.textContent = themeToggleStyles;
    document.head.appendChild(style);
}

