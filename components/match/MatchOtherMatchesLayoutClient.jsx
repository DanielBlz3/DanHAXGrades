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

export default function Layout({ otherFixtures, children }) {

    const matchContainer = css`
height: 3rem;
width: 100%;
`;

    const matchWrapper = css`
display: flex;
flex-flow: row;
place-items: center;
`;

    const matchInfo = css`
    display: flex;
    flex-flow: column;
    flex: 2;
    place-items: center;
    justify-content: center;
`;

    const matchStatus = css`
    display: flex;
    justify-content: center;
    align-items: center;
`

    const matchTeam = css`
    display: flex;
    flex-flow: row;
    align-items: center;
`;

    const matchTeamContent = css`
        display: flex;
    flex-flow: row;
    gap: 10px;
    justify-self: start;
    flex: 4;
`

    const matchTeamScore = css`
    justify-self: end;
        flex: 1;
`


    const [language, setLanguage] = useState('es');

    const RenderOtherFixtures = () => {
        const otherFixturesEl = otherFixtures.map(m => {
            return (
                <div css={matchContainer}>
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
                </div>
            )
        })
        return (
            otherFixturesEl
        )
    }

    console.log(otherFixtures)
    return (
        <div>
            {RenderOtherFixtures()}
        </div>
    )
}