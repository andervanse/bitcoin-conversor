
var STATIC_CACHE_NAME = "static-cache-v4";
var DYNAMIC_CACHE_NAME = "dynamic-cache-v1";

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

        } else {

          return caches.open(DYNAMIC_CACHE_NAME)
              .then(function(cache) {                 
                  console.log('Network request for ', event.request.url);

                  return fetch(event.request)
                      .then(function(networkResponse) {

                        if (event.request.url.indexOf('.json') == -1){                          
                           cache.put(event.request, networkResponse.clone());
                           console.log(event.request.url,  " added to dynamic cache.");
                        }

                        return networkResponse;  
                      })
              });
        }

      }).catch(function(error) {  
        console.log(error);  
      })
    )
  });
