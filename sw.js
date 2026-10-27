/* Щоб ігри працювали і без інтернету. Генерується tools/build.py — руками не правити. */
const CACHE = "petro-5e760ceb64";
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "mavpochka-banany.html",
  "budivnytstvo.html",
  "vantazhnyi-potiah.html",
  "kotiacha-kukhnia.html",
  "assets/apple.webp",
  "assets/banana.webp",
  "assets/bg.jpg",
  "assets/blueberries.webp",
  "assets/bowl.webp",
  "assets/broccoli.webp",
  "assets/butter.webp",
  "assets/carrot.webp",
  "assets/cat_happy.webp",
  "assets/cat_open.webp",
  "assets/champignon.webp",
  "assets/cheese.webp",
  "assets/cherries.webp",
  "assets/chocolate.webp",
  "assets/cookie.webp",
  "assets/corn.webp",
  "assets/cucumber.webp",
  "assets/d_cake.webp",
  "assets/d_cookie.webp",
  "assets/d_donut.webp",
  "assets/d_fish.webp",
  "assets/d_icecream.webp",
  "assets/d_meat.webp",
  "assets/d_mushroom.webp",
  "assets/d_pasta.webp",
  "assets/d_soup.webp",
  "assets/drumstick.webp",
  "assets/egg.webp",
  "assets/garlic.webp",
  "assets/ham.webp",
  "assets/honey.webp",
  "assets/knife.webp",
  "assets/lemon.webp",
  "assets/lettuce.webp",
  "assets/olives.webp",
  "assets/onion.webp",
  "assets/peach.webp",
  "assets/pear.webp",
  "assets/pepper.webp",
  "assets/potato.webp",
  "assets/raspberry.webp",
  "assets/spoon.webp",
  "assets/steak.webp",
  "assets/strawberry.webp",
  "assets/tomato.webp",
  "assets/watermelon.webp",
  "assets/whisk.webp",
  "assets/zucchini.webp"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* спершу збережена копія (гра відкривається миттєво й офлайн), оновлення тягнеться у фоні */
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; });
    return hit || net.catch(() => c.match("./"));
  })));
});
