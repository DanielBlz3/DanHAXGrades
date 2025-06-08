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
    const otherMatchesHeaderWrapper = css`
        color: var(--primary-font-color);
    text-decoration: none;

    `;
    const otherMatchesHeader = css`
    display: flex;
    flex-flow: row;
    gap: 10px;
    height: 4.5rem;
    place-items: center;
    `;

    const otherMatchesMain = css`
`;;

    const matchLink = css`
background-color: var(--card-bg-main);
color: var(--primary-font-color);
text-decoration: none;

&:hover {
    background-color: var(--card-bg-second);
  }
`;

    const matchInfo = css`
    display: flex;
    flex-flow: column;
    flex: 3;
    place-items: center;
    justify-content: center;
    gap: 12px;
        width: 100%;
             border-right: 1px solid var(--primary-divider-bg);

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

    const leagueLogo = css`
border-radius: 53%;
padding: .3rem;
border: 1px solid grey;
`

    const leagueText = css`
display: flex;
flex-flow: column;
`

    const fixturesRound = css`
color: rgb(128, 128, 128);
`


    const RenderOtherFixtures = () => {
        const otherFixturesEl = otherFixtures.map(m => {
            const matchWrapper = css`
display: flex;
flex-flow: row;
place-items: center;
height: 7rem;
margin-block: .5rem;
background-color: var(--card-bg-main);
     border-top: 1px solid var(--primary-divider-bg);

     &:hover {
    background-color: var(--card-bg-second);
    border-radius: 1rem;
  }
`;

const matchDate = 
  typeof m.status.statusShort !== "object"
    ? translationsMap?.[`${m.status.statusShort}_Short`]?.[language] || ""
    : m.status.statusShort?.date || "";
const [homeScore, awayScore] = typeof m.status.statusShort !== "object" ? [m.home.score, m.away.score] : ["", ""]
            return (
                <a css={matchLink} href={m.pageUrl} className='secondary-hover'>
                    <div css={matchWrapper}>
                        <div css={matchInfo}>
                            <div css={matchTeam}>
                                <div css={matchTeamContent}>
                                    <img src={m.home.logo} alt={m.home.teamName} height={20} width={20} />
                                    <span>{m.home.teamNameShort}</span>
                                </div>
                                <div css={matchTeamScore}>
                                    <span>{homeScore}</span>
                                </div>
                            </div>
                            <div css={matchTeam}>
                                <div css={matchTeamContent}>
                                    <img src={m.away.logo} alt={m.away.teamName} height={20} width={20} />
                                    <span>{m.away.teamNameShort}</span>
                                </div>
                                <div css={matchTeamScore}>
                                    <span>{awayScore}</span>
                                </div>
                            </div>
                        </div>
                        <div css={matchStatus}>
                            <span>{matchDate}</span>
                        </div>
                    </div>
                </a>
            )
        })
        return (
            <div css={otherMatches}>
                <a css={otherMatchesHeaderWrapper} className="primary-hover" href={"/leagues/" + match.general.leagueId + "/overview"}>
                    <header css={otherMatchesHeader}>
                        <img css={leagueLogo} src={match.general.leagueLogo} width={50} height={50} />
                        <div css={leagueText}>
                            <h3>{match.general.leagueName}</h3>
                            <span css={fixturesRound}>{`${translationsMap?.["round"]?.[language]} ${match.general.roundName}`}</span>
                        </div>
                    </header>
                </a>
                <div css={otherMatchesMain}>
                    {otherFixturesEl}
                </div>
            </div>
        )
    }

    return (
        <div match-right-grid>
            {RenderOtherFixtures()}
        </div>
    )
}