'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import { translationsMap } from '/lib/translations.js';
import { useSearchParams, useRouter } from 'next/navigation';
import isDark from '/lib/isDark.js';
import isLight from '/lib/isLight.js';
import '/styles/global.css';

export default function Layout({ league, children }) {

    const router = useRouter();
    const path = usePathname();
    const currentTab = path.split('/').pop();
    const [activeTab, setActiveTab] = useState(currentTab);
    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        setActiveTab(currentTab);
    }, [currentTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        router.push(`/leagues/${league.leagueDetails.id}/${tab}`, { scroll: false });
    };

    useEffect(() => {
        const updateThemeColors = () => {
            const storedTheme = localStorage.getItem('theme') || 'theme-light';
            const leaugeColor = league.leagueDetails.color
            setTheme(storedTheme);

            const root = document.documentElement;
            if (storedTheme === 'theme-light') {
                root.style.setProperty('--team-color', isLight(leaugeColor, 200) ? 'rgb(39, 39, 39)' : leaugeColor);
            } else {
                root.style.setProperty('--team-color', isDark(leaugeColor, 50) ? 'rgb(255, 255, 255)' : leaugeColor)
            }
            root.style.setProperty('--team-font-color', isLight(root.style.getPropertyValue('--team-color'), 200) ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)');
        };

        updateThemeColors();
        window.addEventListener('themechange', updateThemeColors);
        return () => {
            window.removeEventListener('themechange', updateThemeColors);
        };
    }, [league]);


    const leagueHeader = css`
    display: flex;
    flex-flow: column;
    `;

    const leagueContent = css`
    display: flex;
    max-width: 1280px;
    flex-flow: column;
    gap: 1rem;
    width: 100%;
    overflow-x: hidden;

    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  `;

    const leagueCard = css`
    background-color: var(--team-color);
    color: var(--team-font-color);
    border-radius: 1.25rem 1.25rem 0 0;
    height: 5rem;
    display: flex;
    padding-left: 1rem;
    max-width: 100%;
    margin: 0;
  `;

    const cardContent = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  `;

    const cardName = css`
    align-content: center;
  `;
    const cardLogo = css`
    display: inline;
  `;
    const nav = css`
     background-color: var(--card-bg-main);
    border-radius: 0 0 1.25rem 1.25rem;
    height: 2.5rem;
    padding-left: 2rem;
    width: 100%;
      `;

    const navWrapper = css`
    display: flex;
    flex-flow: row;
    height: 100%;
    width: 75%;
    align-items: center;
    `


    const renderNav = () => {
        return (
            <nav css={nav}>
                <div css={navWrapper}>
                    <button
                        onClick={() => handleTabClick('overview')}
                        className={`nav-item ${activeTab === 'overview' ? 'nav-highlight' : ''}`}
                    >
                        {translationsMap?.["overview"]?.[language]}
                    </button>
                    <button
                        onClick={() => handleTabClick('standings')}
                        className={`nav-item ${activeTab === 'standings' ? 'nav-highlight' : ''}`}
                    >
                        {translationsMap?.["standings"]?.[language]}
                    </button>
                    <button
                        onClick={() => handleTabClick('stats')}
                        className={`nav-item ${activeTab === 'stats' ? 'nav-highlight' : ''}`}
                    >
                        {translationsMap?.["stats"]?.[language]}
                    </button>
                    <button
                        onClick={() => handleTabClick('fixtures')}
                        className={`nav-item ${activeTab === 'fixtures' ? 'nav-highlight' : ''}`}
                    >
                        {translationsMap?.["fixtures"]?.[language]}
                    </button>
                    <button
                        onClick={() => handleTabClick('transfers')}
                        className={`nav-item ${activeTab === 'transfers' ? 'nav-highlight' : ''}`}
                    >
                        {translationsMap?.["transfers"]?.[language]}
                    </button>
                </div>
            </nav>
        )
    }

    return (
        <div css={leagueContent}>
            <div css={leagueHeader}>
                <div css={leagueCard}>
                    <div css={cardContent}>
                        <img
                            css={cardLogo}
                            src={league.leagueDetails.logo || '/images/teamLogos/0.png'}
                            alt={league.leagueDetails.name || 'Free Agent'}
                            width="30"
                            height="30"
                        />
                        <div css={cardName}>
                            <h1>{league.leagueDetails.name}</h1>
                        </div>
                    </div>
                </div>
                {renderNav()}
            </div>
            {children}
        </div>
    );
}
