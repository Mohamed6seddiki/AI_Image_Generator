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

  // استخدام Hugging Face Inference API (مجاني بدون تسجيل)
  for (let i = 0; i < divs.length; i++) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              num_inference_steps: 4
            }
          })
        }
      );

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
        divs[i].innerHTML = '<div style="color:orange;">⏳ السيرفر مشغول، جرب بعد ثواني...</div>';
      }
    } catch (error) {
      divs[i].innerHTML = '<div style="color:red;">❌ خطأ في الاتصال</div>';
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 ثواني بين كل صورة
  }
}

document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
