// service-worker.js
const CACHE_NAME = 'site-cache-v1';
const URLsToCache = [
  'https://psychly-hireup-template.webflow.io/browse-therapists',
  'https://cdn.jetboost.io/jetboost.js',
  'https://cdn.jetboost.io/v1.30.6/jetboost-main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(URLsToCache);
      })
  );
});

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
