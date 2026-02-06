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

  // ترجمة تلقائية
  const translations = {
    'قط': 'cat', 'كلب': 'dog', 'قلم': 'pen', 'سيارة': 'car',
    'منزل': 'house', 'شجرة': 'tree', 'زهرة': 'flower',
    'بحر': 'ocean', 'جبل': 'mountain', 'سماء': 'sky'
  };
  
  let searchQuery = rawValue;
  Object.keys(translations).forEach(ar => {
    searchQuery = searchQuery.replace(new RegExp(ar, 'gi'), translations[ar]);
  });

  // استخدام Pexels API
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=15`,
      {
        headers: {
          'Authorization': 'wl7F1spCm4DqV2lejv45Qc0wO4EIPVlcfFUmsocxAYtnw93bkbpph88y' // احصل عليه من pexels.com/api
        }
      }
    );

    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      divs.forEach((div, i) => {
        const photo = data.photos[i] || data.photos[0];
        const img = new Image();
        img.style.cssText = "width:100%; border-radius:8px; opacity:0; transition:opacity 0.5s";
        img.src = photo.src.large;
        
        img.onload = () => {
          div.innerHTML = "";
          div.appendChild(img);
          setTimeout(() => img.style.opacity = "1", 50);
        };
      });
    } else {
      useFallback(divs, searchQuery);
    }
  } catch (error) {
    useFallback(divs, searchQuery);
  }
}

function useFallback(divs, query) {
  divs.forEach((div, i) => {
    const seed = `${query}-${i}`;
    const img = new Image();
    img.style.cssText = "width:100%; border-radius:8px; opacity:0; transition:opacity 0.5s";
    img.src = `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/600`;
    
    img.onload = () => {
      div.innerHTML = "";
      div.appendChild(img);
      setTimeout(() => img.style.opacity = "1", 50);
    };
  });
}

document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
