'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations';
import RenderTeamStrengths from '/components/match/RenderTeamStrengths';
import RenderTeamWeaknesses from '/components/match/RenderTeamWeaknesses';
import RenderMatchForecast from '/components/match/RenderMatchForecast';
import '/styles/global.css';

export default function MatchLineupPageClient({ match, teamStats }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [match]);

    const teamTraitsCard = css`
    display: flex;
    flex-flow: column;
      background-color: var(--card-bg-main);
  border-radius: 1.25rem;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
    `;
    const teamTraitsHeader = css`
    display: flex;
      justify-content: center;
  align-items: center;
  height: 4rem;
    `;

    const teamTraitsWrapper = css`
    width: 100%;
    padding: 1rem;
    `;

    const teamTraitsContent = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
        grid-gap: 2rem
    `;

    const forecastContent = css`
    display: flex;
    flex-flow: column;
    width: 100%;
    padding: .5rem;
    `
    return (
        <div>
            <div css={teamTraitsCard}>
                <div css={forecastContent}>
                    <RenderMatchForecast teams={match.general} teamStats={teamStats} />
                </div>
                <div css={teamTraitsWrapper}>
                    <div css={teamTraitsHeader}>
                        <h2>{translationsMap?.["teamTraits"]?.[language]}</h2>
                    </div>
                    <div css={teamTraitsContent}>
                        <RenderTeamStrengths team={match.general.home} teamStats={teamStats} />
                        <RenderTeamStrengths team={match.general.away} teamStats={teamStats} />
                        <RenderTeamWeaknesses team={match.general.home} teamStats={teamStats} />
                        <RenderTeamWeaknesses team={match.general.away} teamStats={teamStats} />
                    </div>
                </div>
            </div>
        </div>
    )
}