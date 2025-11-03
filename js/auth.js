/**
 * Sistema de Autenticação e Gerenciamento de Usuários
 * Sistema básico de login/usuários usando localStorage e IndexedDB
 */

const AuthManager = {
    dbName: 'QuizTechDB',
    dbVersion: 1,
    usersStore: 'users',
    currentUser: null,
    
    // Inicializar banco de dados
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store de usuários
                if (!db.objectStoreNames.contains(this.usersStore)) {
                    const userStore = db.createObjectStore(this.usersStore, { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('email', 'email', { unique: true });
                    userStore.createIndex('username', 'username', { unique: false });
                }
            };
        });
    },
    
    // Registrar novo usuário
    async register(userData) {
        try {
            const db = await this.initDB();
            const transaction = db.transaction([this.usersStore], 'readwrite');
            const store = transaction.objectStore(this.usersStore);
            
            // Verificar se email já existe
            const emailIndex = store.index('email');
            const existingUser = await new Promise((resolve) => {
                const request = emailIndex.get(userData.email);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve(null);
            });
            
            if (existingUser) {
                return { success: false, message: 'Email já cadastrado' };
            }
            
            const user = {
                username: userData.username,
                email: userData.email,
                password: this.hashPassword(userData.password),
                createdAt: new Date().toISOString(),
                lastLogin: null,
                preferences: {
                    quizType: 'aws',
                    autoSave: true
                }
            };
            
            const request = store.add(user);
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    resolve({ success: true, userId: request.result });
                };
                request.onerror = () => {
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Erro ao registrar:', error);
            // Fallback para localStorage
            return this.registerLocalStorage(userData);
        }
    },
    
    // Fallback localStorage
    registerLocalStorage(userData) {
        try {
            const users = JSON.parse(localStorage.getItem('quizUsers') || '[]');
            if (users.find(u => u.email === userData.email)) {
                return { success: false, message: 'Email já cadastrado' };
            }
            
            const user = {
                id: Date.now(),
                username: userData.username,
                email: userData.email,
                password: this.hashPassword(userData.password),
                createdAt: new Date().toISOString()
            };
            
            users.push(user);
            localStorage.setItem('quizUsers', JSON.stringify(users));
            return { success: true, userId: user.id };
        } catch (error) {
            return { success: false, message: 'Erro ao registrar usuário' };
        }
    },
    
    // Login
    async login(email, password) {
        try {
            const db = await this.initDB();
            const transaction = db.transaction([this.usersStore], 'readonly');
            const store = transaction.objectStore(this.usersStore);
            const emailIndex = store.index('email');
            
            const user = await new Promise((resolve) => {
                const request = emailIndex.get(email);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve(null);
            });
            
            if (!user || user.password !== this.hashPassword(password)) {
                // Tentar localStorage
                return this.loginLocalStorage(email, password);
            }
            
            // Atualizar último login
            user.lastLogin = new Date().toISOString();
            await this.updateUser(user.id, { lastLogin: user.lastLogin });
            
            this.currentUser = user;
            this.saveSession(user);
            
            return { success: true, user: this.sanitizeUser(user) };
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return this.loginLocalStorage(email, password);
        }
    },
    
    // Login localStorage
    loginLocalStorage(email, password) {
        try {
            const users = JSON.parse(localStorage.getItem('quizUsers') || '[]');
            const user = users.find(u => u.email === email && u.password === this.hashPassword(password));
            
            if (!user) {
                return { success: false, message: 'Email ou senha incorretos' };
            }
            
            this.currentUser = user;
            this.saveSession(user);
            return { success: true, user: this.sanitizeUser(user) };
        } catch (error) {
            return { success: false, message: 'Erro ao fazer login' };
        }
    },
    
    // Logout
    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('currentUser');
    },
    
    // Obter usuário atual
    getCurrentUser() {
        if (this.currentUser) {
            return this.sanitizeUser(this.currentUser);
        }
        
        // Tentar recuperar da sessão
        const sessionUser = sessionStorage.getItem('currentUser');
        if (sessionUser) {
            try {
                this.currentUser = JSON.parse(sessionUser);
                return this.sanitizeUser(this.currentUser);
            } catch (e) {
                return null;
            }
        }
        
        return null;
    },
    
    // Verificar se usuário está logado
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },
    
    // Salvar sessão
    saveSession(user) {
        const sanitized = this.sanitizeUser(user);
        sessionStorage.setItem('currentUser', JSON.stringify(sanitized));
        localStorage.setItem('currentUser', JSON.stringify(sanitized));
    },
    
    // Remover senha do objeto usuário
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    },
    
    // Hash simples de senha (em produção, usar bcrypt ou similar)
    hashPassword(password) {
        // Hash simples para demonstração - em produção usar biblioteca adequada
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    },
    
    // Atualizar usuário
    async updateUser(userId, updates) {
        try {
            const db = await this.initDB();
            const transaction = db.transaction([this.usersStore], 'readwrite');
            const store = transaction.objectStore(this.usersStore);
            
            const user = await new Promise((resolve) => {
                const request = store.get(userId);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve(null);
            });
            
            if (!user) return { success: false };
            
            Object.assign(user, updates);
            const request = store.put(user);
            
            return new Promise((resolve) => {
                request.onsuccess = () => {
                    if (this.currentUser && this.currentUser.id === userId) {
                        this.currentUser = user;
                        this.saveSession(user);
                    }
                    resolve({ success: true });
                };
                request.onerror = () => resolve({ success: false });
            });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return { success: false };
        }
    }
};

