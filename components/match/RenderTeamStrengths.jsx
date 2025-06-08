'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations';
import '/styles/global.css';

const RenderTeamStrengths = ({ team, teamStats }) => {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [team]);

    const strengthsContainer = css`
    display: flex;
    flex-flow: column;
    justify-content: start;
    align-items: center;
`;

    const strengthsHeader = css`
display: flex;
height: 2rem;
align-items: center;
justify-content: center;
`

    const strengthsItem = css`
    display: flex;
    flex-flow: row;
    height: 2.5rem;
    border-top: 1px solid var(--primary-divider-bg);
    width: 100%;
    align-items: center;
        justify-content: flex-end;
                padding: .5rem;
        border-radius: .5rem;


`

    const strengthsTitle = css`
    flex: 1;
    color: var(--GLOBAL-FONT-COLOR-GREY);
    font-weight: bold;
`;

    const focusedTeamStats = teamStats.teamStats[String(team.id)]
    if (focusedTeamStats?.strengths) {
        const strengths = Object.entries(focusedTeamStats.strengths).filter(s => ["veryStrong", "strong"].includes(s[1])).sort((a, b) => {
            const priority = { veryStrong: 0, strong: 1 };
            return priority[a[1]] - priority[b[1]];
        });

        const strengthsItemsEl = strengths.map(s => {
            const strengthsBackground = s[1] === "veryStrong" ? 'var(--RATING-BLUE)' : "var(--RATING-GREEN)"
            const strengthsValue = css`
    justify-self: flex-end;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    height: 1.5rem;
    padding-inline: .2rem;
    background-color: ${strengthsBackground};
`
            return (

                <div
                    key={s[0]}
                    css={strengthsItem}
                    className="secondary-hover"
                >
                    <span css={strengthsTitle}>
                        {translationsMap?.[s[0]]?.[language]}
                    </span>
                    <span css={strengthsValue}>
                        {translationsMap?.[s[1]]?.[language]}
                    </span>
                </div>
            )
        })
        return (
            <div css={strengthsContainer}>
                <h3 css={strengthsHeader}>{`${team.name} ${translationsMap?.["strengths"]?.[language]}`}</h3>
                {strengthsItemsEl}
            </div>
        )
    }
}


export default RenderTeamStrengths