// Offline support: cache the app shell on install, serve cache-first,
// and refresh the cache in the background. Bump VERSION on each release.

// Shown to people as prototype v0.1; the build number changes on every release
// so installed copies pick up new files.
const VERSION = "castmaker-v0.1-build7";
const SHELL = [
  "./",
  "index.html",
  "styles.css",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "js/app.js",
  "js/storage.js",
  "js/export.js",
  "js/reveal.js",
  "js/audio.js",
  "js/data/psyche.js",
  "js/data/orientation.js",
  "js/engine/dice.js",
  "js/engine/rarity.js",
  "js/data/rarity.js",
  "js/engine/rng.js",
  "js/engine/text.js",
  "js/engine/generate.js",
  "js/engine/adapters/dnd5e.js",
  "js/prose/provider.js",
  "js/prose/templates.js",
  "js/data/shared.js",
  "js/data/genres/index.js",
  "js/data/genres/fantasy.js",
  "js/data/genres/modern.js",
  "js/data/genres/scifi.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(event.request);
      const network = fetch(event.request)
        .then((res) => {
          if (res.ok && (res.type === "basic" || res.type === "cors")) cache.put(event.request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
