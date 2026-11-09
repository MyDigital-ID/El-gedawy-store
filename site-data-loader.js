const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
window.applyCats=function(){const d=window.siteData;if(!d||!d.categories)return;
 document.querySelectorAll('.category-card').forEach(card=>{const url=d.categories[card.getAttribute('data-id')];if(!url)return;
  const cur=card.querySelector('img');if(cur&&cur.getAttribute('src')===url)return;
  const old=cur||card.querySelector('.cat-ico');if(old){const i=document.createElement('img');i.src=url;i.alt='';old.replaceWith(i)}})};
async function loadSiteData(){
 try{
  const r=await fetch('site-data.json',{cache:'no-store'});if(!r.ok)return;
  const data=await r.json();window.siteData=data;
  if(data.banner){const b=document.querySelector('.banner-img');if(b)b.src=data.banner}
  applyCats();
  if(data.featured&&data.featured.length){try{
   const el=document.querySelector('.mySwiper'),w=el&&el.querySelector('.swiper-wrapper');
   if(w){
    try{if(window.featSwiper&&window.featSwiper.destroy)window.featSwiper.destroy(true,true)}catch(e){}
    el.swiper=undefined;
    w.innerHTML=data.featured.map(f=>`<div class="swiper-slide"><div class="product-card"><img src="${esc(f.img)}" alt=""><h3>${esc(f.title)}</h3>${f.showPrice===true?`<span>${esc(f.price)} ج.م</span>`:''}</div></div>`).join('');
    if(typeof Swiper!=='undefined')window.featSwiper=new Swiper('.mySwiper',{effect:'coverflow',grabCursor:true,centeredSlides:true,slidesPerView:'auto',loop:true,coverflowEffect:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:true},pagination:{el:'.mySwiper .swiper-pagination'},autoplay:{delay:3000,disableOnInteraction:false}});
   }
  }catch(e){console.log('featured',e)}}
  if(data.offers&&data.offers.length){
   const w=document.querySelector('.offersSwiper .swiper-wrapper');
   if(w){w.innerHTML='';data.offers.forEach(o=>{const s=document.createElement('div');s.className='swiper-slide';
    s.innerHTML=`<div class="offer-card" onclick="addOfferToCart('${String(o.title).replace(/'/g,"\\'")}', ${Number(o.price)||0})"><img src="${esc(o.img)}" alt="${esc(o.title)}"><div class="offer-details"><h3>${esc(o.title)}</h3><p>${esc(o.desc)}</p><span class="offer-price">${esc(o.price)} <small>ج.م ${o.oldPrice?'بدلاً من '+esc(o.oldPrice):''}</small></span></div></div>`;
    w.appendChild(s)});
    if(window.offersSwiper)window.offersSwiper.update()}
  }
 }catch(e){console.log('لا توجد بيانات مخصصة، سيتم استخدام البيانات الافتراضية.')}
}
document.addEventListener('DOMContentLoaded',loadSiteData);
