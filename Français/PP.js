document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('button');
    buttons[0].addEventListener('click', function () {
        window.location.href = 'AI.html';
    });
    buttons[1].addEventListener('click', function () {
        window.location.href = 'IMGEditor.html';
    });
    const contactBtn = document.getElementById("contact-btn");
    const socialLinks = document.getElementById("social-links");
    const backBtn = document.getElementById("back-btn");

    contactBtn.addEventListener("click", function () {
        contactBtn.style.display = "none";
        socialLinks.style.display = "flex";
        backBtn.style.display = "block";
    });
    backBtn.addEventListener("click", function () {
        contactBtn.style.display = "block";
        socialLinks.style.display = "none";
        backBtn.style.display = "none";
    });
});
function showImage(side) {
    document.querySelector(`.${side}`).classList.add('visible');
}
function hideImage(side) {
    document.querySelector(`.${side}`).classList.remove('visible');
}
