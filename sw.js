const CACHE_NAME = "static-v4";
const ASSETS_TO_CACHE = [
  // HTML-Seiten
  "./index.html",
  "./hauptseite.html",
  "./impressum.html",
  "./facetracking.html",

  // CSS
  "./style.css",
  "./main-style.css",
  "./reinitialize_animation.css",
  "./inspectionmode.css",
  "./info-style.css",
  "./tryon.css",


  // JavaScript-Dateien
  "./javascript/app.js",
  "./javascript/scan-animation.js",
  "./javascript/sensor-permission.js",
  "./javascript/info-handler.js",
  "./javascript/reinitialize_animation.js",
  "./javascript/inspectionmode.js",
  "./javascript/haptics.js",
  "./javascript/background-music.js",
  "./javascript/tryon.js",


  // Bibliotheken

  "./libs/v1_7/aframe-v1.7.0.js",
  "./libs/v1_7/aframe-v1.7.0.js.map",
  "./libs/v1_7/aframe-v1.7.0.min.js",
  "./libs/v1_7/aframe-v1.7.0.min.js.map",
  "./libs/v1_7/aframe-v1.7.0.module.min.js",
  "./libs/v1_7/aframe-v1.7.0.module.min.js.map",
  "./libs/v1_7/mindar-image-aframe.prod.js",
  "./libs/v1_7/mindar-face-aframe.prod.js",
  "./libs/v1_6/aframe-v1.6.0.js",
  "./libs/v1_6/aframe-v1.6.0.js.map",
  "./libs/v1_6/aframe-v1.6.0.min.js",
  "./libs/v1_6/aframe-v1.6.0.min.js.map",
  "./libs/v1_6/mindar-image-aframe.prod.js",
  "./libs/v1_6/mindar-face-aframe.prod.js",

  // Sounds
  "./assets/sounds/abbruch1.mp3",
  "./assets/sounds/abbruch2.mp3",
  "./assets/sounds/background2.mp3",
  "./assets/sounds/click.mp3",
  "./assets/sounds/close.mp3",
  "./assets/sounds/error.mp3",
  "./assets/sounds/open.mp3",
  "./assets/sounds/show.mp3",
  "./assets/sounds/success.mp3",

  // Icons & Favicon
  "./assets/icons/favicon-16x16.png",
  "./assets/icons/favicon-32x32.png",
  "./assets/icons/favicon-192x192.png",
  "./assets/icons/favicon-512x512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon.ico",
  "./assets/icons/icon1a.png",
  "./assets/icons/icon1b.png",
  "./assets/icons/icon2a.png",
  "./assets/icons/icon2b.png",
  "./assets/icons/icon3a.png",
  "./assets/icons/icon3b.png",
  "./assets/icons/icon4a.png",
  "./assets/icons/icon4b.png",  
  "./assets/icons/icon5a.png",
  "./assets/icons/icon5b.png",

  //Screenshots
  "./assets/screenshots/screenshot1.png",
  "./assets/screenshots/screenshot2.png",

  // Bilder & Hintergrundgrafiken
  "./assets/images/bg_start.webp",
  "./assets/images/bg_facetrack.webp",
  "./assets/images/bg_facetrack2.webp",
  "./assets/images/bg_start.webp",
  "./assets/images/speaker_on.webp",
  "./assets/images/speaker_off.webp",

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
  "./assets/models/planet_gesund.glb",
  "./assets/models/maske1.glb",
  "./assets/models/maske2.glb",
  "./assets/models/cyber.glb",
  "./assets/models/solar.glb",
  "./assets/models/cover.glb",
  "./assets/models/scans.glb",
  "./assets/models/headOccluder.glb",




  // Tracking-Dateien für MindAR
  "./tracking/targets.mind",

  // JSON-Daten für Modelle
  "./JSON/info.json",
  "./JSON/manifest.json",
  "./JSON/models.json",

];

// INSTALL: Cache alle wichtigen Dateien
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (let i = 0; i < ASSETS_TO_CACHE.length; i++) {
        try {
          const response = await fetch(ASSETS_TO_CACHE[i]);
          if (response.ok) {
            await cache.put(ASSETS_TO_CACHE[i], response);
            console.log(`✅ Erfolgreich gecached: ${ASSETS_TO_CACHE[i]}`);
          } else {
            console.warn(`⚠️ Fehler beim Cachen: ${ASSETS_TO_CACHE[i]}`);
          }
        } catch (error) {
          console.error(`❌ Netzwerkfehler bei ${ASSETS_TO_CACHE[i]}:`, error);
        }
      }
    })()
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
                const url = event.request.url;
                if (url.includes("mediapipe") || url.includes("cdn.jsdelivr.net")) {
                    console.warn(`🚫 Mediapipe/CDN Datei nicht gecached: ${url}`);
                    return networkResponse; // Datei wird nicht gespeichert, nur weitergeleitet
                } else {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }
            });
          }).catch(() => {
              return caches.match("./index.html");
              
          });
      })
  );
});