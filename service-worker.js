// service-worker.js
const CACHE_NAME = 'site-cache-v1';  // Change the version to 'site-cache-v2' etc., when updating resources
const URLsToCache = [
  'https://psychly-hireup-template.webflow.io/browse-therapists',
  'https://cdn.jetboost.io/jetboost.js',
  'https://cdn.jetboost.io/v1.30.6/jetboost-main.js'
];

// Install event: Caches resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(URLsToCache);
      })
  );
});

// Fetch event: Serves app from cache, falls back to network if not available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event: Cleans up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
