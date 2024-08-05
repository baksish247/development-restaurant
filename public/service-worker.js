self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('billing-cache').then(cache => {
        return cache.addAll([
          '/',
          '/billing',  // Assuming your billing section is at this route
          '/_next/static/chunks/main.js',
          '/_next/static/chunks/pages/_app.js',
          '/_next/static/chunks/pages/_error.js',
          // Add other static assets or routes you need to cache
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  