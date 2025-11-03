/**
 * Service Worker para PWA
 * Permite funcionamento offline e cache de recursos
 */

const CACHE_NAME = 'quiz-tech-v1';
const urlsToCache = [
  '/Quizzes/',
  '/Quizzes/index.html',
  '/Quizzes/select-groups.html',
  '/Quizzes/quiz.html',
  '/Quizzes/css/styles.css',
  '/Quizzes/js/script.js',
  '/Quizzes/js/user-form.js',
  '/Quizzes/js/select-groups.js',
  '/Quizzes/js/access-control.js',
  '/Quizzes/js/history.js',
  '/Quizzes/js/pdf-export.js',
  '/Quizzes/js/review-mode.js',
  '/Quizzes/js/stats.js',
  '/Quizzes/js/auth.js',
  '/Quizzes/data/Questions_AWS.json',
  '/Quizzes/data/Questions_COBIT.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Erro ao fazer cache:', error);
      })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retornar resposta do cache
        if (response) {
          return response;
        }
        
        // Clonar requisição
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Verificar se resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clonar resposta
          const responseToCache = response.clone();
          
          // Adicionar ao cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          // Se offline e não houver cache, retornar página offline
          if (event.request.destination === 'document') {
            return caches.match('/Quizzes/index.html');
          }
        });
      })
  );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

