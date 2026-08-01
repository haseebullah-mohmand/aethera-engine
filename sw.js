// sw.js - Offline Cache Engine
const CACHE_NAME = 'aethera-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/engine.js',
    '/js/webgpu-check.js'
];

// د فایلونو خوندي کول په براوزر حافظه کې
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// بې انټرنیټه د اپلیکیشن وړاندې کول (Offline First)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request);
        })
    );
});