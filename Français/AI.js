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
        setTimeout(() => img.style.opacity = "1", 10);
      };
      img.onerror = () => div.innerHTML = "❌ غير موجودة";
    });
    return;
  }

  // تحسين Prompt
  const improvePrompt = (text) => {
    const translations = {
      'قط': 'cat', 'كلب': 'dog', 'قلم': 'pen', 'سيارة': 'car',
      'منزل': 'house', 'شجرة': 'tree', 'زهرة': 'flower',
      'بحر': 'ocean', 'جبل': 'mountain', 'سماء': 'sky'
    };
    
    let improved = text;
    Object.keys(translations).forEach(ar => {
      improved = improved.replace(new RegExp(ar, 'gi'), translations[ar]);
    });
    
    return `${improved}, high quality, detailed, professional`;
  };

  // توليد الصور بطريقة أفضل
  for (let i = 0; i < divs.length; i++) {
    const seed = Date.now() + i * 3000;
    const enhancedPrompt = improvePrompt(rawValue);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?seed=${seed}&width=512&height=512&nologo=true`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load');
      
      const blob = await response.blob();
      const img = document.createElement('img');
      img.style.cssText = "width:100%; border-radius:8px; opacity:0; transition:opacity 0.5s";
      img.src = URL.createObjectURL(blob);
      
      img.onload = () => {
        divs[i].innerHTML = "";
        divs[i].appendChild(img);
        setTimeout(() => img.style.opacity = "1", 50);
      };
      
    } catch (error) {
      console.error('Error:', error);
      divs[i].innerHTML = '<div style="color:red;">❌ خطأ في التحميل</div>';
    }
  }
}

document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
