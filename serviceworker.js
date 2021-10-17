const MAIN_CACHE = 'HackSpacePWAv2021.10.13'
const CACHABLE_FILES = [
  '/article-freshers-week.html',
  '/article-logo-launch.html',
  '/article-start-journey.html',
  '/articles-list.html',
  '/index.html',
  '/join.html',
  '/planned-sessions.html',
  '/qr.html',
  '/sponsors.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png',
  '/assets/logo-horizontal-big.png',
  '/assets/logo-horizontal-med.png',
  '/assets/logo-vertical-big.png',
  '/assets/photos/Cyber-Root-RGB.png',
  '/assets/photos/freshers1.jpg',
  '/assets/photos/freshers2.jpg',
  '/assets/photos/freshers3.jpg',
  '/assets/photos/female-865110_1280.jpg',
  '/assets/photos/path-6567149_1280.jpg',
  '/assets/presentations/2021.10_freshers/online-ads.pdf',
  '/assets/presentations/2021.10_freshers/strong-passwords.pdf',
  '/css/styles.css',
  '/css/bootstrap.min.css',
  '/js/egg.min.js',
  '/js/bootstrap.bundle.min.js',
  '/js/scripts.js'
]

self.addEventListener('install', function (event) {
  event.waitUntil(cacheAllAssets())
})

async function cacheAllAssets() {
  const cache = await caches.open(MAIN_CACHE)
  await cache.addAll(CACHABLE_FILES)
}

self.addEventListener('fetch', function (event) {
  event.respondWith(
      // Network first
      fetch(event.request).catch(function() {
          return caches.match(event.request)
      })
      /* Cache first 
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request)
      })
      */
  )
})

function clearOldCaches() {
  caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== MAIN_CACHE) {
          return caches.delete(cacheName);
        }
      })
    );
  })
}

self.addEventListener('activate', function (event) {
  event.waitUntil(clearOldCaches())
});