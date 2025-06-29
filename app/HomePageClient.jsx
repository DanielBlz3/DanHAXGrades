'use client';
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { translationsMap } from '/lib/translations.js';
import '/styles/global.css';

export default function HomePageClient() {
    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || 'es';
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setLanguage(storedLanguage);
        setTheme(storedTheme);
    }, [])

    const homeContentWrapper = css`
    display: grid;
    width: 1280px;
    width: 100%;
    grid-template-columns: 1fr 2fr 1fr;
    grid-gap: 1rem;
    overflow-x: hidden;
    overflow-Y: hidden;
    
    @media (max-width: 1280px) {
        grid-template-columns: 3fr 1fr;
    }

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
    `;

    const teamCreatorCss = css`
    display: flex;
    flex-flow: column;
    height: 12rem;
    width: 100%;
    background-color: var(--primary-card-bg);
    border-radius: 1.25rem;
    color: var(--primary-font-color);
    text-decoration: none;
    `;

    const teamCreatorHeader = css`
    display: flex;
    height: 8rem;
    width: 100%;
    align-items: center;
    justify-content: center;
    `;

      const teamCreatorField = css`
    background-color: var(--primary-soccer-field-bg);
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 0 0 1.25rem 1.25rem;

    &:hover {
        >  * {
        transform: translate(-50%, -70%); 
        }
    }  
    `;

    const TeamCreatorPlayer = ({ x, y }) => {

    const playerContainer = css`
    display: flex;
    flex-direction: column;
    position: absolute;
    justify-content: center;
    align-items: center;
    height: 25px;
    width: 25px;
    top: ${y}%;
    left: ${x}%;
    transform: translate(-50%, -50%);
    text-decoration: none;
    color: var(--primary-font-color);
    background-color: var(--primary-player-bg-color);
    border-radius: 50%;
    transition: transform 0.15s ease;
    `;

        return (<div css={playerContainer} className="primary-hover">
            <img src="/images/defaulticon.png" width={17} height={17} />
        </div>
        )
    }

    return (
        <main css={homeContentWrapper}>
            <div>
                <p>links</p>
                <a href="/leagues/2/overview">League</a>
                <div></div>
                <a href="/leagues/3/overview">Copa</a>
                <div></div>
                <a href="/matches/34/overview">Pre-Temp Final</a>
                <div></div>
            </div>
            <div></div>
            <a css={teamCreatorCss} className='primary-hover' href="/team-creator">
                <div css={teamCreatorHeader}>
                    <h3>{translationsMap?.["teamCreator"]?.[language]}</h3>
                </div>
                <div css={teamCreatorField}>
                    <TeamCreatorPlayer x={73} y={30}/>
                    <TeamCreatorPlayer x={50} y={30}/>
                    <TeamCreatorPlayer x={27} y={30}/>
                    <TeamCreatorPlayer x={73} y={80}/>
                    <TeamCreatorPlayer x={50} y={80}/>
                    <TeamCreatorPlayer x={27} y={80}/>
                </div>
            </a>
        </main>
    );
}