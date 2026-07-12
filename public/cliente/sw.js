// Service worker mínimo del Panel de Cliente. Vive en /cliente/ para que su
// scope por defecto sea /cliente/ (el scope de un SW es el directorio de su
// propia URL si no se pasa `scope` explícito al registrar).
//
// No cachea HTML ni respuestas de API: son datos autenticados del CRM,
// cachearlos sería un riesgo de fuga entre sesiones/usuarios. Solo cachea el
// propio shell PWA (manifest + íconos) y pasa la red para todo lo demás.
const CACHE = 'kristall-cliente-shell-v1'
const PRECACHE_URLS = ['/manifest-cliente.json', '/icon-cliente-192.png', '/icon-cliente-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE_URLS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
})
