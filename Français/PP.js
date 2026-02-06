// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    
    // زر الذهاب إلى AI
    document.getElementById('ai-btn').addEventListener('click', function() {
        window.location.href = 'AI.html';
    });
    
    // زر الذهاب إلى محرر الصور
    document.getElementById('img-btn').addEventListener('click', function() {
        window.location.href = 'IMGEditor.html';
    });
    
    // زر التواصل
    document.getElementById('contact-btn').addEventListener('click', function() {
        // إخفاء زر التواصل
        this.style.display = 'none';
        
        // إظهار الروابط الاجتماعية
        document.getElementById('social-links').style.display = 'flex';
        
        // إظهار زر الرجوع
        document.getElementById('back-btn').style.display = 'block';
    });
    
    // زر الرجوع
    document.getElementById('back-btn').addEventListener('click', function() {
        // إخفاء زر الرجوع
        this.style.display = 'none';
        
        // إخفاء الروابط الاجتماعية
        document.getElementById('social-links').style.display = 'none';
        
        // إظهار زر التواصل
        document.getElementById('contact-btn').style.display = 'block';
    });
    
    // تأثيرات المرور على الأزرار الرئيسية
    const aiBtn = document.getElementById('ai-btn');
    const imgBtn = document.getElementById('img-btn');
    
    aiBtn.addEventListener('mouseover', function() {
        showImage('left');
    });
    
    aiBtn.addEventListener('mouseout', function() {
        hideImage('left');
    });
    
    imgBtn.addEventListener('mouseover', function() {
        showImage('right');
    });
    
    imgBtn.addEventListener('mouseout', function() {
        hideImage('right');
    });
});

// وظائف عرض وإخفاء الصور
function showImage(side) {
    const element = document.querySelector('.' + side);
    if (element) {
        element.classList.add('active');
    }
}

function hideImage(side) {
    const element = document.querySelector('.' + side);
    if (element) {
        element.classList.remove('active');
    }
}
