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

  // ترجمة الكلمات العربية الشائعة
  const translations = {
    'قط': 'cat', 'قطة': 'cat', 'قطط': 'cats',
    'كلب': 'dog', 'كلاب': 'dogs',
    'قلم': 'pen', 'اقلام': 'pens',
    'سيارة': 'car', 'سيارات': 'cars',
    'منزل': 'house', 'بيت': 'house',
    'شجرة': 'tree', 'اشجار': 'trees',
    'زهرة': 'flower', 'زهور': 'flowers',
    'بحر': 'ocean', 'محيط': 'ocean',
    'جبل': 'mountain', 'جبال': 'mountains',
    'سماء': 'sky',
    'طائر': 'bird', 'طيور': 'birds',
    'طعام': 'food',
    'غروب': 'sunset',
    'شروق': 'sunrise',
    'غابة': 'forest',
    'نهر': 'river',
    'صحراء': 'desert'
  };
  
  let prompt = rawValue;
  Object.keys(translations).forEach(ar => {
    prompt = prompt.replace(new RegExp(ar, 'gi'), translations[ar]);
  });

  // تحسين الـ Prompt
  const enhancedPrompt = `${prompt}, high quality, detailed, professional photography`;

  // استخدام APIs موثوقة بالترتيب
  const APIs = [
    // 1. Pollinations (مع إعدادات محسّنة)
    {
      name: 'Pollinations',
      getUrl: (prompt, seed) => 
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=512&height=512&nologo=true`
    },
    // 2. Replicate Proxy
    {
      name: 'Craiyon',
      getUrl: (prompt, seed) => 
        `https://api.craiyon.com/draw?prompt=${encodeURIComponent(prompt)}&version=35s5hfwn9n78gb06&token=${seed}`
    },
    // 3. DreamStudio-like APIs
    {
      name: 'Prodia',
      getUrl: (prompt, seed) => 
        `https://images.prodia.xyz/generate?prompt=${encodeURIComponent(prompt)}&seed=${seed}&steps=20&cfg_scale=7`
    }
  ];

  // توليد 3 صور
  divs.forEach(async (div, i) => {
    const seed = Date.now() + i * 1000;
    let success = false;

    // جرب كل API بالترتيب
    for (let api of APIs) {
      if (success) break;

      try {
        console.log(`Trying ${api.name} for image ${i+1}...`);
        const url = api.getUrl(enhancedPrompt, seed);
        
        const response = await fetch(url);
        
        if (response.ok) {
          const blob = await response.blob();
          
          // تحقق من أن الملف صورة فعلاً
          if (blob.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.style.cssText = "width:100%; border-radius:8px; opacity:0; transition:opacity 0.5s";
            img.src = URL.createObjectURL(blob);
            
            img.onload = () => {
              div.innerHTML = "";
              div.appendChild(img);
              setTimeout(() => img.style.opacity = "1", 50);
            };
            
            success = true;
            console.log(`✅ ${api.name} succeeded for image ${i+1}`);
            break;
          }
        }
      } catch (error) {
        console.log(`❌ ${api.name} failed:`, error.message);
        continue;
      }
    }

    // إذا فشلت كل APIs
    if (!success) {
      div.innerHTML = `
        <div style="color:orange; padding:20px; text-align:center;">
          ⚠️ جرب وصفاً بالإنجليزية<br>
          <small>مثال: "cat sitting on a table"</small>
        </div>
      `;
    }
  });
}

document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
