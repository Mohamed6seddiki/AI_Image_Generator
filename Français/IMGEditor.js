let saturate = document.getElementById("saturate");
let contrast = document.getElementById("contrast");
let brightness = document.getElementById("brightness");
let sepia = document.getElementById("sepia");
let grayscale = document.getElementById("grayscale");
let blur = document.getElementById("blur");
let huerotate = document.getElementById("huerotate");
let upload = document.getElementById("upload");
let download = document.getElementById("download");
let img = document.getElementById("img");
let originalImg = document.getElementById("original-img");
let reset = document.getElementById("reset");
let imgBox = document.getElementById("imgBox");
window.onload = function () {
    download.style.display = 'none';
    reset.style.display = 'none';
    imgBox.style.display = 'none';
};
upload.onchange = function () {
    let file = new FileReader();
    file.readAsDataURL(upload.files[0]);
    file.onload = function () {
        img.src = file.result;
        originalImg.src = file.result;
        imgBox.style.display = 'flex';
        download.style.display = 'block';
        reset.style.display = 'block';
        document.getElementById('upload-label').textContent = "Téléversez une autre photo ici";
    };
};
let filters = document.querySelectorAll("ul li input");
filters.forEach(filter => {
    filter.addEventListener('input', function () {
        img.style.filter = `
            saturate(${saturate.value}%)
            contrast(${contrast.value}%)
            brightness(${brightness.value}%)
            sepia(${sepia.value}%)
            grayscale(${grayscale.value})
            blur(${blur.value}px)
            hue-rotate(${huerotate.value}deg)
        `;
    });
});
reset.onclick = function () {
    upload.value = "";
    img.src = "";
    originalImg.src = "";
    imgBox.style.display = 'none';
    download.style.display = 'none';
    reset.style.display = 'none';
    document.getElementById('upload-label').textContent = "Téléversez votre photo ici";
    filters.forEach(input => {
        if (input.id === "grayscale") input.value = 0;
        else if (input.id === "blur") input.value = 0;
        else input.value = 100;
    });
    img.style.filter = "none";
};
download.onclick = function () {
    let canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    let ctx = canvas.getContext("2d");
    ctx.filter = `
        saturate(${saturate.value}%)
        contrast(${contrast.value}%)
        brightness(${brightness.value}%)
        sepia(${sepia.value}%)
        grayscale(${grayscale.value})
        blur(${blur.value}px)
        hue-rotate(${huerotate.value}deg)
    `;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    download.href = canvas.toDataURL("image/png");
    download.download = "image-modifiée.png";
};