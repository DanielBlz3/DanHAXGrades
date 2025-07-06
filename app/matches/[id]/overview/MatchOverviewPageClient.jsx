'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { translationsMap } from '/lib/translations.js';
import getPlayerUiStats from '/lib/getPlayerUiStats.js';
import MatchTimeline from '/components/match/MatchTimeline';
import Lineup from '/components/match/Lineup.jsx';
import MatchStats from '/components/match/MatchStats.jsx';
import RenderTeamStrengths from '/components/match/RenderTeamStrengths';
import RenderTeamWeaknesses from '/components/match/RenderTeamWeaknesses';
import RenderPlayerStatsUi from '/components/match/PlayerStatsUI.jsx';


export default function MatchOverviewPageClient({ match, teamStats }) {

     const router = useRouter();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'lineup';
    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    const [visible, setVisible] = useState(false);
    const [playerData, setPlayerData] = useState(null);
    const [playerStats, setPlayerStats] = useState(null);


    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
        const storedLanguage = localStorage.getItem('language') || 'theme-light';
        setLanguage(storedLanguage);
    })

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

    const playerUi = css`
      background-color: var(--player-ui-bg-color);
      border-radius: 1rem;
      bottom: 45%;
      color: var(--primary-font-color);
      display: none;
      flex-direction: column;
      position: fixed;
      right: 50%;
      transform: translate(50%, 50%);
      width: 400px;
      z-index: 1000;
    `;

    const playerUiOverlay = css`
      background: rgba(0, 0, 0, 0.7);
      display: none;
      height: 100%;
      left: 0;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
    `;

    const playerUiHeader = css`
      align-items: center;
      background-color: var(--primary-card-bg);
      border-radius: 1rem 1rem 0 0;
      display: flex;
      flex-direction: column;
      gap: 15px;
      justify-content: center;
      max-height: 100px;
      min-height: 67.5px;
      padding-top: 1.5rem;
      width: 100%;
      z-index: 111111;
    `;

    const playerUiName = css`
      color: var(--font-default-color);
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
    
      &:hover {
        text-decoration: underline;
      }
    `;

    const playerUiMain = css`
      max-height: 350px;
      overflow-y: scroll;
      padding-top: 1rem;
    `;

    const playerUiStats = css`
      display: flex;
      flex-direction: column;
      padding-left: 10px;
    `;

    const playerUiNationality = css`
      display: flex;
      flex-flow: row;
    align-items: center;
      gap: 9x;
      justify-content: center;
    `;

    const headerMetric = css`
      background-color: var(--primary-card-bg);
      border-bottom: solid 0.25px rgb(75, 75, 75);
      display: flex;
      flex-direction: row;
      padding-bottom: 1rem;
      width: 100%;
    `;

    const headerMetricItem = css`
      align-items: center;
      display: flex;
      flex-direction: column;
      flex: 1;
    `;

    const playerUiBioMetric = css`
      color: grey;
    `;

    const statGroup = css`
      display: flex;
      flex-direction: column;
    `;

    const statGroupTitle = css`
      height: 2rem;
    `;

    const statLine = css`
      line-height: 2;
    `;

    const teamTraitsCard = css`
        display: flex;
        flex-flow: column;
          background-color: var(--primary-card-bg);
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

    const playersInMatch = [...Object.entries(match.lineup.home.players), ...Object.entries(match.lineup.away.players)]

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
                    <MatchStats match={match} visible={match.matchStatus.started && !match.matchStatus.awarded} acceptedStats={['shots', 'keyPasses', 'possession', 'touches']} />
                    <MatchTimeline match={match} />
                    <Lineup match={match} hasSubs={false} hasLineupInfo={true} />
                    <RenderPlayerStatsUi groupedStats={getPlayerUiStats(playerStats)} visible={visible} playerData={playerData} playerStats={playerStats} />
                    <div css={teamTraitsCard}>
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
            </div>
            <RenderPlayerStatsUi groupedStats={getPlayerUiStats(playerStats)} visible={visible} playerData={playerData} playerInfo={playerStats} />
        </div>
    );
}