'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import Table from '/components/Table';
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
        background-color: var(--primary-card-bg);
    ` ;

    function findGroup(table) {
        let groupId = []
        for (let group = 0; group < table.length; group++) {
            const teamInGorup = table[group].find(t => [match.general.home.id, match.general.away.id].includes(t.teamId))
            if (teamInGorup) {
                groupId.push(group)
            }
        }
        console.log(groupId)
        return groupId
    }
    const groupId = findGroup(leagueTable.table)
    const RenderTables = groupId.map(g => {
        return (
            <Table match={match} leagueTable={leagueTable} id={g} showTitle={true} key={g}/>
        )
    })

    return (
        <div css={tableCard}>
            {RenderTables}
        </div>
    )
}