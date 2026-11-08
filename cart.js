(()=>{
const KEY='gidawy_cart',WA='201001860754';
let cart=[];try{cart=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){}
const $=s=>document.querySelector(s);
const tot=()=>cart.reduce((s,i)=>s+i.price*i.qty,0),cnt=()=>cart.reduce((s,i)=>s+i.qty,0);
function toast(t){const d=document.createElement('div');d.textContent=t;d.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#0a1f5c;color:#fff;padding:10px 20px;border-radius:20px;z-index:9999;font:700 14px Cairo,sans-serif';document.body.append(d);setTimeout(()=>d.remove(),1800)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}render()}
function add(code,name,price){const i=cart.find(x=>x.code===code);i?i.qty++:cart.push({code,name,price:+price,qty:1});save();toast('تمت الإضافة: '+name)}
window.addToCart=add;
window.addOfferToCart=(name,price)=>add('OFFER_'+name,name,price);
function render(){
 if(!$('#cbar'))return;
 $('#cbar').classList.toggle('show',cnt()>0);
 $('#cbarCnt').textContent=cnt();$('#cbarTot').textContent=tot();$('#csTot').textContent=tot();
 document.querySelectorAll('#cart-count').forEach(e=>e.textContent=cnt());
 $('#csItems').innerHTML=cart.length?cart.map((i,k)=>`<div class="cs-row"><div class="cs-name">${i.name}<small>${i.price} ج.م × ${i.qty} = ${i.price*i.qty} ج.م</small></div><div class="cs-qty"><button data-a="m" data-i="${k}">−</button><b>${i.qty}</b><button data-a="p" data-i="${k}">+</button></div><button class="cs-del" data-a="d" data-i="${k}" aria-label="حذف">✕</button></div>`).join(''):'<p class="cs-empty">السلة فاضية</p>';
 if(!cart.length)$('#csheet').classList.remove('open');
}
document.addEventListener('DOMContentLoaded',()=>{
 document.body.insertAdjacentHTML('beforeend','<div id="cbar"><button id="cbarBtn"><span>🛒 <b id="cbarCnt">0</b> منتج</span><span>الإجمالي: <b id="cbarTot">0</b> ج.م ▲</span></button></div><div id="csheet"><div class="cs-box"><div class="cs-head"><b>🛒 سلة المشتريات</b><button id="csClose">✕</button></div><div id="csItems"></div><div class="cs-foot"><div>الإجمالي: <span id="csTot">0</span> ج.م</div><button id="csWa">إرسال الطلب عبر واتساب</button><button id="csClear">إفراغ السلة</button></div></div></div>');
 const open=()=>{if(cart.length)$('#csheet').classList.add('open');else toast('السلة فاضية')};
 $('#cbarBtn').onclick=open;$('#csClose').onclick=()=>$('#csheet').classList.remove('open');
 $('#csheet').onclick=e=>{if(e.target.id==='csheet')e.target.classList.remove('open')};
 const hb=$('#cartBtn');if(hb)hb.onclick=open;
 $('#csItems').onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=+b.dataset.i,a=b.dataset.a;
  if(a==='p')cart[k].qty++;else if(a==='m'){if(--cart[k].qty<1)cart.splice(k,1)}else if(a==='d')cart.splice(k,1);save()};
 $('#csClear').onclick=()=>{cart=[];save()};
 $('#csWa').onclick=()=>{if(!cart.length)return;let m='طلب جديد من موقع الجداوي:\n\n';cart.forEach(i=>m+=`- ${i.name} (عدد: ${i.qty}) = ${i.price*i.qty} ج.م\n`);m+=`\nالإجمالي: ${tot()} ج.م`;window.open(`https://wa.me/${WA}?text=${encodeURIComponent(m)}`,'_blank')};
 render();
});
})();
