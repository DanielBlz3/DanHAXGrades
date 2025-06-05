'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations';
import '/styles/global.css';

const RenderTeamWeaknesses = ({ team, teamStats }) => {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [team]);

    const weaknessesContainer = css`
    display: flex;
    flex-flow: column;
    justify-content: start;
    align-items: center;
`;

    const weaknessesHeader = css`
display: flex;
height: 2rem;
align-items: center;
justify-content: center;
`

    const weaknessesItem = css`
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

    const strenghtsTitle = css`
    flex: 1;
    color: var(--GLOBAL-FONT-COLOR-GREY);
    font-weight: bold;
`;

    const focusedTeamStats = teamStats[String(team.id)]
    const weaknesses = Object.entries(focusedTeamStats.strengths)
        .filter(s => ["weak", "veryWeak"].includes(s[1]))
        .sort((a, b) => {
            const order = { weak: 0, veryWeak: 1 };
            return order[a[1]] - order[b[1]];
        });

    const weaknessesItemsEl = weaknesses.map(s => {
        const weaknessesBackground = s[1] === "veryWeak" ? 'var(--RATING-RED)' : "var(--RATING-ORANGE)"
        const weaknessesValue = css`
    justify-self: flex-end;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    height: 1.5rem;
    padding-inline: .2rem;
    background-color: ${weaknessesBackground};
`
        return (

            <div
                key={s[0]}
                css={weaknessesItem}
                                    className="secondary-hover"
            >
                <span css={strenghtsTitle}>
                    {translationsMap?.[s[0]]?.[language]}
                </span>
                <span css={weaknessesValue}>
                    {translationsMap?.[s[1]]?.[language]}
                </span>
            </div>
        )
    })
    return (
        <div css={weaknessesContainer}>
            <h3 css={weaknessesHeader}>{`${team.name} ${translationsMap?.["weaknesses"]?.[language]}`}</h3>
            {weaknessesItemsEl}
        </div>
    )
}


export default RenderTeamWeaknesses