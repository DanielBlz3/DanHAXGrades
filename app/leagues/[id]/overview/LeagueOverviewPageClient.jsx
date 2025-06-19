'use client';
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from '@emotion/react';
import { translationsMap } from '/lib/translations.js';
import '/styles/global.css';
import Table from '/components/Table.jsx';
import TopStats from '/components/TopStats';

export default function LeagueOverviewPageClient({ league }) {
    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedLanguage);
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [league]);

    const tableCard = css`
    border-radius: 1.5rem;
    justify-self: center;
    background-color: var(--card-bg-main);
  `;

    const fixturesCard = css`
    display: flex;
    flex-flow: column;
    border-radius: 1.25rem;
    background-color: var(--card-bg-main);
  `;

    const fixturesContent = css`
    display: flex;
    flex-flow: row;
    justify-content: center;
    gap: 25px;
    padding: 1rem;

    @media (max-width: 800px) {
      flex-flow: column;
    }
  `;

    const fixturesHeader = css`
    display: flex;
    flex-flow: row;
    width: 100%;
    padding: 1rem;
  `;

    const fixturesTitle = css`
    flex: 1;
  `;

    const fixturesHeaderLink = css`
    color: var(--GLOBAL-DANHAXGRADES-SCHEME);
    text-decoration: none;
    justify-self: end;
    align-content: center;
    padding-right: 1rem;
    font-weight: 600;
  `;

    const fixturesOverviewItem = css`
    flex: 1;
    display: flex;
    flex-flow: row;
    border: solid 1px var(--third-divider-bg);
    border-radius: 1rem;
    min-height: 20px;
    align-items: center;
    padding-block: 1rem;
    text-decoration: none;
    color: var(--font-default-color);
  `;

    const fixturesOverviewTeam = css`
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
  `;

    const statsCard = css`
    background-color: var(--card-bg-main);
    border-radius: 1.25rem;
    padding: 1rem;
  `;

    const statsWrapper = css`
    display: flex;
    flex-flow: row;
      > * {
    border-right: 1px solid var(--primary-divider-bg);
    border-radius: 0;
    }
    
    @media (max-width: 800px) {
      flex-flow: column;
      > * {
        border: none;
      }
    }

    > :last-child {
      border: none;
    }
  `;

    const RenderTables = () => {
        return (
            <>
                {league.table.table.map((item, index) => (
                    <Table
                        key={index}
                        match={null}
                        leagueTable={league.table}
                        id={index}
                        showTitle={index === 0}
                    />
                ))}
            </>
        );
    };

    const RenderOverviewFixtures = () => {
        return (
            <div css={fixturesContent}>
                {league.fixtures
                    .filter((m) => !m.status.started)
                    .slice(0, 3)
                    .map((m) => (
                        <a
                            key={m.id}
                            href={m.pageUrl}
                            css={fixturesOverviewItem}
                            className="secondary-hover"
                        >
                            <div css={fixturesOverviewTeam}>
                                <img src={m.home.logo} alt={m.home.teamNameShort} width={25} height={25} />
                                <span>{m.home.teamNameShort}</span>
                            </div>
                            <span>{m.matchDate}</span>
                            <div css={fixturesOverviewTeam}>
                                <img src={m.away.logo} alt={m.away.teamNameShort} width={25} height={25} />
                                <span>{m.away.teamNameShort}</span>
                            </div>
                        </a>
                    ))}
            </div>
        );
    };

    return (
        <>
            <div css={fixturesCard}>
                <div css={fixturesHeader}>
                    <h2 css={fixturesTitle}>{translationsMap?.["fixtures"]?.[language]}</h2>
                    <a
                        css={fixturesHeaderLink}
                        className="third-hover"
                        href={`/leagues/${league.leagueDetails.id}/fixtures`}
                    >
                        {translationsMap?.["everyMatch"]?.[language]}
                    </a>
                </div>
                <RenderOverviewFixtures />
            </div>

            <div className="global-content-wrapper">
                <div className="global-left-grid">
                    <div css={tableCard}>
                        <RenderTables />
                    </div>

                    <div css={statsCard}>
                        <div css={statsWrapper}>
                            <TopStats metric="topGoals" data={league.topPlayerStats.topGoals} />
                            <TopStats metric="topAssists" data={league.topPlayerStats.topAssists} />
                            <TopStats metric="topMatchRatings" data={league.topPlayerStats.topMatchRatings} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
