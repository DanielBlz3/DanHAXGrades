'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations';

export default function Table({ match, leagueTable, id, showTitle }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [match]);

    const standings = leagueTable.table[id]
    const tableDetails = leagueTable.data

    const tableWrapper = css`
        margin-bottom: 1rem;
    `
    const tableHeader = css`
        display: grid;
    grid-template-rows: subgrid;
    grid-template-columns: 1fr 5fr repeat(7, 1fr);
    text-align: center;
    font-weight: 700;
    margin-bottom: .75rem;

    @media (max-width: 800px) {
        grid-template-columns: 1fr 5fr repeat(3, 1fr);
            > :nth-child(4) {
            display: none;
  }
            > :nth-child(5) {
            display: none;
  }
            > :nth-child(6) {
            display: none;
  }
            > :nth-child(7) {
            display: none;
  }
    `;

    const tableTeam = css`
        display: flex;
    flex-flow: row;
    gap: 2vw

    `
    const leagueTableHeader = css`
    display: flex;
    font-size: 1.25rem;
    font-weight: bold;
    height: 4.5rem;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: var(--primary-font-color);
    border-bottom: 1px solid var(--primary-divider-bg);
    margin-bottom: 1rem;
    `

    const RenderTableHeader = () => {
        return (
            <div css={tableHeader}>
                <span>#</span>
                <span></span>
                <span>{translationsMap?.["matches_Short"]?.[language]}</span>
                <span>{translationsMap?.["wins_Short"]?.[language]}</span>
                <span>{translationsMap?.["draws_Short"]?.[language]}</span>
                <span>{translationsMap?.["losses_Short"]?.[language]}</span>
                <span>+|-</span>
                <span>{translationsMap?.["goalDifference_Short"]?.[language]}</span>
                <span>PTS</span>
            </div>
        )
    }

    const RenderTableItems = () => {
        const tableItems = standings.map(t => {
            const teamsArr = match ? [match.general.home.id, match.general.away.id] : []
            const leagueItemBgColor = teamsArr.includes(t.teamId) ? '--card-bg-third' : '--card-bg-main'

            const qualifier = css`
      &::before {
    content: "";
    position: absolute;
    background-color: ${t.color};
    height: 80%;
    top: 2px;
    width: 2px;
    border-radius: 1rem
}`

            const leagueTableItem = css`
        position: relative;
    display: grid;
    grid-template-rows: subgrid;
    grid-template-columns: 1fr 5fr repeat(7, 1fr);
    text-align: center;
    padding-block: .4rem;
    text-decoration: none;
    background-color: var(${leagueItemBgColor});
    color: var(--primary-font-color);
            @media (max-width: 800px) {
                    grid-template-columns: 1fr 5fr repeat(3, 1fr);
            > :nth-child(4) {
            display: none;
  }
            > :nth-child(5) {
            display: none;
  }
            > :nth-child(6) {
            display: none;
  }
            > :nth-child(7) {
            display: none;
  }
        }
    `;

            return (
                <a css={[leagueTableItem, qualifier]} className="secondary-hover" href={"/teams/" + t.teamId + "/overview"}>
                    <span>{t.idx}</span>
                    <div css={tableTeam}>
                        <img src={t.teamLogo} width={20} height={20} />
                        <span>{t.teamName}</span>
                    </div>
                    <span>{t.matchesPlayed}</span>
                    <span>{t.wins}</span>
                    <span>{t.draws}</span>
                    <span>{t.losses}</span>
                    <span>{t.gdStr}</span>
                    <span>{t.gd}</span>
                    <span>{t.pts}</span>
                </a>
            )
        })
        return (
            <>
                {tableItems}
            </>
        )
    }
    /* let tableLegend = document.createElement("div"); tableLegend.className = "table-legend"
    tableContainer.appendChild(tableLegend)
    for (let i = 0; i < tableDetails.tableLegend.length; i++) {
        const legendInfo = tableDetails.tableLegend[i]
        let legendItem = document.createElement("div"); legendItem.className = "table-legend-item"
        qualText = document.createElement("span"); qualText.textContent = qualTranslationsMap[legendInfo.key][savedLang]
        qualColor = document.createElement("span"); qualColor.className = "qual-color"
        qualColor.style.backgroundColor = legendInfo.color

        legendItem.appendChild(qualText)
        legendItem.appendChild(qualColor)
        tableLegend.appendChild(legendItem)
    } */
    return (
        <div css={tableWrapper}>
            {showTitle ? <a css={leagueTableHeader} href={"/leagues/" + tableDetails.leagueId + "/overview"} className="primary-hover">{tableDetails.leagueName}</a> : null}
            <RenderTableHeader />
            <RenderTableItems />
        </div>
    )
}