const CACHE_NAME = "static-v4";
const ASSETS_TO_CACHE = [
  // HTML-Seiten
  "/retro/index.html",
  "/retro/hauptseite.html",
  "/retro/impressum.html",

  // CSS
  "/retro/style.css",
  "/retro/main-style.css",
  "/retro/reinitialize_animation.css",
  "/retro/info-style.css",

  // JavaScript-Dateien
  "/retro/javascript/app.js",
  "/retro/javascript/scan-animation.js",
  "/retro/javascript/sensor-permission.js",
  "/retro/javascript/info-handler.js",
  "/retro/javascript/reinitialize_animation.js",
  "/retro/javascript/inspectionmode.js",
  "/retro/javascript/haptics.js",


  // Bibliotheken
  "/retro/libs/v1_7/aframe-v1.7.0.min.js",
  "/retro/libs/v1_7/mindar-image-aframe.prod.js",
  "/retro/libs/v1_7/mindar-face-aframe.prod.js",
  "/retro/libs/v1_6/aframe-v1.6.0.min.js",
  "/retro/libs/v1_6/mindar-image-aframe.prod.js",
  "/retro/libs/v1_6/mindar-face-aframe.prod.js",


  // Icons & Favicon
  "/retro/assets/icons/favicon-16x16.png",
  "/retro/assets/icons/favicon-32x32.png",
  "/retro/assets/icons/favicon-192x192.png",
  "/retro/assets/icons/apple-touch-icon.png",

  // Bilder & Hintergrundgrafiken
  "/retro/assets/images/bg_start.webp",

  // Fonts
  "/retro/assets/fonts/orbitron-v31-latin-800.woff2",
  "/retro/assets/fonts/orbitron-v31-latin-500.woff2",
  "/retro/assets/fonts/orbitron-v31-latin-regular.woff2",

  // 3D-Modelle
  "/retro/assets/models/planetsystem.glb",
  "/retro/assets/models/energy.glb",
  "/retro/assets/models/flugzeug.glb",
  "/retro/assets/models/planet_normal.glb",
  "/retro/assets/models/planet_zerstoert.glb",
  "/retro/assets/models/planet_krank.glb",
  "/retro/assets/models/maske1.glb",
  "/retro/assets/models/maske2.glb",
  "/retro/assets/models/cyber.glb",
  "/retro/assets/models/solar.glb",
  "/retro/assets/models/cover.glb",
  "/retro/assets/models/scans.glb",


  // Tracking-Dateien für MindAR
  "/retro/tracking/targets.mind",

  // JSON-Daten für Modelle
  "/retro/JSON/info.json",
  "/retro/JSON/manifest.json",
];

// INSTALL: Cache alle wichtigen Dateien
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map((url) => {
          // Führe den fetch-Vorgang durch und logge den Status
          return fetch(url)
            .then((response) => {
              if (response.ok) {
                console.log(`Caching successful: ${url}`);
                return cache.put(url, response);
              } else {
                console.error(`Failed to fetch: ${url}`);
                return Promise.reject(`Failed to fetch: ${url}`);
              }
            })
            .catch((error) => {
              console.error(`Failed to cache ${url}:`, error);
            });
        })
      );
    })
  );
  self.skipWaiting();
});

// ACTIVATE: Alte Caches löschen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      );
    })
  );
  self.clients.claim();
});

// FETCH: Cache-First mit Netzwerk-Update
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match("/retro/index.html");
        });
    })
  );
});
