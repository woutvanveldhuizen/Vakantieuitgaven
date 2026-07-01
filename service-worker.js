// Vakantie-uitgaven service worker
const CACHE_NAME = "vakantie-uitgaven-v2-1-2-koersfix";
const APP_FILES = ["./","index.html","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(key=>key!==CACHE_NAME?caches.delete(key):null))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;const request=event.request;const url=new URL(request.url);if(url.origin!==self.location.origin){event.respondWith(fetch(request));return}if(request.mode==="navigate"||url.pathname.endsWith("/")||url.pathname.endsWith("/index.html")){event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put("index.html",copy));return response}).catch(()=>caches.match("index.html")));return}event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));return response})))});
self.addEventListener("message",event=>{if(event.data&&event.data.type==="SKIP_WAITING")self.skipWaiting()});
