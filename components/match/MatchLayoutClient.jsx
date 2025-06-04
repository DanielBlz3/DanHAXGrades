'use client';
import Link from 'next/link';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { translationsMap } from '/lib/translations';
import formatMatchTimestamp from '/lib/timeFormatter';
import '/styles/global.css';



export default function Layout({ match, children }) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'lineup';
    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    const [activeTab, setActiveTab] = useState(defaultTab);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        router.push(`/matches/${match.general.matchId}/${tab}`, { scroll: false });
    };

    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const updateThemeColors = () => {
            const storedTheme = localStorage.getItem('theme') || 'theme-light';
            setTheme(storedTheme);
        };

        updateThemeColors();

        window.addEventListener('themechange', updateThemeColors);

        return () => {
            window.removeEventListener('themechange', updateThemeColors);
        };
    }, [match]);


    const scoreBoardAndNav = css`
  background-color: var(--card-bg-main);
  border-radius: 1.25rem;
  width: 100%;
`;

    const scoreBoardContainer = css`
  display: grid;
  font-weight: bold;
  grid-auto-flow: column;
  grid-template-columns: 1fr 0.5fr 1fr;
  padding: 1.5rem 5rem;
`;

    const scoreBoard = css`
  display: flex;
  flex-direction: column;
  place-items: center;
  text-align: center;
`;

    const matchLeagueWrapper = css`
  border-bottom: 1px solid var(--third-divider-bg);
  border-radius: 0.5rem 0.5rem 0 0;
  display: flex;
  height: 64px;
  justify-content: center;
`;

    const matchStatus = css`
  align-items: center;
  color: var(--GLOBAL-FONT-COLOR-GREY);
`;

    const leagueWrapper = css`
  align-items: center;
  display: flex;
  gap: 5px;
`;

const leagueLink = css`
  color: var(--primary-font-color);
  text-decoration: none;
`

    const scoreBoardTeam = css`
  color: var(--primary-font-color);
  display: flex;
  flex-flow: row;
  gap: 10px;
  justify-content: center;
  overflow: wrap;
  place-items: center;
  text-decoration: none;

  @media (max-width: 800px) {
    flex-flow: column;
  }
`;

    const matchNav = css`
  align-items: center;
  border-radius: 0 0 1.5rem 1.5rem;
  display: flex;
  flex-flow: row;
  gap: 3rem;
  height: 7.5vh;
  padding-inline: 3rem;
  width: 100%;
`;

    const navItem = css`
    background-color: var(--card-bg-main);
    color: var(--nav-item-font-color);
  border: none;
  font-weight: 600;
  cursor: pointer;
  height: 100%;
  width: 20%;

  &:hover {
  color: var(--primary-font-color)
  }
    `

    const goalScorersContianer = css`
  display: flex;
  flex-flow: row;
  justify-content: center;
  padding-block: 1rem;
`;

    const goalScorersWrapper = css`
  color: rgb(175, 175, 175);
  column-gap: none;
  display: grid;
  font-size: 0.8rem;
  font-weight: bold;
  grid-template-columns: 1fr 1fr 1fr;
`;

    const goalscorersHome = css`
  text-align: right;
`;

    const goalscorersAway = css`
  text-align: left;
`;

    const goalscorersBall = css`
  justify-self: center;
`;

    const renderScoreBoard = () => {
        const scoreline = match.matchStatus.scoreStr
        const statusStart = match.matchStatus.started
        const status = match.matchStatus.statusShort

        if (statusStart) {
            return (
                <div css={scoreBoard}>
                    <h2>{scoreline}</h2>
                    <div css={matchStatus}>{translationsMap?.[status]?.[language]}</div>
                </div>
            )
        } else {
            return (
                <div css={scoreBoard}>
                    <h2>{status.time}</h2>
                    <div css={matchStatus}>{status.date}</div>
                </div>
            )
        }
    }

    const renderScorers = () => {

    }

    const renderNav = () => {
        const [canRenderStatsSection, canRenderLineupSection] = ["FT", "Live", "AET"].includes(match.matchStatus.statusShort) ? [true, true] : [false, false]
        const renderForecastSection = match.matchStatus.started ? false : true
        const overviewSection = <button css={navItem} onClick={() => handleTabClick('overview')}>{translationsMap?.["overview"]?.[language]}</button>
        const statsSection = canRenderStatsSection ? <button css={navItem} onClick={() => handleTabClick('lineup')}>{translationsMap?.["lineup"]?.[language]}</button> : null
        const lineupSection = canRenderLineupSection ? <button css={navItem} onClick={() => handleTabClick('stats')}>{translationsMap?.["stats"]?.[language]}</button> : null
        const forecastSection = renderForecastSection ? <button css={navItem} onClick={() => handleTabClick('forecast')}>{translationsMap?.["forecast"]?.[language]}</button> : null

        return (
            <nav css={matchNav}>
                {overviewSection}
                {statsSection}
                {lineupSection}
                {forecastSection}
            </nav>
        )
    }

    return (
        <div className='match-left-grid'>
            <>
                <div css={scoreBoardAndNav}>
                    <div css={matchLeagueWrapper}>
                        <div css={leagueWrapper}>
                            <img src={match.general.leagueLogo}
                                width="25px" height="25px" />
                            <a href={"/leagues/" + match.general.leagueId + "/overview"} css={leagueLink} className='third-hover'>{`${match.general.leagueName} ${translationsMap?.["round"]?.[language]} ${match.general.roundName}`}</a>
                        </div>
                    </div>
                    <div css={scoreBoardContainer}>
                        <a href={match.general.home.pageUrl} css={scoreBoardTeam} className='third-hover'>
                            <div>
                                <img data-team-logo="home"
                                    src={match.general.home.logo}
                                    width="24px" />
                            </div>
                            <span>{match.general.home.name}</span>
                        </a>
                        {renderScoreBoard()}
                        <a href={match.general.away.pageUrl} css={scoreBoardTeam} className='third-hover'>
                            <div>
                                <img data-team-logo="away"
                                    src={match.general.away.logo}
                                    width="24" />
                            </div>
                            <span>{match.general.away.name}</span>
                        </a>
                    </div>
                    <div css={goalScorersContianer}>
                        <div css={goalScorersWrapper}>
                            <div css={goalscorersHome}></div>
                            <div css={goalscorersBall}>⚽</div>
                            <div css={goalscorersAway}></div>
                        </div>
                    </div>
                    {renderNav()}
                </div>
            </>
            <>
                {children}
            </>
        </div>
    );
}
