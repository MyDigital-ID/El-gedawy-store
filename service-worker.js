const CACHE='gidawy-v4';
const FILES=['./','./index.html','./category.html','./style.css','./main.js','./cart.js','./foam.js','./site-data-loader.js','./install.js','./assets/images/splash-poster.jpg','./products.json','./site-data.json','./assets/images/banner.jpg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// النت أولاً (عشان الأسعار الجديدة توصل)، والكاش لو النت قطع
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||r.url.endsWith('.mp4')||!r.url.startsWith(self.location.origin))return;
 e.respondWith(fetch(/\.json(\?|$)/.test(r.url)?new Request(r,{cache:'no-store'}):r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c)).catch(()=>{});return res}).catch(()=>caches.match(r,{ignoreSearch:true})));
});
