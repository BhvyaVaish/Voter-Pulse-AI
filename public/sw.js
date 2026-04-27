// Voter Pulse AI — Service Worker
// Provides offline caching for core app shell and assets

const CACHE_NAME = 'voterpulse-v1';
const OFFLINE_URL = '/';

// Core app shell files to pre-cache
const APP_SHELL = [
  '/',
  '/dashboard',
  '/journey',
  '/assistant',
  '/simulator',
  '/candidates',
  '/manifest.json',
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API calls, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== self.location.origin) return;

  // API calls: network-first with fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            answer: 'You are currently offline. The AI assistant requires an internet connection. For offline help, try asking about: voter eligibility, registration, EVM process, or polling booth.',
            trustLevel: 'UNCERTAIN',
            quickActions: ['Check Eligibility', 'How to Vote'],
            nextStep: null,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  }

  // App pages & static assets: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // If both network and cache fail, return offline page
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return undefined;
        });

      return cached || fetched;
    })
  );
});
