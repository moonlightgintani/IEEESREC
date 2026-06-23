const CACHE_NAME = "srec-ieee-cache-v4";
const urlsToCache = [
  "/manifest.json",
  "/ieee.png",
  "/ieee-logo.png"
];

// Helper to safely save GET responses to cache
const saveToCache = (request, response) => {
  const url = new URL(request.url);
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return Promise.resolve();
  }
  // Avoid caching Supabase APIs, but allow Supabase public storage assets
  if (url.hostname.includes("supabase.co") && !url.pathname.includes("/storage/v1/object/public/")) {
    return Promise.resolve();
  }
  return caches.open(CACHE_NAME)
    .then(cache => cache.put(request, response))
    .catch(err => {
      console.warn("ServiceWorker cache put failed:", err);
    });
};

// Install event - Cache static assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - Clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network First for HTML/nav, Stale-While-Revalidate for other static assets
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Only handle GET requests and HTTP/HTTPS schemes
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // 2. Bypass Supabase APIs and dynamic content
  if (url.hostname.includes("supabase.co") && !url.pathname.includes("/storage/v1/object/public/")) {
    return;
  }

  // 3. Use Network-First for main page and HTML requests to avoid caching outdated hashed assets
  if (request.mode === "navigate" || url.pathname === "/" || url.pathname.endsWith(".html")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const copy = response.clone();
            saveToCache(request, copy);
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // 4. Use Stale-While-Revalidate for other assets
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        fetch(request)
          .then(networkResponse => {
            if (networkResponse.status === 200) {
              saveToCache(request, networkResponse);
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then(networkResponse => {
        if (networkResponse.status === 200) {
          const copy = networkResponse.clone();
          saveToCache(request, copy);
        }
        return networkResponse;
      });
    })
  );
});
