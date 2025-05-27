'use client'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '../styles/global.css';
import '../styles/theme.js'
import { useState } from 'react';

let pageTheme = typeof window !== 'undefined' ? localStorage.getItem("theme") || "theme-light" : 'theme-light' //Defualt theme is light mode
function theme() {
    if (pageTheme === "theme-light") {
        document.body.classList.add("theme-dark");
        document.body.classList.remove("theme-light");
        pageTheme = "theme-dark"
    } else {
        document.body.classList.add("theme-light");
        document.body.classList.remove("theme-dark");
        pageTheme = "theme-light"
    }
    localStorage.setItem("theme", pageTheme);
    location.reload();
}

let savedLang = localStorage.getItem("language") || "es";
function setLanguage(lang) {
    const currentLang = localStorage.getItem('language');
    // Reload only if lang is changing
    if (currentLang !== lang) {
        typeof window !== 'undefined' ? localStorage.setItem('language', lang) : localStorage.setItem('language', 'es')
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
setLanguage(savedLang);

export default function RootLayout({ children }) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const toggleSettings = () => {
        setSettingsOpen(prev => !prev);
    }
    const headerContainer = css` 
    display: flex;
    flex-flow: row;
    align-items: center;
    gap: 45vw;
    font-size: 1.5rem;
    width: 100%;
    min-height: 75px;
    padding: 1rem;
    position: fixed;
    top: 0%;
    background-color: var(--card-bg-main);
    border-bottom: 1px solid var(--divide-bg-primary);
    z-index: 10;
        `;
    const main = css`
    margin-top: 5rem;
    `
    const title = css`
    width: 40%;
    &:hover {
    color: grey;
    }
    `;
    const titleLink = css`
        text-decoration: none;
        color: var(--primary-font-color);
    `;
    const settingsButton = css`
    background-color: rgba(0, 0, 0, 0);
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    filter: brightness(var(--settings-button-color));
    &:hover {
    transform: scale(1.3);
    transform-origin: center;
    transition: transform 150ms ease-in-out;
    }
    `;
    const settingsMenu = css`
    width: 20%;
    display: ${settingsOpen ? 'block' : 'none'};;
    background-color: var(--card-bg-main);
    border-radius: .5rem;
    position: fixed;
    top: 100px;
    left: 87%;
    transform: translateX(-50%);
    z-index: 20;
    min-width: 150px;
    box-shadow: 3px 6px 10px rgba(0, 0, 0, .25);
    padding-inline: 1rem;
    `;
    const settingsMenuButton = css`
    background-color:  rgba(0, 0, 0, 0);
    width: 100%;
    color: var(--primary-font-color);
    border: none;
    cursor: pointer;
    text-align: start;
    `;
    const settingsMenuItem = css`
    border: none;
    list-style: none;
    margin-block: 1rem;
    `;
    const settingsMenuDivider = css`
    width: 100%;
    border-bottom: solid .75px var(--container-background-color);
    `;
    const langDetails = css`
        color: var(--primary-font-color);
    text-align: center;
    cursor: pointer;
    `;
    const langSummary = css`
    color: var(--primary-font-color);
    text-align: start;
    list-style: none;
    font-size: .9rem;
    margin-bottom: .5rem;
    padding: 0;
    text-wrap: nowrap;
    width: 100%;
    `;
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="author" content="Danielblz" />
               <link rel="icon" href="/DanHAXGradeFavicon.ico" type="image/x-icon" />
                <link rel="stylesheet" href="/players.css" type="text/css" />
                <title id="playerNameTitle">Player</title>
            </head>
            <body className={pageTheme}>
                <header>
                    <div css={headerContainer}>
                        <div css={title}>
                            <a css={titleLink} href="/">DanHAXGrades</a>
                        </div>
                        <button id="settingsButton" css={settingsButton} onClick={toggleSettings}>⚙️</button>
                    </div>
                    <div id="settingsmenu" css={settingsMenu}>
                        <ul>
                            <li css={settingsMenuItem}>
                                <button css={settingsMenuButton} data-lang-es="Tema" data-lang-en="Theme"
                                    onClick={() => theme()}>Theme</button>
                            </li>
                            <div css={settingsMenuDivider}></div>
                            <li css={settingsMenuItem}>
                                <details css={langDetails}>
                                    <summary css={langSummary} data-lang-es="Spanish" data-lang-en="English">Languages</summary>
                                    <button css={settingsMenuButton}
                                        onClick={() => setLanguage('en')}>English</button>
                                    <button css={settingsMenuButton}
                                        onClick={() => setLanguage('es')}>Espanol</button>
                                </details>
                            </li>
                        </ul>
                    </div>
                </header>
                <main css={main}>
                    {children}
                </main>
            </body>
        </html >
    );
}
