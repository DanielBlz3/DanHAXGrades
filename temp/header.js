let savedLang
let savedTheme
function appendHeader() {
    const header = document.createElement("header");
    const globalHeader = document.createElement("div");
    globalHeader.className = "danhaxgrades-header";
    Object.assign(globalHeader.style, {
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
        gap: "45vw",
        fontSize: "1.5rem",
        width: "100%",
        minHeight: "75px",
        padding: "1rem",
        position: "fixed",
        top: "0%",
        borderBottom: "0.25px solid var(--border-bottom-header-color)",
        zIndex: 1000,
        backgroundColor: "var(--card-bg-main)",
    })
    const settingsDivider = document.createElement("div");
    settingsDivider.className = "settings-menu-element-divider";
    const title = document.createElement("div");
    title.className = "danhaxgrades-title def-hover"; title.style.width = "40%"; title.style.color = "var(--font-default-color)"
    const titleContent = document.createElement("a");
    titleContent.textContent = "DanHAXGrades";
    titleContent.href = "/";
    const settingsButton = document.createElement("button"); settingsButton.className = "settings-button"; settingsButton.onclick = () => settings(); settingsButton.textContent = "⚙️";
    Object.assign(settingsButton.style, {
        backgroundColor: "var(--invisible)",
        border: "none",
        cursor: "pointer",
        fontSize: "1.5rem",
        filter: "brightness(var(--settings-button-color))", 
    })
    
    const settingsMenu = document.createElement("div");
    settingsMenu.className = "settings-menu";
    const settingsMenuContent = document.createElement("ul");
    const themeLi = document.createElement("li");
    const themeButton = document.createElement("button");
    themeButton.className = "theme-button settings-menu-button";
    themeButton.onclick = () => theme();
    themeButton.textContent = "Theme"; //FALLBACK

    const langLi = document.createElement("li");
    const langOptions = document.createElement("details");
    const currentLang = document.createElement("summary");
    currentLang.textContent = "Language";

    const englishButton = document.createElement("button");
    englishButton.className = "language-button settings-menu-button";
    englishButton.onclick = () => setLanguage("en");
    englishButton.textContent = "English"; //FALLBACK
    englishButton.setAttribute("data-lang-es", "Ingles");
    englishButton.setAttribute("data-lang-en", "English");

    const spanishButton = document.createElement("button");
    spanishButton.className = "language-button settings-menu-button";
    spanishButton.onclick = () => setLanguage("es");
    spanishButton.textContent = "Español"; //FALLBACK
    spanishButton.setAttribute("data-lang-es", "Español");
    spanishButton.setAttribute("data-lang-en", "Spanish");

    themeButton.setAttribute("data-lang-es", "Tema");
    themeButton.setAttribute("data-lang-en", "Theme");
    currentLang.setAttribute("data-lang-es", "Español");
    currentLang.setAttribute("data-lang-en", "English");

    themeLi.appendChild(themeButton);
    settingsMenuContent.appendChild(themeLi);

    settingsMenuContent.appendChild(settingsDivider);

    langOptions.appendChild(currentLang);
    langOptions.appendChild(englishButton);
    langOptions.appendChild(spanishButton);
    langLi.appendChild(langOptions);
    settingsMenuContent.appendChild(langLi);

    settingsMenu.appendChild(settingsMenuContent);

    title.appendChild(titleContent);
    globalHeader.appendChild(title);
    globalHeader.appendChild(settingsButton);

    header.appendChild(globalHeader);

    header.appendChild(settingsMenu);
    document.body.appendChild(header);

    window.onload = function () {
        savedTheme = localStorage.getItem("theme") || "theme-light";
        document.body.className = savedTheme;
    };
    savedLang = localStorage.getItem("language") || "es";
    setLanguage(savedLang);

    function settings() {
        if (settingsStatus == "closed") {
            settingsStatus = "open";
            settingsMenu.style.display = "block";
        } else {
            settingsStatus = "closed";
            settingsMenu.style.display = "none";
        }
    }
}