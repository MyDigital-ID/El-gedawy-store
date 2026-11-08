(()=>{
const K='gidawy_inst_later',ic='assets/images/icon-192x192.png';
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
if(standalone)return;
let ev=null;const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
addEventListener('beforeinstallprompt',e=>{e.preventDefault();ev=e;arm()});
addEventListener('appinstalled',()=>{const b=document.getElementById('instBox');if(b)b.remove();try{localStorage.setItem(K,'9e15')}catch(e){}});
function later(){try{const t=+localStorage.getItem(K)||0;return Date.now()-t<3*864e5}catch(e){return false}}
function arm(){if(later())return;const t=setInterval(()=>{if(!document.getElementById('splash-screen')){clearInterval(t);setTimeout(show,900)}},300)}
function show(){
 if(document.getElementById('instBox'))return;
 const d=document.createElement('div');d.id='instBox';
 d.style.cssText='position:fixed;left:12px;right:12px;bottom:14px;background:#fff;border-radius:18px;box-shadow:0 8px 30px rgba(0,0,0,.35);padding:14px;z-index:100000;display:flex;gap:12px;align-items:center;font-family:Cairo,sans-serif;direction:rtl';
 d.innerHTML=`<img src="${ic}" alt="" style="width:54px;height:54px;border-radius:12px;flex:none"><div style="flex:1;min-width:0"><b style="color:#0a1f5c;font-size:16px">ثبّت التطبيق الآن</b><div style="font-size:12px;color:#555;margin:2px 0 8px">${ios?'اضغط زر المشاركة ثم "إضافة إلى الشاشة الرئيسية"':'تسوّق أسرع وبدون متصفح'}</div><div style="display:flex;gap:8px">${ios?'':'<button id="instYes" style="flex:1;background:#f7931e;color:#fff;border:0;border-radius:10px;padding:8px;font:700 14px Cairo,sans-serif">الآن</button>'}<button id="instLater" style="flex:1;background:#eef1f6;color:#0a1f5c;border:0;border-radius:10px;padding:8px;font:700 14px Cairo,sans-serif">لاحقًا</button></div></div>`;
 document.body.appendChild(d);
 const close=()=>{d.remove();try{localStorage.setItem(K,Date.now())}catch(e){}};
 d.querySelector('#instLater').onclick=close;
 const y=d.querySelector('#instYes');if(y)y.onclick=async()=>{d.remove();if(ev){ev.prompt();try{await ev.userChoice}catch(e){}ev=null}};
}
if(ios)arm();
})();
