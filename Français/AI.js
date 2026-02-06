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

  // توليد صور AI باستخدام APIs موثوقة
  divs.forEach(async (div, i) => {
    try {
      // استخدام Hugging Face Inference API (مجاني ودقيق)
      const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: rawValue,
          parameters: {
            negative_prompt: "blurry, bad quality, distorted",
            num_inference_steps: 30,
            guidance_scale: 7.5,
            width: 512,
            height: 512,
            seed: Date.now() + i * 1000
          }
        })
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const blob = await response.blob();
      const img = new Image();
      img.style.cssText = "width:100%; opacity:0; transition:opacity 0.5s; border-radius:8px;";
      img.src = URL.createObjectURL(blob);
      
      img.onload = () => {
        div.innerHTML = "";
        div.appendChild(img);
        setTimeout(() => img.style.opacity = "1", 10);
      };

    } catch (error) {
      console.error('Error:', error);
      
      // Fallback: استخدام Pollinations مع إعدادات محسّنة
      const seed = Date.now() + i * 1000;
      const enhancedPrompt = `${rawValue}, high quality, detailed, photorealistic`;
      const img = new Image();
      img.style.cssText = "width:100%; opacity:0; transition:opacity 0.5s; border-radius:8px;";
      
      // استخدام model flux للدقة الأعلى
      img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=512&height=512&seed=${seed}&model=flux&enhance=true&nologo=true`;
      
      img.onload = () => {
        div.innerHTML = "";
        div.appendChild(img);
        setTimeout(() => img.style.opacity = "1", 10);
      };
      
      img.onerror = () => {
        div.innerHTML = '<div style="color:orange;">⚠️ فشل التحميل</div>';
      };
    }
  });
}

// ربط Enter
document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
