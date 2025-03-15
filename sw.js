const CACHE_NAME = "static-v4";
const ASSETS_TO_CACHE = [
  // HTML-Seiten
  "./index.html",
  "./hauptseite.html",
  "./impressum.html",

  // CSS
  "./style.css",
  "./main-style.css",
  "./reinitialize_animation.css",
  "./inspectionmode.css",
  "./info-style.css",

  // JavaScript-Dateien
  "./javascript/app.js",
  "./javascript/scan-animation.js",
  "./javascript/sensor-permission.js",
  "./javascript/info-handler.js",
  "./javascript/reinitialize_animation.js",
  "./javascript/inspectionmode.js",
  "./javascript/haptics.js",
  "./javascript/background-music.js",


  // Bibliotheken
  "./libs/v1_7/aframe-v1.7.0.min.js",
  "./libs/v1_7/mindar-image-aframe.prod.js",
  "./libs/v1_7/mindar-face-aframe.prod.js",
  "./libs/v1_6/aframe-v1.6.0.min.js",
  "./libs/v1_6/mindar-image-aframe.prod.js",
  "./libs/v1_6/mindar-face-aframe.prod.js",

  // Sounds
  "./assets/sounds/abbruch1.wav",
  "./assets/sounds/abbruch2.wav",
  "./assets/sounds/background1.wav",
  "./assets/sounds/background2.wav",
  "./assets/sounds/background3.wav",
  "./assets/sounds/click.wav",
  "./assets/sounds/close.wav",
  "./assets/sounds/error.wav",
  "./assets/sounds/open.wav",
  "./assets/sounds/show.wav",
  "./assets/sounds/success.wav",

  // Icons & Favicon
  "./assets/icons/favicon-16x16.png",
  "./assets/icons/favicon-32x32.png",
  "./assets/icons/favicon-192x192.png",
  "./assets/icons/apple-touch-icon.png",

  //Screenshots
  "./assets/screenshots/screenshot1.png",
  "./assets/screenshots/screenshot2.png",

  // Bilder & Hintergrundgrafiken
  "./assets/images/bg_start.webp",

  // Fonts
  "./assets/fonts/orbitron-v31-latin-800.woff2",
  "./assets/fonts/orbitron-v31-latin-500.woff2",
  "./assets/fonts/orbitron-v31-latin-regular.woff2",

  // 3D-Modelle
  "./assets/models/planetsystem.glb",
  "./assets/models/energy.glb",
  "./assets/models/flugzeug.glb",
  "./assets/models/planet_normal.glb",
  "./assets/models/planet_zerstoert.glb",
  "./assets/models/planet_krank.glb",
  "./assets/models/maske1.glb",
  "./assets/models/maske2.glb",
  "./assets/models/cyber.glb",
  "./assets/models/solar.glb",
  "./assets/models/cover.glb",
  "./assets/models/scans.glb",


  // Tracking-Dateien für MindAR
  "./tracking/targets.mind",

  // JSON-Daten für Modelle
  "./JSON/info.json",
  "./JSON/manifest.json",
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
        cacheNames.filter((cache) => cache !== CACHE_NAME).map((cache) => caches.delete(cache))
      );
    })
  );
  self.clients.claim();
  console.log("✅ Service Worker aktiviert & alte Caches gelöscht");
});

// FETCH: Cache-First mit Netzwerk-Update
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
              return cachedResponse;
          }

          return fetch(event.request, {
              headers: {
                  "Range": "bytes=0-" // Verhindert Partial Requests!
              }
          }).then((networkResponse) => {
              if (!networkResponse || !networkResponse.ok || networkResponse.status === 206) {
                  console.warn(`⚠️ Datei kann nicht gespeichert werden: ${url} (Status ${networkResponse.status})`);
                  return networkResponse;
              }

              return caches.open("static-v4").then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
              });
          }).catch(() => {
              return caches.match("./index.html");
          });
      })
  );
});