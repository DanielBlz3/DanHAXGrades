'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations';
import '/styles/global.css';

const RenderPlayerStatsUi = ({ groupedStats, visible, playerData, playerInfo }) => {
    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || 'es';
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setLanguage(storedLanguage);
        setTheme(storedTheme);
    }, [playerData]);

    function getRatingClass(rating, isMvp) {
      //COLOR DEPENDS ON RATING, RETURNS A CSS
        let ratingColor;
        if (isMvp === true) ratingColor = "var(--RATING-BLUE)";
        else if (rating < 5.5) ratingColor = "var(--RATING-RED)";
        else if (rating < 6.949) ratingColor = "var(--RATING-ORANGE)";
        else ratingColor = "var(--RATING-GREEN)";

        return css`
        background-color: ${ratingColor};
        color: white;
        font-weight: bold;
        border-radius: 1rem;
        padding: 0.025rem 0.3rem;
        cursor: default;
        `;
    }

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
      gap: 4px;
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
    return (
        visible && playerData ? (
            <>
                <div css={playerUiOverlay} className="player-ui-overlay" style={{ display: 'flex' }}></div>
                <div css={playerUi} className="player-ui" style={{ display: 'flex' }}>
                    <div css={playerUiHeader}>
                        <a css={playerUiName} href={`/players/${playerData.id}`}> {playerData.name} </a>
                        <div css={headerMetric}>
                            <div css={headerMetricItem}>
                                <span>{playerInfo?.["1"].position || playerData.position || "N/A" /*Prioritize match position, then player position.*/}</span> 
                                <span css={playerUiBioMetric}>{translationsMap?.["position"]?.[language]}</span>
                            </div>
                            <div css={headerMetricItem}>
                                <span css={getRatingClass(playerInfo?.["1"].matchRating || 6.0, playerInfo?.["1"].isMvp || false)}> {playerInfo?.["1"].matchRatingRounded || ""}</span>
                                <span css={playerUiBioMetric}>{translationsMap?.["matchRating"]?.[language]}</span>
                            </div>
                            <div css={headerMetricItem}>
                                <div css={playerUiNationality}>
                                    <img height="17" width="17" src={playerData.nationFlag} />
                                    <span >{playerData.nationName}</span>
                                </div>
                                <span css={playerUiBioMetric}>{translationsMap?.["country"]?.[language]}</span>
                            </div>
                        </div>
                    </div>
                    <div css={playerUiMain}>
                        <div css={playerUiStats}>
                            {Object.entries(groupedStats).map(([section, stats]) => (
                                <div key={section} css={statGroup}>
                                    <h3 css={statGroupTitle}>
                                        {translationsMap?.[section]?.[language]}
                                    </h3>
                                    {stats.map(([label, value], i) => (
                                        <span key={i} css={statLine}>
                                            {label}: {value}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        ) : null

    );
};

export default RenderPlayerStatsUi