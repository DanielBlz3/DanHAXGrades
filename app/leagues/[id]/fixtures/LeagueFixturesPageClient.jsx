
'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { translationsMap } from '/lib/translations.js';
import isDark from '/lib/isDark.js';
import isLight from '/lib/isLight.js';
import '/styles/global.css';
import Fixtures from '/components/Fixtures';
import DefaultArrow from '/components/DefaultArrow';

export default function LeagueFixturesPageClient({ league }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [league]);

    const fixturesCard = css`
    display: flex;
    flex-flow: column;
    background-color: var(--card-bg-main);
    border-radius: 1.25rem;

    > :first-child {
    border: none;
  } 
`;

    const fixturesHeader = css`
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    `;

    const fixturesTitle = css`
    display: flex;
    height: 3.5rem;
    justify-content: center;
    place-items: center;
    width: 100%;
    border-bottom: solid 1px var(--secondary-divider-bg);
    `
    const fixturesContentHeader = css`
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    height: 2.5rem;
    justify-items: center;
    align-items: center;
    `;

    const fixturesButton = css`
    background-color: rgb(0, 0, 0, 0);
    border: none;
    cursor: pointer;
    `;

    const currentMatchday = league.leagueDetails.currentMatchday
    const maxMatchday = league.fixtures.sort((a, b) => b.leagueRound - a.leagueRound)?.slice(0, 1)[0].leagueRound;
    const [matchday, setFixturesMatchday] = useState(currentMatchday); //DEFAULT MATCHDAY IS THE CURRENT ONE

    const RenderFixtures = ({ matchday }) => {
        const filteredFixtures = league.fixtures.filter(m => m.leagueRound === matchday)
        const item = css`flex: 1; `

        const forwardMatchday = maxMatchday > matchday ? matchday + 1 : maxMatchday
        const backwardMatchday = matchday > 1 ? matchday - 1 : 1

        return (
            <>
                <div css={fixturesContentHeader}>
                    <button css={fixturesButton} onClick={() => setFixturesMatchday(backwardMatchday)}>
                        <DefaultArrow direction="right" bgColor={"var(--primary-arrow-bg)"} strokeBgColor={"var(--primary-arrow-stroke)"} strokeWidth={"2.5"} />
                    </button>
                    <h2>{`${translationsMap?.["round"]?.[language]} ${matchday}`}</h2>
                    <button css={fixturesButton} onClick={() => setFixturesMatchday(forwardMatchday)}>
                        <DefaultArrow direction="left" bgColor={"var(--primary-arrow-bg)"} strokeBgColor={"var(--primary-arrow-stroke)"} strokeWidth={"2.5"} />
                    </button>
                </div>
                <Fixtures fixtures={filteredFixtures} hasResults={false} nameType={'teamName'} />
            </>
        )
    }
    return (
        <>
            <div css={fixturesCard}>
                <div css={fixturesHeader}>
                    <h2 css={fixturesTitle}> {translationsMap?.["fixtures"]?.[language]}</h2>
                </div>
                <RenderFixtures matchday={matchday} />
            </div>
        </>
    );
}
