
'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations.js';
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
    const maxMatchday = league.fixtures.sort((a, b) => b.roundNumber - a.roundNumber)?.slice(0, 1)[0]?.roundNumber;
    const [matchday, setFixturesMatchday] = useState(currentMatchday);
    const filteredFixtures = league.fixtures.filter(m => m.roundNumber === matchday)
    const leagueRound = filteredFixtures?.slice(0, 1)[0]?.leagueRound
    const roundName = filteredFixtures?.slice(0, 1)[0]?.roundName
    const roundNameH2 = typeof leagueRound === "number" ? `${translationsMap?.["round"]?.[language]} ${roundName}` : `${translationsMap?.[roundName]?.[language]}`

    const RenderFixtures = ({ matchday }) => {

        const forwardMatchday = maxMatchday > matchday ? matchday + 1 : maxMatchday
        const backwardMatchday = matchday > 1 ? matchday - 1 : 1

        return (
            <>
                <div css={fixturesContentHeader}>
                    <button css={fixturesButton} onClick={() => setFixturesMatchday(backwardMatchday)}>
                        <DefaultArrow direction="right" bgColor={"var(--primary-arrow-bg)"} strokeBgColor={"var(--primary-arrow-stroke)"} strokeWidth={"2.5"} />
                    </button>
                    <h2>{roundNameH2}</h2>
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
                    <h2 css={fixturesTitle}>{translationsMap?.["fixtures"]?.[language]}</h2>
                </div>
                <RenderFixtures matchday={matchday} />
            </div>
        </>
    );
}
