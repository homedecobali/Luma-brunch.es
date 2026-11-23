/* LUMA Kassa – service worker: de app werkt ook zonder internet.
   App-bestanden: eerst netwerk (altijd de nieuwste versie), anders uit de cache.
   Foto's en lettertypes: eerst cache. Verhoog VERSION bij elke release. */
const VERSION = "kassa-v1";
const CORE = ["./", "index.html", "css/app.css", "js/config.js", "js/i18n.js", "js/store.js", "js/fiscal.js", "js/app.js", "js/seed.js",
  "vendor/qrcode-generator.js", "manifest.webmanifest", "../assets/menu.js", "../assets/img/mark-cream.png", "../assets/img/wordmark-cream.png",
  "../assets/img/wordmark-green.png", "../assets/img/leaves.jpg", "../assets/img/favicon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  const cacheFirst = /\.(jpg|png|woff2?)$/.test(url.pathname) || url.host.includes("fonts.g");
  if (cacheFirst) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { const cp = res.clone(); caches.open(VERSION).then((c) => c.put(req, cp)); return res; })));
  } else if (url.origin === location.origin) {
    e.respondWith(fetch(req).then((res) => { const cp = res.clone(); caches.open(VERSION).then((c) => c.put(req, cp)); return res; }).catch(() => caches.match(req, { ignoreSearch: true })));
  }
});
