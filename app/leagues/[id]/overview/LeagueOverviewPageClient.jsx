
'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { translationsMap } from '/lib/translations.js';
import isDark from '/lib/isDark.js';
import isLight from '/lib/isLight.js';
import '/styles/global.css';
import Table from '/components/Table';

export default function LeagueOverviewPageClient({ league }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [league]);

    const tableCard = css`
              border-radius: 1.5rem;
          justify-self: center;
              background-color: var(--card-bg-main);
          ` ;

    const fixturesCard = css`
    display: flex;
    flex-flow: column;
    border-radius: 1.25rem;
    background-color: var(--card-bg-main);
    `
    const fixturesContent = css`
    display: flex;
    flex-flow: row;
    justify-content: center;
    gap: 25px;
    padding: 1rem;
    `
    const fixturesHeader = css`
    display: flex;
    flex-flow: row;
    width: 100%;
    padding: 1rem;
    `

    const fixturesTitle = css`
    flex: 1;
    `

    const fixturesHeaderLink = css`
    color: var(--GLOBAL-DANHAXGRADES-SCHEME);
    text-decoration: none;
    justify-self: end;
    align-content: center;
    padding-right: 1rem;
    font-weight: 600;
    `

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
    `

    const fixturesOverviewTeam = css`
        flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    gap: 10px;

    `

    const RenderTables = () => {
        const content = league.table.table.map((item, index) => {
            const showTitle = index === 0 ? true : false
            return (
                <Table
                    match={null} leagueTable={league.table} id={index} showTitle={showTitle} key={index}
                />
            )
        })
        return (
            <>
                {content}
            </>
        )
    }

    const RenderOverviewFixtures = () => {
        const content = league.fixtures.filter(m => !m.status.started).slice(0, 3).map(m => {
            const matchContent = m.matchDate
            return (
                <a 
                    key={m.id}
                    css={fixturesOverviewItem} href={m.pageUrl}
                    className="secondary-hover"
                    >
                    <div css={fixturesOverviewTeam}>
                        <img src={m.home.logo} alt={m.home.teamNameShort} width={25} height={25} />
                        <span>{m.home.teamNameShort}</span>
                    </div>
                    <span>{matchContent}</span>
                    <div css={fixturesOverviewTeam}>
                        <img src={m.away.logo} alt={m.away.teamNameShort} width={25} height={25} />
                        <span>{m.away.teamNameShort}</span>
                    </div>
                </a>
            )
        })
        return (
            <div css={fixturesContent}>
                {content}
            </div>
        )
    }

    return (
        <>
            <div css={fixturesCard}>
                <div css={fixturesHeader}>
                    <h2 css={fixturesTitle}>{translationsMap?.["fixtures"]?.[language]}</h2>
                    <a css={fixturesHeaderLink} className="third-hover" href={"/leagues/" + league.leagueDetails.id + "/fixtures"}>{translationsMap?.["everyMatch"]?.[language]}</a>
                </div>
                <RenderOverviewFixtures />
            </div>
            <div className='global-content-wrapper'>
                <div className='global-left-grid'>
                    <div css={tableCard}>
                        <RenderTables />
                    </div>
                </div>
            </div>
        </>
    );
}
