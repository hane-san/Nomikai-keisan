const CACHE_NAME = 'nomikai-keisan-v9';
const ASSETS = [
  './site.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './favicon-16.png',
  './layout-fix.css',
  './logic-fix.js',
  './drawer-controls.css',
  './drawer-controls.js',
  './payment-entry-polish.css',
  './payment-entry-polish.js',
  './slider-safety.css',
  './slider-safety.js',
  './input-state-polish.css',
  './initial-input.js'
];

function withClientPatches(html) {
  let patched = html;
  if (!patched.includes('layout-fix.css')) {
    patched = patched.replace('</head>', '<link rel="stylesheet" href="./layout-fix.css?v=6"></head>');
  }
  if (!patched.includes('drawer-controls.css')) {
    patched = patched.replace('</head>', '<link rel="stylesheet" href="./drawer-controls.css?v=4"></head>');
  }
  if (!patched.includes('payment-entry-polish.css')) {
    patched = patched.replace('</head>', '<link rel="stylesheet" href="./payment-entry-polish.css?v=8"></head>');
  }
  if (!patched.includes('slider-safety.css')) {
    patched = patched.replace('</head>', '<link rel="stylesheet" href="./slider-safety.css?v=9"></head>');
  }
  if (!patched.includes('input-state-polish.css')) {
    patched = patched.replace('</head>', '<link rel="stylesheet" href="./input-state-polish.css?v=9"></head>');
  }
  if (!patched.includes('logic-fix.js')) {
    patched = patched.replace('</body>', '<script src="./logic-fix.js?v=3"></script></body>');
  }
  if (!patched.includes('drawer-controls.js')) {
    patched = patched.replace('</body>', '<script src="./drawer-controls.js?v=4"></script></body>');
  }
  if (!patched.includes('payment-entry-polish.js')) {
    patched = patched.replace('</body>', '<script src="./payment-entry-polish.js?v=8"></script></body>');
  }
  if (!patched.includes('slider-safety.js')) {
    patched = patched.replace('</body>', '<script src="./slider-safety.js?v=9"></script></body>');
  }
  if (!patched.includes('initial-input.js')) {
    patched = patched.replace('</body>', '<script src="./initial-input.js?v=9"></script></body>');
  }
  return patched;
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');

  if (isNavigation) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => response.text())
        .then(html => new Response(withClientPatches(html), {
          headers: { 'content-type': 'text/html; charset=utf-8' }
        }))
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        return response;
      });
    })
  );
});
