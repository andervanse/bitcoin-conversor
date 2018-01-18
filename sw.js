
var STATIC_CACHE_NAME = "static-cache-v2";

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
         .then(function(cache) {
             return cache.addAll([
                "manifest.json",
                "index.html",
                "src/css/app.css",
                "src/css/material.min.css",
                "src/js/app.js",
                "src/js/material.min.js",
                "images/bitcoin-32x32.png",
                "https://fonts.googleapis.com/icon?family=Material+Icons",
                "https://fonts.gstatic.com/s/materialicons/v34/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2"                 
             ]);
         })
    );  
});


self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);

    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }

        console.log('Network request for ', event.request.url);
        return fetch(event.request)
  
        // TODO 4 - Add fetched files to the cache
  
      }).catch(function(error) {  
        // TODO 6 - Respond with custom offline page
        console.log(error);
  
      })
    );
  });
