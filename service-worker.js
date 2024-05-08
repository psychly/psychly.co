// service-worker.js
const CACHE_NAME = 'site-cache-v1';
const URLsToCache = [
  '/',
  '/browse-therapists',  // Ensure you adjust this URL to the actual path
  '/css/styles.css',  // Adjust based on your actual stylesheets
  '/js/script.js'  // Adjust based on your actual scripts
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
