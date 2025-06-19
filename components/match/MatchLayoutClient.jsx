'use client';
import Link from 'next/link';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { translationsMap } from '/lib/translations';
import { usePathname } from 'next/navigation'
import '/styles/global.css';

export default function Layout({ match, children }) {
    const pathname = usePathname()
    const router = useRouter();
    const path = usePathname();
    const currentTab = path.split('/').pop(); // gets last segment like 'stats'
    const [activeTab, setActiveTab] = useState(currentTab);
    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        setActiveTab(currentTab);
    }, [currentTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        router.push(`/matches/${match.general.matchId}/${tab}`, { scroll: false });
    };

    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
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
  align-items: start;
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
`;

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

    const nav = css`
  background-color: var(--card-bg-main);
  border-radius: 0 0 1.5rem 1.5rem;
  height: 2.5rem;
  padding-left: 2rem;
  width: 100%;
`;

    const navWrapper = css`
  display: flex;
  flex-flow: row;
  height: 100%;
  width: 75%;
  align-items: center;
`;

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

    const goalscorersBall = css`
  justify-self: center;
`;

    const aggregateAndPens = css`
  color: var(--GLOBAL-FONT-COLOR-GREY);
  font-size: 14px;
`;

    const renderScoreBoard = () => {
        const scoreline = match.matchStatus.scoreStr
        const statusStart = match.matchStatus.started
        const status = match.matchStatus.statusShort
        const aggregateEl = match.matchStatus.aggregateScore ? (<div css={aggregateAndPens}> {`${translationsMap?.["aggregate"]?.[language]}: (${match.matchStatus.aggregateScore})`} </div>) : null
        const pensEl = match.matchStatus.penScore ? (<div css={aggregateAndPens}> {`${translationsMap?.["pen"]?.[language]}: ${match.matchStatus.penScore}`} </div>) : null

        if (statusStart) {
            return (
                <div css={scoreBoard}>
                    <h2>{scoreline}</h2>
                    <div css={matchStatus}>{translationsMap?.[status]?.[language]}</div>
                    {aggregateEl}
                    {pensEl}
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

    const GoalScorers = ({ team }) => {
        const teamGoals = match.timeline.filter(i => (i.type === "goal" && i.team === team))
        const textAlign = team === "home" ? "right" : "lfet"
        const goalscorersCSS = css`
    display: flex;
    flex-flow: column;
  text-align: ${textAlign};
`;

        const goalScorerTextCSS = css`
color: var(--primary-font-color);
text-decoration: none;
`

        const goalScorersContent = teamGoals.map(i => {
            const goalScorerText = i.goalType === "ownGoal" ? `${i.goalscorerName} ${i.minute}' (OG)` : `${i.goalscorerName} ${i.minute}'`
            return (
                <a
                    href={i.goalscorerPageUrl}
                    key={i.goalscorerId}
                    css={goalScorerTextCSS}
                    className='third-hover'
                >{goalScorerText}</a>
            )
        })
        return (
            <div css={goalscorersCSS}>
                {goalScorersContent}
            </div>
        )
    }

    const renderNav = () => {
        const [canRenderStatsSection, canRenderLineupSection, renderTimelineSection] = ["FT", "Live", "AET"].includes(match.matchStatus.statusShort) ? [true, true, true] : [false, false, false];
        const renderForecastSection = match.matchStatus.started ? false : true;

        const overviewSection = (
            <button
                onClick={() => handleTabClick('overview')}
                className={`nav-item ${activeTab === 'overview' ? 'nav-highlight' : ''}`}
            >
                {translationsMap?.["overview"]?.[language]}
            </button>
        );

        const standingsSection = (
            <button
                onClick={() => handleTabClick('standings')}
                className={`nav-item ${activeTab === 'standings' ? 'nav-highlight' : ''}`}
            >
                {translationsMap?.["standings"]?.[language]}
            </button>
        );

        const statsSection = canRenderStatsSection ? (
            <button
                onClick={() => handleTabClick('lineup')}
                className={`nav-item ${activeTab === 'lineup' ? 'nav-highlight' : ''}`}
            >
                {translationsMap?.["lineup"]?.[language]}
            </button>
        ) : null;

        const lineupSection = canRenderLineupSection ? (
            <button
                onClick={() => handleTabClick('stats')}
                className={`nav-item ${activeTab === 'stats' ? 'nav-highlight' : ''}`}
            >
                {translationsMap?.["stats"]?.[language]}
            </button>
        ) : null;

        const forecastSection = renderForecastSection ? (
            <button
                onClick={() => handleTabClick('forecast')}
                className={`nav-item ${activeTab === 'forecast' ? 'nav-highlight' : ''}`}
            >
                {translationsMap?.["forecast"]?.[language]}
            </button>
        ) : null;

        const timelineSection = renderTimelineSection ? (
            <button
                onClick={() => handleTabClick('timeline')}
                className={`nav-item ${activeTab === 'timeline' ? 'nav-highlight' : ''}`}
            >
                {translationsMap?.["timeline"]?.[language]}
            </button>
        ) : null;

        return (
            <nav css={nav}>
                <div css={navWrapper}>
                    {overviewSection}
                    {statsSection}
                    {lineupSection}
                    {forecastSection}
                    {timelineSection}
                    {standingsSection}
                </div>
            </nav>
        );
    }

    const roundName = typeof match.general.round == "number" ? `${match.general.leagueName} ${translationsMap?.["round"]?.[language]} ${match.general.roundName}` : `${match.general.leagueName} ${translationsMap?.[match.general.roundName]?.[language]}`
    return (
        <div className='global-left-grid'>
            <div css={scoreBoardAndNav}>
                <div css={matchLeagueWrapper}>
                    <div css={leagueWrapper}>
                        <img src={match.general.leagueLogo}
                            width="25px" height="25px" />
                        <a href={"/leagues/" + match.general.leagueId + "/overview"} css={leagueLink} className='third-hover'>{roundName}</a>
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
                        <GoalScorers team="home" />
                        <div css={goalscorersBall}>⚽</div>
                        <GoalScorers team="away" />
                    </div>
                </div>
                {renderNav()}
            </div>
            {children}
        </div>
    );
}
