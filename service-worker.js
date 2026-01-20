const CACHE_NAME = "KYA21-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/assets/css/index.css",
  "/assets/js/script.js",
  "/icons/icon-192.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch Requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});