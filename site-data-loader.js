// دالة تحميل بيانات الموقع من ملف site-data.json
async function loadSiteData() {
    try {
        const response = await fetch('site-data.json');
        if (!response.ok) return; // لو الملف مش موجود، منعملش حاجة
        
        const data = await response.json();

        // 1. تحديث صورة البانر لو اتغيرت
        if (data.banner) {
            const bannerImg = document.querySelector('.banner-img');
            if (bannerImg) bannerImg.src = data.banner;
        }

        // 2. تحديث صور الأقسام لو اتغيرت
        if (data.categories) {
            document.querySelectorAll('.category-card').forEach(card => {
                const url = data.categories[card.getAttribute('data-id')];
                const old = card.querySelector('img') || card.querySelector('.cat-ico');
                if (url && old) { const i = document.createElement('img'); i.src = url; i.alt = ''; old.replaceWith(i); }
            });
        }

        // 3. تحديث العروض والخصومات
        if (data.offers && data.offers.length > 0) {
            const offersWrapper = document.querySelector('.offersSwiper .swiper-wrapper');
            if (offersWrapper) {
                offersWrapper.innerHTML = ''; // تفريغ العروض القديمة
                data.offers.forEach(offer => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.innerHTML = `
                        <div class="offer-card" onclick="addOfferToCart('${offer.title.replace(/'/g, "\\'")}', ${offer.price})">
                            <img src="${offer.img}" alt="${offer.title}">
                            <div class="offer-details">
                                <h3>${offer.title}</h3>
                                <p>${offer.desc}</p>
                                <span class="offer-price">${offer.price} <small>ج.م ${offer.oldPrice ? 'بدلاً من ' + offer.oldPrice : ''}</small></span>
                            </div>
                        </div>
                    `;
                    offersWrapper.appendChild(slide);
                });
                
                // تحديث السلايدر عشان يقرا العروض الجديدة
                if (window.offersSwiper) {
                    window.offersSwiper.update();
                }
            }
        }

    } catch (error) {
        console.log("لا توجد بيانات مخصصة، سيتم استخدام البيانات الافتراضية.");
    }
}

// تشغيل الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadSiteData);