async function generateImage() {
  const input = document.getElementById("input");
  const rawValue = input.value.trim();
  
  if (!rawValue) {
    alert("⚠️ الرجاء كتابة وصف للصورة");
    return;
  }

  const divs = [
    document.getElementById("div1"),
    document.getElementById("div2"),
    document.getElementById("div3")
  ];

  // تنظيف وإظهار تحميل
  divs.forEach(div => {
    div.innerHTML = '<div style="color:#666; padding:20px;">⏳ جاري إنشاء الصورة...</div>';
  });

  // الصور المحلية
  const value = rawValue.toLowerCase();
  const localImages = { samy: "SAMY", anis: "ANIS", mili: "mili" };

  if (localImages[value]) {
    divs.forEach((div, i) => {
      const img = new Image();
      img.style.cssText = "width:100%; opacity:0; transition:opacity 0.5s; border-radius:8px;";
      img.src = `${localImages[value]}${i + 1}.jpg`;
      img.onload = () => {
        div.innerHTML = "";
        div.appendChild(img);
        setTimeout(() => img.style.opacity = "1", 10);
      };
      img.onerror = () => {
        div.innerHTML = '<div style="color:red;">❌ الصورة غير موجودة</div>';
      };
    });
    return;
  }

  // توليد صور AI - استخدام APIs متعددة للاحتياطية
  const apis = [
    // Pollinations مع معاملات محسّنة
    (prompt, seed) => `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&seed=${seed}&model=flux&nologo=true`,
    
    // Hugging Face Inference API (احتياطي)
    (prompt, seed) => `https://api.unsplash.com/photos/random?query=${encodeURIComponent(prompt)}&client_id=demo&w=512&h=512`,
    
    // Picsum للاختبار
    (prompt, seed) => `https://picsum.photos/seed/${seed}/512/512`
  ];

  divs.forEach((div, i) => {
    const seed = Date.now() + i * 5000;
    const img = new Image();
    
    img.style.cssText = "width:100%; opacity:0; transition:opacity 0.5s; border-radius:8px;";
    
    let apiIndex = 0;
    
    const tryNextAPI = () => {
      if (apiIndex >= apis.length) {
        div.innerHTML = `
          <div style="color:orange; padding:20px; text-align:center;">
            ⚠️ فشل التحميل<br>
            <small>جرب كلمات مختلفة</small>
          </div>
        `;
        return;
      }
      
      const url = apis[apiIndex](rawValue, seed);
      console.log(`Trying API ${apiIndex + 1}:`, url); // للتشخيص
      
      img.src = url;
      apiIndex++;
    };
    
    img.onload = () => {
      div.innerHTML = "";
      div.appendChild(img);
      setTimeout(() => img.style.opacity = "1", 10);
    };
    
    img.onerror = () => {
      console.error(`API ${apiIndex} failed`);
      tryNextAPI(); // جرب API التالي
    };
    
    tryNextAPI(); // ابدأ بأول API
  });
}

// ربط Enter
document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
