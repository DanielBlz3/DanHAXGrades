'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { translationsMap } from '/lib/translations';
import '/styles/global.css';

const PlayersStats = ({ players }) => {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    const [playerStatsMode, setPlayerStatsMode] = useState('outfielder');
    const [focusedStat, setFocusedStat] = useState('matchRating');

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || 'es';
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setLanguage(storedLanguage);
        setTheme(storedTheme);
    }, [players]);

    const playerStatsCSS = css`
    margin-top: 1rem;
    display: flex;
    flex-flow: column;
    border-radius: 1.25rem;
    background-color: var(--primary-card-bg);
    align-items: start;
    justify-content: start;
    `;

    const header = css`
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 4rem;
    padding: 1rem;
    gap: 20%;
    `;

    const statsNav = css`
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    `;
    
    const contentHeader = css`
    display: grid;
    grid-template-columns: 2fr repeat(8, 1fr);
    align-items: center;
    justify-items: center;
    width: 100%;
    
    border-top: solid 1px var(--secondary-divider-bg);
    border-bottom: solid 1px var(--secondary-divider-bg);
    > :first-child {
    border-left: none;
    }
    @media (max-width: 900px) {
    grid-template-columns: 2fr repeat(6, 1fr);

        > :nth-child(8),
        > :nth-child(9) {
        display: none;
        }
    }
    @media (max-width: 800px) {
    grid-template-columns: 2fr repeat(4, 1fr);

        > :nth-child(6),
        > :nth-child(7) {
        display: none;
        }
    }
    `;

    const playerStatsBtn = css`
    max-width: 200px;
    border-radius: 1.25rem;
    padding-inline: 1.5rem;
    padding-block: .75rem;
    text-align: center;
    font-weight: bold;
    box-shadow: none;
    border: none;
    outline: none;
    cursor: pointer;
    `;

    const contentHeaderItem = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 3.5rem;
    min-width: 100%;
    max-width: 100%;
    background-color: rgba(0, 0, 0, 0);
    color: var(--GLOBAL-FONT-COLOR-GREY);
    border: none;
    border-left: solid 1px var(--secondary-divider-bg);
    cursor: pointer;
    hyphens: auto;
    word-break: normal;
    overflow-wrap: break-word;
    
    &:active {
    background-color: var(--secondary-card-bg);
    }
    `;

    function getActiveButtonPlayerMode(mode) {
        if (mode === playerStatsMode) {
            return css`
            background-color: var(--percentile-button-toggled-bg);
            color: var(--percentile-button-toggled-font-color);
            `;
        } else {
            return css`
            background-color: var(--percentile-button-default-bg);
            color: var(--percentile-button-default-font-color);

            &:hover {
            background-color: var(--percentile-button-hover-bg);
            }
            `;
        }
    }

    const RenderContentHeader = (mode) => {

        function getActiveButtonStats(stat) {
            if (stat === focusedStat) {
                return css`
        background-color: var(--secondary-card-bg)
        `
            }
        }

        if (mode === "goalkeeper") {
            return (
                <div css={contentHeader}>
                    <div css={contentHeaderItem}>{translationsMap?.["player_UCase"]?.[language]}</div>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('matchRating')]} onClick={() => setFocusedStat('matchRating')} >{translationsMap?.["matchRating"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('minutes')]} onClick={() => setFocusedStat('minutes')} >{translationsMap?.["minutes"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('saves')]} onClick={() => setFocusedStat('saves')} >{translationsMap?.["saves"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('goalsConceded')]} onClick={() => setFocusedStat('goalsConceded')} >{translationsMap?.["goalsConceded"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('recovories')]} onClick={() => setFocusedStat('recovories')} >{translationsMap?.["gkRecovories"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('gkPunches')]} onClick={() => setFocusedStat('gkPunches')} >{translationsMap?.["gkPunches"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('actedAsSweeper')]} onClick={() => setFocusedStat('actedAsSweeper')} >{translationsMap?.["actedAsSweeper"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('touches')]} onClick={() => setFocusedStat('touches')} >{translationsMap?.["touches"]?.[language]}</button>
                </div>
            )
        } else {
            return (
                <div css={contentHeader}>
                    <div css={contentHeaderItem}>{translationsMap?.["player_UCase"]?.[language]}</div>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('matchRating')]} onClick={() => setFocusedStat('matchRating')} >{translationsMap?.["matchRating"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('minutes')]} onClick={() => setFocusedStat('minutes')} >{translationsMap?.["minutes"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('goals')]} onClick={() => setFocusedStat('goals')} >{translationsMap?.["goals"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('assists')]} onClick={() => setFocusedStat('assists')} >{translationsMap?.["assists"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('touches')]} onClick={() => setFocusedStat('touches')} >{translationsMap?.["touches"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('passesC')]} onClick={() => setFocusedStat('passesC')} >{translationsMap?.["passesC"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('keyPasses')]} onClick={() => setFocusedStat('keyPasses')} >{translationsMap?.["keyPasses"]?.[language]}</button>
                    <button className="secondary-hover" css={[contentHeaderItem, getActiveButtonStats('defensiveActions')]} onClick={() => setFocusedStat('defensiveActions')} >{translationsMap?.["defensiveActions"]?.[language]}</button>
                </div>
            )
        }
    }

    const RenderContentMain = (players, stat) => {

        const playerStatsItem = css`
        display: grid;
        grid-template-columns: 2fr repeat(8, 1fr);
        align-items: center;
        justify-items: center;
        width: 100%;
        height: 3rem;

        @media (max-width: 900px) {
        grid-template-columns: 2fr repeat(6, 1fr);

            > :nth-child(8),
            > :nth-child(9) {
            display: none;
            }
        }
        @media (max-width: 800px) {
        grid-template-columns: 2fr repeat(4, 1fr);

            > :nth-child(6),
            > :nth-child(7) {
            display: none;
            }
        }
        
        `;

        const player = css`
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        justify-self: start;
        margin-left: 1rem;
        gap: .5rem;
        text-decoration: none;
        color: var(--primary-font-color);
        `;

        const playerImage = css`
        background-color: var(--primary-player-bg-color);
        border-radius: 50%;
        `;

        const playerItem = css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        border-left: solid 1px var(--secondary-divider-bg);
        font-size: .85rem;
        `;

        let content = <></>
        if (playerStatsMode === "outfielder") {
            const sortedPlayers = stat === "matchRating" ? players.sort((a, b) => b["1"][stat] - a["1"][stat]) : players.sort((a, b) => b["1"].stats[stat] - a["1"].stats[stat])
            content = sortedPlayers.map(([idString, playerInfo]) => {
                const colorCss = playerInfo.matchRating > 6.949 ? 'var(--RATING-GREEN)' : playerInfo.matchRating > 5.449 ? 'var(--RATING-ORANGE)' : 'var(--RATING-RED)'
                return (
                    <div
                        className="secondary-hover"
                        css={playerStatsItem}
                        key={idString}
                    >
                        <a
                            css={player}
                            href={"/players/" + idString}

                        >
                            <img css={playerImage} src={playerInfo.avatar} width={25} height={25} />
                            <span>{playerInfo.name}</span>
                        </a>
                        <div css={playerItem}>
                            <span className="primary-rating" style={{ backgroundColor: colorCss }}>{playerInfo.matchRatingRounded}</span>
                        </div>
                        <span css={playerItem}>{playerInfo.stats.minutes}</span>
                        <span css={playerItem}>{playerInfo.stats.goals}</span>
                        <span css={playerItem}>{playerInfo.stats.assists}</span>
                        <span css={playerItem}>{playerInfo.stats.touches}</span>
                        <span css={playerItem}>{playerInfo.stats.passingA}</span>
                        <span css={playerItem}>{playerInfo.stats.keyPasses}</span>
                        <span css={playerItem}>{playerInfo.stats.defensiveActions}</span>
                    </div>
                )
            })
        } else {
            const sortedPlayers = stat === "matchRating" ? players.sort((a, b) => b["1"][stat] - a["1"][stat]) : players.sort((a, b) => b["1"].stats[stat] - a["1"].stats[stat])
            const filteredPlayers = sortedPlayers.filter(p => p["1"].position === "GK")
            content = filteredPlayers.map(([idString, playerInfo]) => {
                const colorCss = playerInfo.matchRating > 6.999 ? 'var(--RATING-GREEN)' : playerInfo.matchRating > 5.499 ? 'var(--RATING-ORANGE)' : 'var(--RATING-RED)'
                return (
                    <div
                        className="secondary-hover"
                        css={playerStatsItem}
                        key={idString}
                    >
                        <a
                            css={player}
                            href={"/players/" + idString}

                        >
                            <img css={playerImage} src={playerInfo.avatar} width={25} height={25} />
                            <span>{playerInfo.name}</span>
                        </a>
                        <div css={playerItem}>
                            <span className="primary-rating" style={{ backgroundColor: colorCss }}>{playerInfo.matchRatingRounded}</span>
                        </div>
                        <span css={playerItem}>{playerInfo.stats.minutes}</span>
                        <span css={playerItem}>{playerInfo.stats.saves}</span>
                        <span css={playerItem}>{playerInfo.stats.goalsConceded}</span>
                        <span css={playerItem}>{playerInfo.stats.gkRecovery}</span>
                        <span css={playerItem}>{playerInfo.stats.actedAsSweeper}</span>
                        <span css={playerItem}>{playerInfo.stats.gkPunches}</span>
                        <span css={playerItem}>{playerInfo.stats.touches}</span>
                    </div>
                )
            })
        }
        return (
            <>
                {content}
            </>
        )
    }

    return (
        <div css={playerStatsCSS}>
            <div css={header}>
                <h2>{translationsMap?.["playerStats"]?.[language]}</h2>
                <div css={statsNav}>
                    <button
                        css={[playerStatsBtn, getActiveButtonPlayerMode('outfielder')]}
                        onClick={() => setPlayerStatsMode("outfielder")}>
                        {translationsMap?.["playerStats"]?.[language]}
                    </button>
                    <button
                        css={[playerStatsBtn, getActiveButtonPlayerMode('goalkeeper')]}
                        onClick={() => setPlayerStatsMode("goalkeeper")}>
                        {translationsMap?.["gkStats"]?.[language]}
                    </button>
                </div>
            </div>
            {RenderContentHeader(playerStatsMode)}
            {RenderContentMain(players, focusedStat)}
        </div>
    )
}

export default PlayersStats