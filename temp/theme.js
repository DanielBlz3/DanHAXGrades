var pageTheme = localStorage.getItem("theme") || "theme-light"; //Defualt theme is light mode


document.body.className = pageTheme;
function theme() {
    pageTheme = pageTheme === "theme-dark" ? "theme-light" : "theme-dark";
    document.body.className = pageTheme;
    localStorage.setItem("theme", pageTheme);
    location.reload();
}