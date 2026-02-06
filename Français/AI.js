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
    div.innerHTML = '<div style="color:#666; padding:20px;">⏳ جاري البحث...</div>';
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

  // ترجمة الكلمات العربية
  const translations = {
    'قط': 'cat', 'كلب': 'dog', 'قلم': 'pen', 'سيارة': 'car',
    'منزل': 'house', 'شجرة': 'tree', 'زهرة': 'flower',
    'بحر': 'ocean', 'جبل': 'mountain', 'سماء': 'sky',
    'طائر': 'bird', 'طعام': 'food', 'غروب': 'sunset'
  };
  
  let searchQuery = rawValue;
  Object.keys(translations).forEach(ar => {
    searchQuery = searchQuery.replace(new RegExp(ar, 'gi'), translations[ar]);
  });

  // جلب الصور من Unsplash
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=30&client_id=your_access_key`
    );
    
    // إذا فشل Unsplash، استخدم Picsum كبديل
    if (!response.ok) {
      throw new Error('Unsplash failed');
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      divs.forEach((div, i) => {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const imageUrl = data.results[randomIndex].urls.regular;
        
        const img = new Image();
        img.style.cssText = "width:100%; border-radius:8px; opacity:0; transition:opacity 0.5s";
        img.src = imageUrl;
        
        img.onload = () => {
          div.innerHTML = "";
          div.appendChild(img);
          setTimeout(() => img.style.opacity = "1", 50);
        };
        
        img.onerror = () => {
          div.innerHTML = '<div style="color:red;">❌ خطأ</div>';
        };
      });
    } else {
      throw new Error('No results');
    }
    
  } catch (error) {
    console.log('Using fallback...');
    useFallbackImages(divs, searchQuery);
  }
}

// الحل البديل: Picsum (يعمل دائماً)
function useFallbackImages(divs, query) {
  divs.forEach((div, i) => {
    const seed = query + i;
    const img = new Image();
    img.style.cssText = "width:100%; border-radius:8px; opacity:0; transition:opacity 0.5s";
    img.src = `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/600`;
    
    img.onload = () => {
      div.innerHTML = "";
      div.appendChild(img);
      setTimeout(() => img.style.opacity = "1", 50);
    };
    
    img.onerror = () => {
      div.innerHTML = '<div style="color:red;">❌ خطأ في التحميل</div>';
    };
  });
}

document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
