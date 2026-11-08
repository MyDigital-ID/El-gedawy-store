document.addEventListener("DOMContentLoaded", () => {
    
    // زر الرجوع: ما نخرجش من الموقع (يقفل السلة/القائمة لو مفتوحين)
    history.pushState({a:1},'');
    window.addEventListener('popstate',()=>{
        const sh=document.getElementById('csheet'),sb=document.getElementById('sidebar');
        if(sh&&sh.classList.contains('open'))sh.classList.remove('open');
        else if(sb&&sb.classList.contains('open'))sb.classList.remove('open');
        history.pushState({a:1},'');
    });
    // شاشة البداية بالفيديو: أول زيارة في الجلسة أو من أيقونة البيت، وتختفي بتأثير fadeOut
    const splash=document.getElementById('splash-screen'),sv=document.getElementById('splashVid');
    let seen=false;try{seen=sessionStorage.getItem('splashSeen')==='1'}catch(e){}
    if(splash&&seen&&location.search.indexOf('splash=1')<0){splash.remove()}
    else if(splash){
        try{sessionStorage.setItem('splashSeen','1')}catch(e){}
        let done=false;
        const hideSplash=()=>{if(done)return;done=true;splash.classList.add('hidden');setTimeout(()=>splash.remove(),1200)};
        if(sv){sv.addEventListener('ended',hideSplash);sv.addEventListener('error',hideSplash);const p=sv.play();if(p&&p.catch)p.catch(hideSplash)}
        setTimeout(hideSplash,sv?6000:3000);
        
    }

    // =========================================
    // 3. تشغيل السلايدر (الصور المميزة والعروض)
    // =========================================
    if (typeof Swiper !== 'undefined') {
        var swiper = window.featSwiper = new Swiper(".mySwiper", {
            effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", loop: true,
            coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
            pagination: { el: ".swiper-pagination" }, autoplay: { delay: 3000, disableOnInteraction: false }
        });

        // تخزين السلايدر في متغير عام عشان site-data-loader يقدر يحدثه
        window.offersSwiper = new Swiper(".offersSwiper", {
            effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", loop: true,
            coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
            pagination: { el: ".swiper-pagination" },
        });
    }

    // =========================================
    // 4. توليد الأقسام من ملف products.json
    // =========================================
    const categoriesGrid = document.getElementById('categoriesGrid');
    if(categoriesGrid) {
        const catIco={tissues:'🧻',personal_care:'🧴',cleaners:'🧼',laundry:'👕',dishwash:'🧽',airfresh:'🌸',diapers_paste:'👶',tableware:'🍽️',tablecloths:'🧺',garbage:'🗑️',incense:'🪔',soap:'🧼',haircare:'💇',bodycare:'🚿',pesticides:'🪲',homeclean:'🧹',furniture:'🛋️',misc:'📦'};
        const grads=['linear-gradient(135deg,#0a1f5c,#1b4fc2)','linear-gradient(135deg,#f7931e,#ffc82c)','linear-gradient(135deg,#1b4fc2,#38b6ff)','linear-gradient(135deg,#e63946,#f7931e)'];

        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                let n=0;for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const cat = data[key];
                        const g=grads[n++%grads.length];
                        const card = document.createElement('div');
                        card.className = 'category-card';
                        card.onclick = () => window.location.href = `category.html?id=${key}`;
                        // بنضيف data-id عشان site-data-loader يقدر يلاقي الصورة ويغيرها
                        card.setAttribute('data-id', key);
                        card.innerHTML = `<div class="cat-ico" style="background:${g}">${catIco[key]||'🛒'}</div><div class="cat-title">${cat.title}</div>`;
                        categoriesGrid.appendChild(card);window.applyCats&&window.applyCats();
                    }
                }
            }).catch(err => console.error(err));
    }

    // القائمة الجانبية
    const menuBtn=document.getElementById('menuBtn'),sidebar=document.getElementById('sidebar'),closeMenuBtn=document.getElementById('closeMenu');
    if(menuBtn)menuBtn.addEventListener('click',()=>sidebar.classList.add('open'));
    if(closeMenuBtn)closeMenuBtn.addEventListener('click',()=>sidebar.classList.remove('open'));
    // البحث في كل المنتجات
    const sIn=document.getElementById('searchInput');
    if(sIn){
        const box=document.createElement('div');box.id='searchResults';
        sIn.closest('.search-container').after(box);
        const nz=s=>String(s||'').toLowerCase().replace(/[\u064b-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
        const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
        let all=null,list=[];
        const load=()=>all?Promise.resolve(all):fetch('products.json').then(r=>r.json()).then(d=>{all=[];for(const k in d)d[k].products.forEach(p=>all.push({p,cat:d[k].title,n:nz(p.name)}));return all}).catch(()=>[]);
        sIn.addEventListener('focus',load);
        sIn.addEventListener('input',async()=>{
            const q=nz(sIn.value).trim();
            if(!q){box.innerHTML='';box.classList.remove('open');return}
            await load();
            const ws=q.split(/\s+/);
            list=(all||[]).filter(x=>ws.every(w=>x.n.includes(w))).slice(0,40);
            box.classList.add('open');
            box.innerHTML=list.length?list.map((x,i)=>`<div class="sr-row">${x.p.image?`<img src="${x.p.image}" alt="">`:''}<div class="sr-info"><b>${esc(x.p.name)}</b><small>${esc(x.cat)} — ${x.p.price} ج.م</small></div><button data-i="${i}" aria-label="إضافة للسلة">＋</button></div>`).join(''):'<p class="sr-empty">لا توجد نتائج</p>';
        });
        box.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const x=list[+b.dataset.i];if(x&&window.addToCart)addToCart(x.p.code,x.p.name,x.p.price)});
    }
});
