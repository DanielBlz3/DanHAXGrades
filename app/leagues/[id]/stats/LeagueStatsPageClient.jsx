
'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations.js';
import '/styles/global.css';
import TopStats from '/components/TopStats';

export default function LeagueStatsPageClient({ league }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [league]);

    const statsHeader = css`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    `

    const statsSection = css`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    `

    return (
        <>
            <h2 css={statsHeader}>{translationsMap?.["topStats"]?.[language]}</h2>
            <div css={statsSection}>
                <TopStats metric="topGoals" data={league.topPlayerStats.topGoals} />
                <TopStats metric="topAssists" data={league.topPlayerStats.topAssists} />
                <TopStats metric="topGa" data={league.topPlayerStats.topGa} />
                <TopStats metric="topMatchRatings" data={league.topPlayerStats.topMatchRatings} />
            </div>
            <h2 css={statsHeader}>{translationsMap?.["shooting"]?.[language]}</h2>
            <div css={statsSection}>
                <TopStats metric="topGoalsRate" data={league.topPlayerStats.topGoalsRate} />
                <TopStats metric="topShotsOnTarget" data={league.topPlayerStats.topShotsOnTarget} />
                <TopStats metric="topBcm" data={league.topPlayerStats.topBcm} />
            </div>
            <h2 css={statsHeader}>{translationsMap?.["passingAndTouches"]?.[language]}</h2>
            <div css={statsSection}>
                <TopStats metric="topPassesCompletedRate" data={league.topPlayerStats.topPassesCompletedRate} />
                <TopStats metric="topAssistsRate" data={league.topPlayerStats.topAssistsRate} />
                <TopStats metric="topChancesCreated" data={league.topPlayerStats.topChancesCreated} />
                <TopStats metric="topPassingA" data={league.topPlayerStats.topPassingA} />
                <TopStats metric="topChancesCreatedRate" data={league.topPlayerStats.topChancesCreatedRate} />
                <TopStats metric="topTouchesRate" data={league.topPlayerStats.topTouchesRate} />
            </div>
            <h2 css={statsHeader}>{translationsMap?.["defense"]?.[language]}</h2>
            <div css={statsSection}>
                <TopStats metric="topDefensiveActionsRate" data={league.topPlayerStats.topDefensiveActionsRate} />
                <TopStats metric="topDuelsWonRate" data={league.topPlayerStats.topDuelsWonRate} />
                <TopStats metric="topDuelsP" data={league.topPlayerStats.topDuelsP} />
            </div>
            <h2 css={statsHeader}>{translationsMap?.["gkStats"]?.[language]}</h2>
            <div css={statsSection}>
                <TopStats metric="topSavesRate" data={league.topPlayerStats.topSavesRate} />
                <TopStats metric="topGoalsConcededRate" data={league.topPlayerStats.topGoalsConcededRate} />
                <TopStats metric="topSavePercentage" data={league.topPlayerStats.topSavePercentage} />
                <TopStats metric="topRecoveryRate" data={league.topPlayerStats.topRecoveryRate} />
            </div>
        </>
    )
}
