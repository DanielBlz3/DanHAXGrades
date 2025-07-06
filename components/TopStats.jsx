'use client';
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from '@emotion/react';
import { translationsMap } from '/lib/translations';

export default function TopStats({ metric, data }) {
  const [theme, setTheme] = useState('theme-light');
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'es';
    setLanguage(storedLanguage);
    const storedTheme = localStorage.getItem('theme') || 'theme-light';
    setTheme(storedTheme);
  }, [data]);

  const section = css`
    display: flex;
    flex-flow: column;
    padding: 1rem 1.5rem;
    background-color: var(--primary-card-bg);
    align-items: start;
    justify-content: start;
    flex: 1;
  `;

  const sectionHeader = css`
    height: 2rem;
  `;

  const sectionContent = css`
    width: 100%;
  `;

  const playerDetails = css`
    @media (max-width: 800px) {
      display: flex;
      flex-flow: row;
      gap: 10px;
    }
  `;

  const player = css`
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    align-items: center;
    text-decoration: none;
    color: var(--primary-font-color);
    min-height: 4rem;
    border-top: solid 1px var(--primary-divider-bg);
    > :first-child {
    border: none;
    } 
  `;

  const team = css`
    display: flex;
    flex-flow: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
    justify-self: start;
  `;

  const teamName = css`
    color: var(--GLOBAL-FONT-COLOR-GREY);
  `;

  const avatar = css`
  border-radius: 50%;
  `;

  const RenderPlayers = () => {
    return (
      <>
        {data.map((p, idx) => {
          const statValue = css`
            display: flex;
            border-radius: 1rem;
            min-width: 25px;
            padding-inline: 0.3rem;
            min-height: 25px;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            background-color: ${p.teamColor};
            color: white;
          `;

          return (
            <a key={idx} href={p.pageUrl} css={player} className="primary-hover">
              <img css={avatar} src={p.avatar} width={30} height={30} />
              <div css={playerDetails}>
                <span>{p.playerName}</span>
                <div css={team}>
                  <img src={p.teamLogo} alt={p.teamName} width={15} height={15} />
                  <span css={teamName}>{p.teamName}</span>
                </div>
              </div>
              <span css={statValue}>{p.value}</span>
            </a>
          );
        })}
      </>
    );
  };

  return (
    <div css={section}>
      <h3 css={sectionHeader}>
        {translationsMap?.[metric]?.[language]}
      </h3>
      <div css={sectionContent}>
        <RenderPlayers />
      </div>
    </div>
  );
}