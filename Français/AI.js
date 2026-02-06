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
    div.innerHTML = '<div style="color:#666; padding:20px;">⏳ جاري التحميل...</div>';
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

  // توليد صور عشوائية بناءً على النص
  divs.forEach((div, i) => {
    const seed = rawValue + "-" + i + "-" + Date.now();
    const img = new Image();
    img.style.cssText = "width:100%; border-radius:8px; opacity:0; transition:opacity 0.5s";
    
    // Picsum يعمل دائماً
    img.src = `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/600`;
    
    img.onload = () => {
      div.innerHTML = "";
      div.appendChild(img);
      setTimeout(() => img.style.opacity = "1", 50);
    };
    
    img.onerror = () => {
      div.innerHTML = '<div style="color:red;">❌ خطأ</div>';
    };
  });
}

document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
