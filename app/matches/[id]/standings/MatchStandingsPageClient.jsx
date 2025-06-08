'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations';
import Table from '/components/table';
import '/styles/global.css';

export default function MatchStandingsPageClient({ match, leagueTable }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [match]);

    const tableCard = css`
        border-radius: 1.5rem;
    justify-self: center;
        background-color: var(--card-bg-main);
    ` 
    return (
        <div css={tableCard}>
            <Table match={match} leagueTable={leagueTable} id={0} />
        </div>
    )
}