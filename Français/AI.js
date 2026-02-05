async function generateImage() {
  const input = document.getElementById("input");
  const rawValue = input.value.trim();
  const value = rawValue.toLowerCase();

  if (!value) return;

  const divs = [
    document.getElementById("div1"),
    document.getElementById("div2"),
    document.getElementById("div3")
  ];

  // تنظيف الصور السابقة
  divs.forEach(div => div.innerHTML = "");

  // الصور الخاصة المحلية
  const localImages = {
    samy: "SAMY",
    anis: "ANIS",
    mili: "mili"
  };

  if (localImages[value]) {
    divs.forEach((div, i) => {
      const img = new Image();
      img.src = `${localImages[value]}${i + 1}.jpg`; // jpg/png/webp
      img.onload = () => { img.style.opacity = 1; };
      img.onerror = () => { div.innerHTML = "<p>❌ Image not found</p>"; };
      div.appendChild(img);
    });
    return;
  }

  // توليد صور AI من Pollinations أو أي API آخر
  divs.forEach((div, i) => {
    const seed = Date.now() + i;
    const img = new Image();
    img.onload = () => { img.style.opacity = 1; };
    img.onerror = () => { div.innerHTML = "<p>⚠️ Failed to load</p>"; };
    img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(rawValue)}?seed=${seed}`;
    div.appendChild(img);
  });
}
