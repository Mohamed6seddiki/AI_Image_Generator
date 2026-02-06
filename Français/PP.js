document.addEventListener('DOMContentLoaded', function () {
    console.log("Page loaded successfully!");
    
    // ربط الأزرار الرئيسية
    const aiBtn = document.getElementById('ai-btn');
    const imgBtn = document.getElementById('img-btn');
    
    if (aiBtn) {
        aiBtn.addEventListener('click', function () {
            console.log("AI button clicked");
            window.location.href = 'AI.html';
        });
    }
    
    if (imgBtn) {
        imgBtn.addEventListener('click', function () {
            console.log("Image Editor button clicked");
            window.location.href = 'IMGEditor.html';
        });
    }
    
    // إدارة قسم التواصل
    const contactBtn = document.getElementById("contact-btn");
    const socialLinks = document.getElementById("social-links");
    const backBtn = document.getElementById("back-btn");
    
    console.log("Contact button:", contactBtn);
    console.log("Social links:", socialLinks);
    console.log("Back button:", backBtn);
    
    if (contactBtn && socialLinks && backBtn) {
        // إخفاء الروابط الاجتماعية في البداية
        socialLinks.classList.remove('visible');
        backBtn.classList.remove('visible');
        
        // حدث الضغط على زر التواصل
        contactBtn.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("Contact button clicked!");
            
            // إخفاء زر التواصل
            contactBtn.classList.add('hidden');
            
            // إظهار الروابط الاجتماعية
            socialLinks.classList.add('visible');
            
            // إظهار زر الرجوع
            backBtn.classList.add('visible');
            
            // تحريك الشاشة لأسفل
            setTimeout(() => {
                socialLinks.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        });
        
        // حدث الضغط على زر الرجوع
        backBtn.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("Back button clicked!");
            
            // إخفاء الروابط الاجتماعية
            socialLinks.classList.remove('visible');
            
            // إخفاء زر الرجوع
            backBtn.classList.remove('visible');
            
            // إظهار زر التواصل
            contactBtn.classList.remove('hidden');
            
            // العودة للأعلى
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        });
    } else {
        console.error("One or more elements not found!");
    }
});

// وظائف عرض/إخفاء الصور الخلفية
function showImage(side) {
    const element = document.querySelector(`.${side}`);
    if (element) {
        element.classList.add('visible');
    }
}

function hideImage(side) {
    const element = document.querySelector(`.${side}`);
    if (element) {
        element.classList.remove('visible');
    }
}

// إضافة تأثير عند التمرير
window.addEventListener('scroll', function() {
    const dwayra = document.querySelector('.DWAYRA');
    if (dwayra) {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 100) {
            dwayra.style.opacity = '0.7';
        } else {
            dwayra.style.opacity = '1';
        }
    }
});
