/**
 * Service Worker para PWA
 * Permite funcionamento offline e cache de recursos
 */

const CACHE_NAME = 'quiz-tech-v1';
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '');
const urlsToCache = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/select-groups.html',
  BASE_PATH + '/quiz.html',
  BASE_PATH + '/history.html',
  BASE_PATH + '/review.html',
  BASE_PATH + '/css/styles.css',
  BASE_PATH + '/js/script.js',
  BASE_PATH + '/js/user-form.js',
  BASE_PATH + '/js/select-groups.js',
  BASE_PATH + '/js/access-control.js',
  BASE_PATH + '/js/history.js',
  BASE_PATH + '/js/history-page.js',
  BASE_PATH + '/js/pdf-export.js',
  BASE_PATH + '/js/review-mode.js',
  BASE_PATH + '/js/review-page.js',
  BASE_PATH + '/js/stats.js',
  BASE_PATH + '/js/auth.js',
  BASE_PATH + '/js/pwa-install.js',
  BASE_PATH + '/data/Questions_AWS.json',
  BASE_PATH + '/data/Questions_COBIT.json'
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
            return caches.match(BASE_PATH + '/index.html');
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

