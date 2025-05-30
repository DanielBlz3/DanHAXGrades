'use client';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '../styles/global.css';
import '../styles/theme.js';
import { useState, useEffect } from 'react';
import { translationsMap } from '/lib/translations.js';

export default function RootLayout({ children }) {
  const [pageTheme, setPageTheme] = useState('theme-light');
  const [savedLang, setSavedLang] = useState('es');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') || 'theme-light';
      const storedLang = localStorage.getItem('language') || 'es';

      setPageTheme(storedTheme);
      setSavedLang(storedLang);

      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add(storedTheme);
      document.documentElement.lang = storedLang;

      // Update language text from data-lang-* attributes
      document.querySelectorAll('[data-lang-es], [data-lang-en]').forEach(el => {
        const text = el.getAttribute(`data-lang-${storedLang}`);
        if (text) el.innerText = text;
      });

      // Dispatch theme-applied event for other components to respond
      window.dispatchEvent(new CustomEvent('theme-applied', { detail: storedTheme }));
    }
  }, []);

  function toggleTheme() {
    const newTheme = pageTheme === 'theme-light' ? 'theme-dark' : 'theme-light';
    setPageTheme(newTheme);

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add(newTheme);

      // Dispatch theme update for other components
      window.dispatchEvent(new Event('themechange')); // legacy, optional
      window.dispatchEvent(new CustomEvent('theme-applied', { detail: newTheme }));
    }
  }

  function setLanguage(lang) {
    if (lang !== savedLang) {
      setSavedLang(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
        location.reload(); // full reload if you want instant translation switch
      }
    }
  }


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
    border-bottom: 1px solid var(--divider-bg-primary);
    z-index: 10;
        `;
    const main = css`
    margin-top: 5rem;
     justify-self: center;
     width: 100%;
     max-width: 1280px;
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
                                <button css={settingsMenuButton} onClick={() => toggleTheme()}>{translationsMap?.["theme"]?.[savedLang]}</button>
                            </li>
                            <div css={settingsMenuDivider}></div>
                            <li css={settingsMenuItem}>
                                <details css={langDetails}>
                                    <summary css={langSummary}>{translationsMap?.["languages"]?.[savedLang]}</summary>
                                    <button css={settingsMenuButton}
                                        onClick={() => setLanguage('en')}>{translationsMap?.["english"]?.[savedLang]}</button>
                                    <button css={settingsMenuButton}
                                        onClick={() => setLanguage('es')}>{translationsMap?.["spanish"]?.[savedLang]}</button>
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
