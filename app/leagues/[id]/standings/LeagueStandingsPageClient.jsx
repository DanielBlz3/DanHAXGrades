
'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { translationsMap } from '/lib/translations.js';
import '/styles/global.css';
import Table from '/components/Table';

export default function LeagueStandingsPageClient({ league }) {

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

    return (
        <div css={tableCard}>
            <RenderTables />
        </div>
    );
}
