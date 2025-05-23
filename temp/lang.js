function setLanguage(lang) {
    const currentLang = localStorage.getItem('language');

    // Reload only if lang is changing
    if (currentLang !== lang) {
        localStorage.setItem('language', lang);
        location.reload(); // reload the website
        return; // stop here so it doesn’t apply translation before reload
    }

    // Apply translations
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang-es], [data-lang-en]').forEach(element => {
        const text = element.getAttribute(`data-lang-${lang}`);
        if (text) element.innerText = text;
    });
}

// Load language on page load
;
