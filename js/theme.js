const themeCSS = document.getElementById("theme-css");
const themeSelect = document.getElementById("themeSelect");

function loadTheme(theme) {
    if (theme === "retro") {
        themeCSS.href = "css/retro.css";
    } 
    
    else if (theme === "v7mode") {
        themeCSS.href = "css/v7mode.css";
    } 
    
    else {
        themeCSS.href = "css/index.css";
    }

    localStorage.setItem("theme", theme);
}

themeSelect.addEventListener("change", function () {
    loadTheme(this.value);
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    themeSelect.value = savedTheme;
    loadTheme(savedTheme);
}