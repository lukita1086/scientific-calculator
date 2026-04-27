// ─── sw.js — Service Worker for Scientific Calculator PWA ───────────────────
// Strategy: Cache-first for app shell, network-first for external resources.
// On install: pre-cache all local assets so the app works fully offline.

const CACHE_NAME = 'open-calc-v2';

// All local files that make up the app shell
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/i18n.js',
  '/js/calculator.js',
  '/js/history.js',
  '/js/tests.js',
  '/js/app.js',
  '/manifest.json',
];

// External resources (fonts) — cache on first use
const EXTERNAL_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ── Install — pre-cache app shell ──────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      // Activate immediately — don't wait for old SW to be released
      return self.skipWaiting();
    })
  );
});

// ── Activate — clean up old caches ────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch — serve from cache, fall back to network ────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and browser extension requests
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // External fonts: stale-while-revalidate
  if (EXTERNAL_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(event.request);
        const networkFetch = fetch(event.request)
          .then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
    return;
  }

  // Local app shell: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      // Not in cache — fetch and cache it
      return fetch(event.request).then(response => {
        if (!response || !response.ok) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
