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
      img.style.cssText = "width:100%; border-radius:8px; opacity:0; transition:opacity 0.5s";
      img.src = `${localImages[value]}${i + 1}.jpg`;
      img.onload = () => {
        div.innerHTML = "";
        div.appendChild(img);
        img.style.opacity = "1";
      };
      img.onerror = () => div.innerHTML = "❌ غير موجودة";
    });
    return;
  }

  // تحسين الـ Prompt تلقائياً
  const improvePrompt = (text) => {
    const qualityWords = "high quality, detailed, 4k, professional";
    
    const translations = {
      'قط': 'cat',
      'كلب': 'dog', 
      'قلم': 'pen',
      'سيارة': 'car',
      'منزل': 'house',
      'شجرة': 'tree',
      'زهرة': 'flower',
      'بحر': 'ocean',
      'جبل': 'mountain',
      'سماء': 'sky'
    };
    
    let improved = text;
    Object.keys(translations).forEach(ar => {
      improved = improved.replace(new RegExp(ar, 'gi'), translations[ar]);
    });
    
    return `${improved}, ${qualityWords}`;
  };

  // توليد الصور
  divs.forEach((div, i) => {
    const seed = Date.now() + i * 2000;
    const enhancedPrompt = improvePrompt(rawValue);
    
    const img = new Image();
    img.style.cssText = "width:100%; border-radius:8px; opacity:0; transition:opacity 0.5s";
    
    // استخدام Pollinations مع التحسينات
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?seed=${seed}&width=768&height=768&model=flux&enhance=true&nologo=true`;
    
    console.log(`Generated URL ${i+1}:`, url); // ✅ تم التصحيح
    
    img.onload = () => {
      div.innerHTML = "";
      div.appendChild(img);
      setTimeout(() => img.style.opacity = "1", 50);
    };
    
    img.onerror = () => {
      div.innerHTML = '<div style="color:red;">❌ خطأ في التحميل</div>';
    };
    
    img.src = url;
  });
}

document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
