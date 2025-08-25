const CACHE_NAME = 'trademark-registration-v1';
const STATIC_CACHE_NAME = 'trademark-static-v1';
const DYNAMIC_CACHE_NAME = 'trademark-dynamic-v1';

// Archivos estáticos para cache
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/logo.webp',
  '/favicon.png'
];

// Rutas de la API que queremos cachear
const API_ROUTES = [
  '/api/v1/brands',
  '/api/v1/brands/'
];

// Timeout para detectar backend caído (5 segundos)
const BACKEND_TIMEOUT = 5000;

// Instalación del service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached');
        return self.skipWaiting();
      })
  );
});

// Activación del service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME && 
              cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Interceptar fetch requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Manejar requests de la API
  if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Manejar requests estáticos
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
});

// Manejar requests de la API con detección de backend caído
async function handleApiRequest(request) {
  try {
    // Crear un timeout para detectar backend caído
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Backend timeout')), BACKEND_TIMEOUT);
    });

    // Intentar hacer la request online con timeout
    const fetchPromise = fetch(request);
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (response.ok) {
      // Cachear la respuesta exitosa
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, response.clone());
      
      // Sincronizar con IndexedDB
      await syncToIndexedDB(request.url, response.clone());
      
      return response;
    } else {
      // Backend responde pero con error (4xx, 5xx)
      throw new Error(`Backend error: ${response.status}`);
    }
  } catch (error) {
    console.log('Backend unavailable, serving from cache/IndexedDB:', error.message);
    
    // Si falla, intentar servir desde cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Serving from cache');
      return cachedResponse;
    }

    // Si no hay cache, intentar servir desde IndexedDB
    const offlineData = await getFromIndexedDB(request.url);
    if (offlineData) {
      console.log('Serving from IndexedDB');
      return new Response(JSON.stringify(offlineData), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Fallback a página offline
    console.log('No cached data available, showing offline page');
    return caches.match('/offline.html');
  }
}

// Manejar requests estáticos
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('Static request failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Sincronizar datos con IndexedDB
async function syncToIndexedDB(url, response) {
  try {
    const data = await response.json();
    const db = await openIndexedDB();
    const transaction = db.transaction(['brands'], 'readwrite');
    const store = transaction.objectStore('brands');

    if (url.includes('/api/v1/brands') && !url.includes('/api/v1/brands/')) {
      // Lista de marcas
      if (Array.isArray(data)) {
        await store.clear();
        // Agregar nuevos datos
        for (const brand of data) {
          await store.put(brand);
        }
      }
    } else if (url.includes('/api/v1/brands/') && url.split('/').length > 3) {
      // Marca individual
      const brandId = url.split('/').pop();
      if (data.id) {
        await store.put(data);
      }
    }

    await transaction.complete;
    console.log('Data synced to IndexedDB');
  } catch (error) {
    console.error('Error syncing to IndexedDB:', error);
  }
}

// Obtener datos desde IndexedDB
async function getFromIndexedDB(url) {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(['brands'], 'readonly');
    const store = transaction.objectStore('brands');

    if (url.includes('/api/v1/brands') && !url.includes('/api/v1/brands/')) {
      // Lista de marcas
      return await store.getAll();
    } else if (url.includes('/api/v1/brands/') && url.split('/').length > 3) {
      // Marca individual
      const brandId = url.split('/').pop();
      return await store.get(parseInt(brandId));
    }

    await transaction.complete;
  } catch (error) {
    console.error('Error getting from IndexedDB:', error);
  }
  return null;
}

// Abrir conexión a IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TrademarkDB', 3); // Increment version for UUID migration
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Crear store para marcas si no existe
      if (!db.objectStoreNames.contains('brands')) {
        const brandStore = db.createObjectStore('brands', { keyPath: 'id' }); // No autoIncrement for UUID
        brandStore.createIndex('name', 'name', { unique: false });
        brandStore.createIndex('status', 'status', { unique: false });
        brandStore.createIndex('owner', 'owner', { unique: false });
        brandStore.createIndex('lang', 'lang', { unique: false }); // Added lang index
        brandStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

// Mensajes del service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
