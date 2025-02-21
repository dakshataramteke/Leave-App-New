// let CacheData = "appV2";

// this.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CacheData).then((cache) => {
//       return cache.addAll([
//         "/static/js/bundle.js",
//         "/static/js/main.chunk.js",
//         "/static/js/0.chunk.js",
//         "/static/js/vendors~main.chunk.js",
//         "/static/css/main.chunk.css",
//         "/static/media/logo.6ce24c58.svg",
//         "/",
//         "/index.html",
//         '/logo.svg',
//         '/manifest.json',
//         "/allpending",
//       ]);
//     })
//   );
// });


// // Offline mode 
// this.addEventListener("fetch", (event) => {
//   event.respondWith(
//       caches.match(event.request).then((response) => {
//           if (response) {
//               return response;
//           }
//           return fetch(event.request).catch((error) => {
//               console.error('Fetch failed; returning offline page instead.', error);
//               // return caches.match('/404.html');
//           });
//       })
//   );
// });



let CacheData = "appV2";

this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CacheData).then((cache) => {
      return cache.addAll([
        "/static/js/bundle.js",
        "/static/js/main.chunk.js",
        "/static/js/0.chunk.js",
        "/static/js/vendors~main.chunk.js",
        "/static/css/main.chunk.css",
        "/static/media/logo.6ce24c58.svg",
        "/index.html",
        "/",
        '/logo.svg',
        '/manifest.json',
        "/allpending",
      ]);
    })
  );
});

// Offline mode 
this.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If we have a cached response, return it
      if (response) {
        return response;
      }
      // If not, try to fetch from the network
      return fetch(event.request).catch(() => {
        // If the fetch fails, return a fallback response
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html'); // Fallback to index.html for navigation requests
        }
      });
    })
  );
});