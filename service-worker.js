const CACHE_NAME = "imt-cache-v10";

/* CORE + APP FILES */
const FILES = [
  "/",
  "/index.html",
  "/inscription.html",
  "/dashboard.html",
  "/rapport.html",
  "/manifest.json",
  "/script.js",
  "/dashboard.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
  // ❌ service-worker.js ESORINA amin cache (important)
];

/* INSTALL */
self.addEventListener("install", (event) => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {

      // SAFE CACHE (miala amin crash raha misy fichier tsy hita)
      return Promise.allSettled(
        FILES.map((file) => cache.add(file))
      );

    })
  );

});

/* ACTIVATE */
self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();

});

/* FETCH (OFFLINE SAFE) */
self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") return;

  // 👉 NAVIGATION (HTML PAGES) - important ho an'ny routing offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {

        const clone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });

        return response;

      })
      .catch(() => caches.match(event.request))
  );

});