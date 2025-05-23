var pageTheme = "theme-dark";

function theme() {
    pageTheme = localStorage.getItem("theme") || "theme-light";

    if (pageTheme) {
        if (pageTheme === "theme-dark") {
            pageTheme = "theme-light";
        } else if (pageTheme == "theme-light") {
            pageTheme = "theme-dark";
        }
        console.log(pageTheme);
        document.body.className = pageTheme;
        localStorage.setItem("theme", pageTheme);
    }
}

