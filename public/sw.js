// Minimal service worker for PWA installation
self.addEventListener('install', (event) => {
  // console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // Minimal fetch listener required for PWA criteria
  event.respondWith(fetch(event.request));
});
