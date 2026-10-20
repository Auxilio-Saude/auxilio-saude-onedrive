// Auxílio-Saúde (OneDrive): guarda o app para abrir sem internet. Sempre tenta a versão nova primeiro.
// Ao publicar uma mudança, aumente o número da VERSAO para os aparelhos trocarem o cache.
const VERSAO = "auxilio-onedrive-v2";
const ARQUIVOS = ["./", "./index.html", "./config.js", "./privacidade.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const c = r.clone(); caches.open(VERSAO).then(x => x.put(e.request, c)); }
    return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
