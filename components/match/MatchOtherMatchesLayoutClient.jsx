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

export default function Layout({ otherFixtures, match, children }) {

    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
    })


    const otherMatches = css`
    text-decoration: none;
      background-color: var(--card-bg-main);
      width: 20rem;
      border-radius: 1.25rem;
      padding: 1rem;
    `;
    const otherMatchesHeader = css`
    display: flex;
    flex-flow: row;
    gap: 10px;
    height: 4rem;
    place-items: center
    `;

    const otherMatchesMain = css`
`;;

    const matchLink = css`
color: var(--primary-font-color);
text-decoration: none;
`;

    const matchWrapper = css`
display: flex;
flex-flow: row;
place-items: center;
height: 8rem;
     border-top: 1px solid var(--divider-bg-primary);
`;

    const matchInfo = css`
    display: flex;
    flex-flow: column;
    flex: 3;
    place-items: center;
    justify-content: center;
    gap: 12px;
        width: 100%;
             border-right: 1px solid var(--divider-bg-primary);

`;

    const matchStatus = css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`

    const matchTeam = css`
    display: flex;
    flex-flow: row;
    align-items: center;
    width: 100%;
`;

    const matchTeamContent = css`
        display: flex;
    flex-flow: row;
    gap: 10px;
    justify-self: start;
    flex: 4;
`

    const matchTeamScore = css`
    display: flex;
    justify-content: center;
    flex: 2;
`;

    const leagueText = css`
display: flex;
flex-flow: column;
`

const fixturesRound = css`
color: rgb(128, 128, 128);
`

    const RenderOtherFixtures = () => {
        const otherFixturesEl = otherFixtures.map(m => {
            return (
                <a css={matchLink} href={m.pageUrl}>
                    <div css={matchWrapper}>
                        <div css={matchInfo}>
                            <div css={matchTeam}>
                                <div css={matchTeamContent}>
                                    <img src={m.home.logo} alt={m.home.teamName} height={20} width={20} />
                                    <span>{m.home.teamNameShort}</span>
                                </div>
                                <div css={matchTeamScore}>
                                    <span>{m.home.score}</span>
                                </div>
                            </div>
                            <div css={matchTeam}>
                                <div css={matchTeamContent}>
                                    <img src={m.away.logo} alt={m.away.teamName} height={20} width={20} />
                                    <span>{m.away.teamNameShort}</span>
                                </div>
                                <div css={matchTeamScore}>
                                    <span>{m.away.score}</span>
                                </div>
                            </div>
                        </div>
                        <div css={matchStatus}>
                            <span>FT</span>
                        </div>
                    </div>
                </a>
            )
        })
        console.log(match.general.leagueLogo)
        return (
            <div css={otherMatches}>
                <header css={otherMatchesHeader}>
                    <img src={match.general.leagueLogo} width={25} height={25} />
                    <div css={leagueText}>
                        <h3>{match.general.leagueName}</h3>
                        <span css={fixturesRound}>{`${translationsMap?.["round"]?.[language]} ${match.general.roundName}`}</span>
                    </div>
                </header>
                <div css={otherMatchesMain}>
                    {otherFixturesEl}
                </div>
            </div>
        )
    }

    console.log(otherFixtures)
    return (
        <div>
            {RenderOtherFixtures()}
        </div>
    )
}