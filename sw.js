// BakePilot Service Worker — Version 1.1.43
const CACHE_NAME = 'bakepilot-cache-v1.1.43';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/design-system.css',
  '/assets/bakepilot-logo.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/js/html2canvas.min.js',
  '/js/store.js',
  '/js/components.js',
  '/js/views/login.js',
  '/js/views/dashboard.js',
  '/js/views/orders.js',
  '/js/views/billing.js',
  '/js/views/invoice.js',
  '/js/views/inventory.js',
  '/js/views/recipes.js',
  '/js/views/production.js',
  '/js/views/customers.js',
  '/js/views/expenses.js',
  '/js/views/cashbook.js',
  '/js/views/more.js',
  '/js/views/order-wizard.js',
  '/js/views/suppliers.js',
  '/js/views/catalogue.js',
  '/js/views/auth.js',
  '/js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Non-fatal: Some assets failed to pre-cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-First for dynamic APIs (Live Cloud Sync, Auth, Backups)
  if (url.pathname.startsWith('/api/') || event.request.method !== 'GET') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'offline', message: 'You are currently offline. Local changes will sync when connected.' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 503
        });
      })
    );
    return;
  }

  // Stale-While-Revalidate for App Shell & Static Assets
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
