/* TenRusl - DocShot · assets/js/sw.js
   NOTE: Because this file lives under /assets/js/, its scope is limited to /assets/.
   It will precache assets and use stale-while-revalidate for them.
   For full offline navigation (/index.html, /pages/*), move SW to site root (e.g., /sw.js).
*/
const SW_VERSION = "docshot-assets-v1.0.0";
const PRECACHE = [
    // CSS
    "/assets/css/app.css",

    // App JS
    "/assets/js/app.js",
    "/assets/js/router.js",
    "/assets/js/validators.js",

    // Plugins (if present)
    "/assets/plugin/html2canvas.min.js",
    "/assets/plugin/jspdf.umd.min.js",
    "/assets/plugin/idb-keyval.min.js",
    "/assets/plugin/tiny-zip.min.js",

    // I18N (optional if you store externally; app.js has inline dict)
    "/assets/i18n/en.json",
    "/assets/i18n/id.json",

    // Images
    "/assets/images/icon.png",
];

self.addEventListener("install", (evt) => {
    evt.waitUntil(
        caches
            .open(SW_VERSION)
            .then((c) => c.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(keys.filter((k) => k !== SW_VERSION).map((k) => caches.delete(k)));
            await self.clients.claim();
        })()
    );
});

// Stale-While-Revalidate strategy for same-origin asset GETs
self.addEventListener("fetch", (evt) => {
    const req = evt.request;
    if (req.method !== "GET") return;

    const url = new URL(req.url);
    if (url.origin !== location.origin) return; // same-origin only
    if (!url.pathname.startsWith("/assets/")) return; // scope safety

    evt.respondWith(
        (async () => {
            const cache = await caches.open(SW_VERSION);
            const cached = await cache.match(req);
            const fetchAndUpdate = fetch(req)
                .then((resp) => {
                    if (resp && resp.ok) cache.put(req, resp.clone());
                    return resp;
                })
                .catch(() => null);

            // If we have cache → return immediately, then update in background
            if (cached) {
                evt.waitUntil(fetchAndUpdate);
                return cached;
            }

            // No cache → try network, else fallback
            const net = await fetchAndUpdate;
            if (net) return net;

            // minimal fallback for missing asset
            return new Response("", { status: 408 });
        })()
    );
});

// Optional message API (from page) to take control / warm cache
self.addEventListener("message", (evt) => {
    if (!evt.data) return;
    if (evt.data.type === "SKIP_WAITING") self.skipWaiting();
    if (evt.data.type === "CACHE_URLS" && Array.isArray(evt.data.urls)) {
        evt.waitUntil(caches.open(SW_VERSION).then((c) => c.addAll(evt.data.urls.filter(Boolean))));
    }
});
