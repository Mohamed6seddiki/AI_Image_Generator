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

  const enhancedPrompt = `${prompt}, high quality, detailed`;

  // جرب عدة روابط Pollinations مختلفة
  const pollinationsURLs = [
    // الرابط الجديد 2025
    (p, s) => `https://pollinations.ai/p/${encodeURIComponent(p)}?seed=${s}&width=512&height=512`,
    
    // الرابط القديم
    (p, s) => `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?seed=${s}&width=512&height=512&nologo=true`,
    
    // بدون معاملات
    (p, s) => `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}`,
    
    // مع model flux
    (p, s) => `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?model=flux&seed=${s}`
  ];

  // جرب كل صورة
  for (let i = 0; i < divs.length; i++) {
    const seed = Date.now() + i * 2000;
    let loaded = false;

    // جرب كل رابط بالترتيب
    for (let urlFunc of pollinationsURLs) {
      if (loaded) break;
      
      const url = urlFunc(enhancedPrompt, seed);
      
      try {
        const img = new Image();
        img.style.cssText = "width:100%; opacity:0; transition:opacity 0.5s; border-radius:8px;";
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('timeout')), 8000);
          
          img.onload = () => {
            clearTimeout(timeout);
            divs[i].innerHTML = "";
            divs[i].appendChild(img);
            setTimeout(() => img.style.opacity = "1", 50);
            loaded = true;
            resolve();
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('failed'));
          };
          
          img.src = url;
        });
        
        break; // نجح، توقف
        
      } catch (error) {
        console.log(`فشل الرابط ${url}`);
        continue; // جرب الرابط التالي
      }
    }

    if (!loaded) {
      divs[i].innerHTML = '<div style="color:red;">❌ فشل التحميل</div>';
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
