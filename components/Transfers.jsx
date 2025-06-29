'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations';
import DefaultArrow from '/components/DefaultArrow';

export default function Transfers({ data }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, [data]);

    const transfersCard = css`
    display: flex;
    flex-flow: column;
    border-radius: 1.25rem;
    background-color: var(--primary-card-bg);
    `;

    const transfersLegend = css`
        display: grid;
    grid-template-columns: 3.5fr 2fr 1fr 1fr 1fr;
    padding: 1rem 2rem;
    color: grey;
    justify-items: start;
@media (max-width: 900px) {
        display: none;
}
   `;

   const transfersContent = css`
   @media (max-width: 900px) {
    > :first-child {
        border: none;
    }

   `

    const transfersItem = css`
    display: grid;
    grid-template-columns: 3.5fr 2fr 1fr 1fr 1fr;
    border-top: solid 1px var(--primary-divider-bg);
    padding: 1rem 2rem;
    justify-items: start;
    align-items: center;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
        justify-items: center;
        gap: 10px;
    }
   `;

    const transfersItemDetails = css`
       display: flex;
    flex-flow: column;
    gap: 3px;
    place-items: start;

        @media (max-width: 900px) {
        flex-flow: row;
        place-items: center;
        gap: 10px;
        }
   `;

    const playername = css`
       color: var(--primary-font-color);
        font-weight: bold;
                   text-decoration: none;
   `;

    const signingTeam = css`
       display: flex;
    flex-flow: row;
    gap: 10px;
    align-items: center;
           color: var(--primary-font-color);
           text-decoration: none;
   `

    const oldTeam = css`
   @media (max-width: 900px) {
        display: none;
}
   `;
   const position = css`
       background-color: var(--secondary-card-bg);
    padding: .3em .5rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: grey;

   `

    const RenderTransfersItems = () => {
        const items = data.map(t => {
            return (
                <div css={transfersItem} className="fourth-hover">
                    <div css={transfersItemDetails}>
                        <a href={t.pageUrl} css={playername} className="third-hover" >{t.playerName}</a>
                        <a href={t.currentTeamUrl} css={signingTeam} className="third-hover">
                            <DefaultArrow direction="right" bgColor={"var(--GLOBAL-DANHAXGRADES-SCHEME)"} strokeBgColor={"#fff"} strokeWidth={"2.5"} />
                            <img src={t.currentTeamLogo} alt={t.currentTeamName} width={20} height={20} />
                            <span>{t.currentTeamName}</span>
                        </a>
                    </div>
                    <a href={t.formerTeamUrl} css={[signingTeam, oldTeam]} className="third-hover">
                        <img src={t.formerTeamLogo} alt={t.formerTeamLogo} width={20} height={20} />
                        <span>{t.formerTeamName}</span>
                    </a>
                    <span css={position}>{t.position}</span>
                    <img src={t.nationLogo} width={20} height={20} />
                    <span>{t.date}</span>
                </div>
            )
        })
        return (
            <>
                {items}
            </>
        )
    }

    return (
        <div css={transfersCard}>
            <div css={transfersLegend}>
                <span>{translationsMap?.["player_UCase"]?.[language]}</span>
                <span>{translationsMap?.["from_UCase"]?.[language]}</span>
                <span>{translationsMap?.["position"]?.[language]}</span>
                <span>{translationsMap?.["country"]?.[language]}</span>
                <span>{translationsMap?.["date_UCase"]?.[language]}</span>
            </div>
            <div css={transfersContent}>
                <RenderTransfersItems />
            </div>
        </div>
    )
}