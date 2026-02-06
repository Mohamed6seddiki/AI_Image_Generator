async function generateImage() {
  const input = document.getElementById("input");
  const rawValue = input.value.trim();
  const value = rawValue.toLowerCase();
  
  if (!value) {
    alert("⚠️ الرجاء كتابة وصف للصورة");
    return;
  }

  const divs = [
    document.getElementById("div1"),
    document.getElementById("div2"),
    document.getElementById("div3")
  ];

  // تنظيف الصور السابقة وإظهار تحميل
  divs.forEach(div => {
    div.innerHTML = '<div style="color:#666;">⏳ جاري التحميل...</div>';
  });

  // الصور الخاصة المحلية
  const localImages = {
    samy: "SAMY",
    anis: "ANIS",
    mili: "mili"
  };

  if (localImages[value]) {
    divs.forEach((div, i) => {
      const img = new Image();
      img.style.opacity = "0";
      img.style.transition = "opacity 0.5s";
      img.style.width = "100%";
      img.style.borderRadius = "8px";
      
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

  // توليد صور AI
  divs.forEach((div, i) => {
    const seed = Date.now() + i * 1000; // فرق أكبر بين البذور
    const img = new Image();
    
    img.style.opacity = "0";
    img.style.transition = "opacity 0.5s";
    img.style.width = "100%";
    img.style.borderRadius = "8px";
    
    // استخدام API محسّن
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(rawValue)}?width=512&height=512&seed=${seed}&nologo=true`;
    
    img.onload = () => {
      div.innerHTML = "";
      div.appendChild(img);
      setTimeout(() => img.style.opacity = "1", 10);
    };
    
    img.onerror = () => {
      div.innerHTML = '<div style="color:orange;">⚠️ فشل التحميل</div>';
    };
    
    img.src = url;
  });
}

// ربط الدالة بزر Enter في حقل الإدخال
document.getElementById("input")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateImage();
});
