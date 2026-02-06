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

  // ترجمة تلقائية
  const translations = {
    'قط': 'cat', 'كلب': 'dog', 'قلم': 'pen', 'سيارة': 'car',
    'منزل': 'house', 'شجرة': 'tree', 'زهرة': 'flower',
    'بحر': 'ocean', 'جبل': 'mountain', 'سماء': 'sky'
  };
  
  let prompt = rawValue;
  Object.keys(translations).forEach(ar => {
    prompt = prompt.replace(new RegExp(ar, 'gi'), translations[ar]);
  });

  const enhancedPrompt = `${prompt}, high quality, detailed, professional`;

  // توليد الصور باستخدام ImageFlux API (بديل جديد)
  for (let i = 0; i < divs.length; i++) {
    const seed = Math.floor(Math.random() * 10000000);
    
    // استخدام API جديد من ImageFlux
    const url = `https://imageflux.io/api/generate?prompt=${encodeURIComponent(enhancedPrompt)}&seed=${seed}&width=512&height=512`;
    
    try {
      const response = await fetch(url);
      
      if (response.ok) {
        const blob = await response.blob();
        const img = new Image();
        img.style.cssText = "width:100%; opacity:0; transition:opacity 0.5s; border-radius:8px;";
        img.src = URL.createObjectURL(blob);
        
        img.onload = () => {
          divs[i].innerHTML = "";
          divs[i].appendChild(img);
          setTimeout(() => img.style.opacity = "1", 50);
        };
      } else {
        // Fallback: استخدام API آخر
        const fallbackUrl = `https://api.deepai.org/api/text2img`;
        const fallbackResponse = await fetch(fallbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K'
          },
          body: JSON.stringify({ text: enhancedPrompt })
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          const img = new Image();
          img.style.cssText = "width:100%; opacity:0; transition:opacity 0.5s; border-radius:8px;";
          img.src = data.output_url;
          
          img.onload = () => {
            divs[i].innerHTML = "";
            divs[i].appendChild(img);
            setTimeout(() => img.style.opacity = "1", 50);
          };
        } else {
          divs[i].innerHTML = '<div style="color:red;">❌ فشل التحميل</div>';
        }
      }
    } catch (error) {
      console.error('Error:', error);
      divs[i].innerHTML = '<div style="color:red;">❌ خطأ في التحميل</div>';
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
