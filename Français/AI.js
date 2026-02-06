async function generateImage() {
  const input = document.getElementById("input");
  let rawValue = input.value.trim();
  
  if (!rawValue) {
    alert("⚠️ اكتب وصف الصورة");
    return;
  }

  const divs = [
    document.getElementById("div1"),
    document.getElementById("div2"),
    document.getElementById("div3")
  ];

  divs.forEach(div => {
    div.innerHTML = '<div style="color:#666; padding:20px;">⏳ جاري التوليد...</div>';
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
      img.onerror = () => div.innerHTML = "❌ غير موجودة";
    });
    return;
  }

  // ترجمة
  const translations = {
    'قط': 'cat', 'كلب': 'dog', 'قلم': 'pen', 'سيارة': 'car',
    'منزل': 'house', 'شجرة': 'tree', 'زهرة': 'flower',
    'بحر': 'ocean', 'جبل': 'mountain', 'سماء': 'sky'
  };
  
  let prompt = rawValue;
  Object.keys(translations).forEach(ar => {
    prompt = prompt.replace(new RegExp(ar, 'gi'), translations[ar]);
  });

  // استخدام Unsplash للصور الحقيقية (يعمل بدون API key)
  try {
    const response = await fetch(
      `https://source.unsplash.com/random/512x512/?${encodeURIComponent(prompt)}`
    );
    
    if (response.ok) {
      for (let i = 0; i < divs.length; i++) {
        const img = new Image();
        img.style.cssText = "width:100%; opacity:0; transition:opacity 0.5s; border-radius:8px;";
        
        // إضافة timestamp لجعل كل صورة مختلفة
        img.src = `https://source.unsplash.com/random/512x512/?${encodeURIComponent(prompt)}&sig=${Date.now() + i}`;
        
        img.onload = () => {
          divs[i].innerHTML = "";
          divs[i].appendChild(img);
          setTimeout(() => img.style.opacity = "1", 50);
        };
        
        img.onerror = () => {
          divs[i].innerHTML = '<div style="color:red;">❌ فشل التحميل</div>';
        };
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  } catch (error) {
    divs.forEach(div => {
      div.innerHTML = '<div style="color:red;">❌ خطأ في الاتصال</div>';
    });
  }
}

document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
