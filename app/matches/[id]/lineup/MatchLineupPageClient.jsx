'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations';
import getPlayerUiStats from '/lib/getPlayerUiStats.js';
import RenderPlayerStatsUi from '/components/match/PlayerStatsUI.jsx';
import Lineup from '/components/match/Lineup.jsx';
import '/styles/global.css';

export default function MatchLineupPageClient({ match }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setLanguage(storedlanguage)
        setTheme(storedTheme);
    }, [match]);

    const matchContent = css`
      display: grid;
      overflow-x: hidden;
      width: 100%;
    `;

    const matchContentWrapper = css`
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: center;
    `;

    const playersInMatch = [...Object.entries(match.lineup.home.players), ...Object.entries(match.lineup.away.players)]

    const [visible, setVisible] = useState(false);
    const [playerData, setPlayerData] = useState(null);
    const [playerStats, setPlayerStats] = useState(null);
    useEffect(() => {
        const handleHashChange = async () => {
            const hash = window.location.hash;
            const playerId = Number(new URLSearchParams(hash.slice(1)).get("player"));

            if (playerId) {
                try {
                    const res = await fetch(`/api/playersShort/${playerId}`);
                    const data = await res.json();
                    setPlayerData(data);
                    setPlayerStats(playersInMatch.find(p => Number(p[0]) === playerId));
                    setVisible(true);
                    document.body.classList.add("no-scroll");
                } catch (err) {
                    console.error("Error fetching player data", err);
                }
            } else {
                setVisible(false);
                setPlayerData(null);
                setPlayerStats(null);
                document.body.classList.remove("no-scroll");
            }
        };

        const handleClickOutside = (e) => {
            if (
                !e.target.closest('.player-ui') &&
                !e.target.closest('.player') // assumes clickable players have this class
            ) {
                setVisible(false);
                setPlayerData(null);
                setPlayerStats(null);
                document.body.classList.remove("no-scroll");
                window.location.hash = '';
            }
        };

        handleHashChange(); // run once on load
        window.addEventListener('hashchange', handleHashChange);
        document.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            document.removeEventListener('click', handleClickOutside);
            document.body.classList.remove("no-scroll");
        };
    }, []);

    return (
        <div>
            <div css={matchContent}>
                <div css={matchContentWrapper}>
                    <Lineup match={match} hasSubs={true} hasLineupInfo={true} />
                </div>
            </div>
            <RenderPlayerStatsUi groupedStats={getPlayerUiStats(playerStats)} visible={visible} playerData={playerData} playerInfo={playerStats} />
        </div>
    )
}