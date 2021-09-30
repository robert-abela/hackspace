const cacheName = 'HackSpacePWAv1'
const appShellFiles = [
  '/404.html',
  '/article-logo-launch.html',
  '/article-start-journey.html',
  '/articles-list.html',
  '/index.html',
  '/join.html',
  '/planned-sessions.html',
  '/qr.html',
  '/sponsors.html',
  '/assets/favicon.ico',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png',
  '/assets/logo-horizontal-big.png',
  '/assets/logo-horizontal-med.png',
  '/assets/logo-vertical-big.png',
  '/assets/photos/female-865110_1280.jpg',
  '/assets/photos/path-6567149_1280.jpg',
  '/css/404.css',
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
  const cache = await caches.open(cacheName)
  await cache.addAll(appShellFiles)
}

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  )
})