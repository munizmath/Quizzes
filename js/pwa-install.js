/**
 * PWA Install Handler
 * Gerencia instalação e atualização do PWA
 */

const PWAInstall = {
    deferredPrompt: null,
    installButton: null,
    
    init() {
        // Detectar se pode instalar
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        // Detectar se já está instalado
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('PWA já instalado');
            this.hideInstallButton();
        }
        
        // Listener para botão de instalação
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'install-pwa-button') {
                this.installPWA();
            }
        });
    },
    
    showInstallButton() {
        let button = document.getElementById('install-pwa-button');
        if (!button) {
            button = document.createElement('button');
            button.id = 'install-pwa-button';
            button.className = 'quiz-option secondary';
            button.textContent = '📱 Instalar App';
            button.setAttribute('aria-label', 'Instalar aplicativo no dispositivo');
            
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.insertBefore(button, sidebar.firstChild);
            }
        }
        button.style.display = 'block';
    },
    
    hideInstallButton() {
        const button = document.getElementById('install-pwa-button');
        if (button) {
            button.style.display = 'none';
        }
    },
    
    async installPWA() {
        if (!this.deferredPrompt) {
            alert('Instalação não disponível neste navegador.');
            return;
        }
        
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('PWA instalado');
            this.hideInstallButton();
        } else {
            console.log('Instalação cancelada');
        }
        
        this.deferredPrompt = null;
    },
    
    // Registrar service worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                // Detectar caminho base automaticamente
                const basePath = window.location.pathname.replace(/\/[^\/]*\.html?$/, '') || '/';
                const swPath = basePath + (basePath.endsWith('/') ? '' : '/') + 'sw.js';
                const registration = await navigator.serviceWorker.register(swPath);
                console.log('Service Worker registrado:', registration);
                
                // Verificar atualizações
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nova versão disponível
                            if (confirm('Nova versão disponível! Deseja atualizar?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            } catch (error) {
                console.error('Erro ao registrar Service Worker:', error);
            }
        }
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    PWAInstall.init();
    PWAInstall.registerServiceWorker();
});

