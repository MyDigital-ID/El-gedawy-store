(()=>{
const SK='gidawy_inst_later',IK='gidawy_installed',ic='assets/images/icon-192x192.png',ua=navigator.userAgent;
if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)return;
const ios=/iphone|ipad|ipod/i.test(ua),inapp=/android/i.test(ua)&&/GSA\/|; wv\)|FBAN|FBAV|Instagram|Line\//i.test(ua);
let ev=null,armed=false,shown=false;
const seen=()=>{try{return sessionStorage.getItem(SK)==='1'}catch(e){return false}};
const chrome=()=>{location.href='intent://'+location.host+location.pathname+location.search+'#Intent;scheme=https;package=com.android.chrome;end'};
addEventListener('beforeinstallprompt',e=>{e.preventDefault();ev=e;if(armed){rm();show('native')}});
addEventListener('appinstalled',()=>{rm();try{localStorage.setItem(IK,'1')}catch(e){}});
function rm(){const b=document.getElementById('instBox');if(b)b.remove();shown=false}
function arm(){if(seen())return;const t=setInterval(()=>{if(!document.getElementById('splash-screen')){clearInterval(t);setTimeout(go,900)}},300)}
function go(){armed=true;
 if(ev)return show('native');
 if(inapp)return show('chrome');
 if(ios)return show('ios');
 setTimeout(()=>{if(!ev&&!shown&&!localStorage.getItem(IK))show('manual')},5000)}
function show(m){
 if(shown||seen())return;shown=true;
 const T={native:'تسوّق أسرع وبدون متصفح',chrome:'لتثبيت التطبيق افتح الموقع في متصفح Chrome',ios:'اضغط زر المشاركة ثم "إضافة إلى الشاشة الرئيسية"',manual:'اضغط ⋮ أعلى المتصفح ثم "تثبيت التطبيق"'};
 const bs='border:0;border-radius:10px;padding:8px;font:700 14px Cairo,sans-serif;flex:1;';
 const yes=m==='native'?'الآن':m==='chrome'?'فتح في Chrome':'';
 const d=document.createElement('div');d.id='instBox';
 d.style.cssText='position:fixed;left:12px;right:12px;bottom:14px;background:#fff;border-radius:18px;box-shadow:0 8px 30px rgba(0,0,0,.35);padding:14px;z-index:100000;display:flex;gap:12px;align-items:center;font-family:Cairo,sans-serif;direction:rtl';
 d.innerHTML=`<img src="${ic}" alt="" style="width:54px;height:54px;border-radius:12px;flex:none"><div style="flex:1;min-width:0"><b style="color:#0a1f5c;font-size:16px">ثبّت التطبيق الآن</b><div style="font-size:12px;color:#555;margin:2px 0 8px">${T[m]}</div><div style="display:flex;gap:8px">${yes?`<button id="instYes" style="${bs}background:#f7931e;color:#fff">${yes}</button>`:''}<button id="instLater" style="${bs}background:#eef1f6;color:#0a1f5c">${yes?'لاحقًا':'حسنًا'}</button></div></div>`;
 document.body.appendChild(d);
 d.querySelector('#instLater').onclick=()=>{rm();try{sessionStorage.setItem(SK,'1')}catch(e){}};
 const y=d.querySelector('#instYes');
 if(y)y.onclick=async()=>{if(m==='chrome')return chrome();rm();if(ev){ev.prompt();try{await ev.userChoice}catch(e){}ev=null}};
}
arm();
})();
