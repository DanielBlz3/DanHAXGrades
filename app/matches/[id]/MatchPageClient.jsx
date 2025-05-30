'use client';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import React from "react";
import { translationsMap } from '/lib/translations.js';
import formatMatchTimestamp from '/lib/timeFormatter.js';
import '/styles/global.css';
import positionCoords from '/lib/posCoordsPlayerPosMap.json';
import SoccerField from '/components/pitchSVGVertical.jsx';

function isDark(rgbString) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = rgb;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness < 50;
}
function isLight(rgbString) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = rgb;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness >= 200;
}

export default function MatchPageClient({ match }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        console.log("useEffect running");

        const updateThemeColors = () => {
            console.log("Updating theme colors...");
            const storedTheme = localStorage.getItem('theme') || 'theme-light';
            setTheme(storedTheme);
            const root = document.documentElement;
        };

        updateThemeColors();

        window.addEventListener('themechange', updateThemeColors);
        console.log("Listener added for themechange");

        return () => {
            window.removeEventListener('themechange', updateThemeColors);
            console.log("Listener removed for themechange");
        };
    }, [match]);

    const scoreBoardAndNav = css`
  width: 100%;
  justify-self: center;
   background-color: var(--card-bg-main);
   border-radius: 1.25rem
    `;

    const matchLeagueWrapper = css`
    display: flex;
    justify-content: center;
  border-radius: 0.5rem 0.5rem 0 0;
  border-bottom: 1px solid var(--divider-bg-third);
  height: 64px;
  `;

    const leagueWrapper = css`
  display: flex;
  gap: 5px;
  align-items: center
`;

    const scoreBoardContainer = css`
font-weight: bold;
  padding-block: 1.5rem;
  padding-inline: 5rem;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 0.5fr 1fr;
`;

    const scoreBoardTeam = css`
display: flex;
  flex-flow: row;
  gap: 10px;
  justify-content: center;
place-items: center;
  overflow: wrap;
  color: var(--primary-font-color);
  text-decoration: none;
    &:hover {
      text-decoration: underline;
    }

  @media (max-width: 800px) {
    flex-flow: column;
    }
`;

    const scoreBoard = css`
  display: flex;
  flex-flow: column;
  place-items: center;
  text-align: center;
`;

    const matchStatus = css`
  align-items: center;
  color: rgb(175, 175, 175);

`;


    const renderScoreBoard = () => {
        const scoreline = match.matchStatus.scoreStr
        const status = match.matchStatus.statusShort
        console.log(status)

        if (status && status !== "") {
            return (
                <div css={scoreBoard}>
                    <h2>0-0</h2>
                    <div csc={matchStatus}>{translationsMap?.[status]?.[language]}</div>
                </div>
            )
        } else {
            <div css={scoreBoard}>
                <h2>{status.time}</h2>
                <div csc={matchStatus}>{status.date}</div>
            </div>

        }
    }


    return (
        <div>
            <div css={scoreBoardAndNav}>
                <div css={matchLeagueWrapper}>
                    <div css={leagueWrapper}>
                        <img src="https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/leaguelogo.png?v=1740718276716"
                            width="18px" height="18px" />
                        <span>Exanon Round 1 </span>
                    </div>
                </div>
                <div css={scoreBoardContainer}>
                    <a href={match.general.home.pageUrl} css={scoreBoardTeam}>
                        <div>
                            <img data-team-logo="home"
                                src={match.general.home.logo}
                                width="24px" />
                        </div>
                        <span>{match.general.home.name}</span>
                    </a>
                    {renderScoreBoard()}
                    <a href={match.general.away.pageUrl} css={scoreBoardTeam}>
                        <div>
                            <img data-team-logo="away"
                                src={match.general.away.logo}
                                width="24" />
                        </div>
                        <span>{match.general.away.name}</span>
                    </a>
                </div>
                <div class="containerthree">
                    <div id="goalscorershome" class="GoalscorersHome"></div>
                    <div class="ball">⚽</div>
                    <div id="goalscorersaway" class="GoalscorersAway"></div>
                </div>
            </div>
        </div>
    );
}
