'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations';
import formatMatchTimestamp from '/lib/timeFormatter';

export default function Fixtures({ fixtures, hasResults, nameType}) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [fixtures]);

    const fixturesItem = css`
    display: flex;
    flex-flow: column;
    justify-content: center;
    border-top: solid 1px var(--primary-divider-bg);
    min-height: 4rem;
    text-decoration: none;
    color: var(--primary-font-color);
   `;

    const fixturesItemHeader = css`
       display: flex;
    flex-flow: row;
    width: 100%;
            @media (max-width: 800px) {
            display: none;
}
   `;

    const fixturesItemContent = css`
    align-self: center;
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
    width: 100%;
    justify-items: center;
    align-items: center;
    @media (max-width: 800px) {
    grid-template-columns: 3fr 1fr 3fr;
}
   `

    const dateCSS = css`
    display: flex;
    flex: 1;
    padding-left: 1rem;}
   `;

   const timeCSS = css`
    color: var(--GLOBAL-FONT-COLOR-GREY);
   `

    const fixturesTeam = css`
       display: flex;
    gap: 6px;

        @media (max-width: 800px) {
        flex-flow: column;
        justify-self: center;
    align-items: center;
        }
   `;

    const homeCSS = css`
       flex-flow: row-reverse;
    justify-self: end;
   `;

    const awayCSS = css`
       flex-flow: row;
    justify-self: start;
   `;

    const scoreline = css`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .75rem;
    padding: 0.020rem 0.25rem 0.020rem 0.25rem;
   `;

    const fixturesContent = fixtures.map(m => {
        const { date, time } = formatMatchTimestamp(m.timestamp);
                console.log(formatMatchTimestamp(m.timestamp))

        let fixturesDetails
        if (m.status.started) {
            fixturesDetails = (<div css={scoreline}>{m.status.scoreStr}</div>)
        } else {
            fixturesDetails = (<div css={timeCSS}>{time}</div>)
        }

        return (
            <a
                key={m.id}
                css={fixturesItem}
                href={m.pageUrl}
                className="secondary-hover"
            >
                <div css={fixturesItemHeader}>
                    <span css={dateCSS}>{date}</span>
                </div>
                <div css={fixturesItemContent}>
                    <div css={[fixturesTeam, homeCSS]}>
                        <img src={m.home.logo} alt={m.home[nameType]} width="25" height="25"/>
                        <span>{m.home[nameType]}</span>
                    </div>
                    {fixturesDetails}
                    <div css={[fixturesTeam, awayCSS]}>
                        <img src={m.away.logo} alt={m.away[nameType]} width="25" height="25"/>
                        <span>{m.away[nameType]}</span>
                    </div>
                </div>
            </a>
        )
    })

    return (
        <>
            {fixturesContent}
        </>
    )
}