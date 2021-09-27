var staticCacheName = "pwa";

self.addEventListener('install', function(event) {
	event.waitUntil(
	  caches.open(cacheName).then(function(cache) {
		return cache.addAll(
		  [
			'/404.html',
			'/article-logo-launch.html',
			'/article-start-journey.html',
			'/articles-list.html',
			'/index.html',
			'/join.html',
			'/planned-sessions.html',
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
			'/js/egg.min.js',
			'/js/scripts.js'
		  ]
		);
	  })
	);
  });
  

self.addEventListener("fetch", function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});
