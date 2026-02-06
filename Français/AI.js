<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مولد الصور بالذكاء الاصطناعي</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            color: #667eea;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .search-box {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }
        input {
            flex: 1;
            padding: 15px 20px;
            font-size: 18px;
            border: 2px solid #667eea;
            border-radius: 10px;
            outline: none;
            transition: all 0.3s;
        }
        input:focus {
            border-color: #764ba2;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        button {
            padding: 15px 40px;
            font-size: 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.2s;
            font-weight: bold;
        }
        button:hover {
            transform: scale(1.05);
        }
        button:active {
            transform: scale(0.95);
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .image-box {
            background: #f5f5f5;
            border-radius: 15px;
            overflow: hidden;
            min-height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .image-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .loading {
            color: #667eea;
            font-size: 16px;
        }
        .note {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 مولد الصور بالذكاء الاصطناعي</h1>
        
        <div class="search-box">
            <input 
                type="text" 
                id="input" 
                placeholder="اكتب وصف الصورة بالإنجليزية (مثال: cat on a table)..."
            >
            <button onclick="generateImage()">توليد</button>
        </div>

        <div class="gallery">
            <div class="image-box" id="div1"></div>
            <div class="image-box" id="div2"></div>
            <div class="image-box" id="div3"></div>
        </div>

        <div class="note">
            💡 <strong>نصيحة:</strong> استخدم وصفاً مفصلاً بالإنجليزية للحصول على أفضل النتائج
            <br>مثال: "a cute cat sitting on a wooden table, sunny day, professional photo"
        </div>
    </div>

    <script>
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
            div.innerHTML = '<div class="loading">⏳ جاري التوليد...</div>';
          });

          // الصور المحلية
          const value = rawValue.toLowerCase();
          const localImages = { samy: "SAMY", anis: "ANIS", mili: "mili" };

          if (localImages[value]) {
            divs.forEach((div, i) => {
              const img = new Image();
              img.style.opacity = "0";
              img.style.transition = "opacity 0.5s";
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

          // تحسين الـ Prompt
          const enhancedPrompt = `${rawValue}, high quality, detailed, 4k`;

          // توليد الصور
          for (let i = 0; i < divs.length; i++) {
            const seed = Date.now() + i * 5000;
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?seed=${seed}&width=512&height=512&nologo=true`;
            
            const img = new Image();
            img.style.opacity = "0";
            img.style.transition = "opacity 0.5s";
            img.crossOrigin = "anonymous";
            
            img.onload = () => {
              divs[i].innerHTML = "";
              divs[i].appendChild(img);
              setTimeout(() => img.style.opacity = "1", 50);
            };
            
            img.onerror = () => {
              divs[i].innerHTML = '<div style="color:red;">❌ فشل التحميل<br><small>جرب وصفاً آخر</small></div>';
            };
            
            img.src = url;
            
            // تأخير بسيط بين كل صورة
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }

        document.getElementById("input").addEventListener("keypress", (e) => {
          if (e.key === "Enter") generateImage();
        });
    </script>
</body>
</html>
