/* Offline app shell. Keep this file at the site root so it can control every page. */
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

const CACHE_NAME = 'dhaulagiri-school-v1';
const APP_SHELL = [
  './', './index.html', './about.html', './academics.html', './admissions.html',
  './notices.html', './gallery.html', './contact.html', './manifest.json',
  './css/style.css', './js/main.js', './js/notices.js', './js/gallery.js',
  './src/app-icon.svg', './src/school-calendar-2026.jpg',
  './src/Hope special school.jpeg', './src/School_Website_Sales_Guide.pdf'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      return response;
    }).catch(async () => (await caches.match(request)) || caches.match('./index.html')));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  })));
});
