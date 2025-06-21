'use client';
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from '@emotion/react';
import { translationsMap } from '/lib/translations.js';
import '/styles/global.css';
import Table from '/components/Table.jsx';
import TopStats from '/components/TopStats';
import PenaltyBox from '/components/PenaltyBox';
import PlayerTotw from '/components/PlayerTotw';
import DefaultArrow from '/components/DefaultArrow';

export default function LeagueOverviewPageClient({ league }) {
  const [theme, setTheme] = useState('theme-light');
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'es';
    setLanguage(storedLanguage);
    const storedTheme = localStorage.getItem('theme') || 'theme-light';
    setTheme(storedTheme);
  }, [league]);

  const tableCard = css`
    border-radius: 1.5rem;
    justify-self: center;
    background-color: var(--card-bg-main);
  `;

  const fixturesCard = css`
    display: flex;
    flex-flow: column;
    border-radius: 1.25rem;
    background-color: var(--card-bg-main);
  `;

  const fixturesContent = css`
    display: flex;
    flex-flow: row;
    justify-content: center;
    gap: 25px;
    padding: 1rem;

    @media (max-width: 800px) {
      flex-flow: column;
    }
  `;

  const fixturesHeader = css`
    display: flex;
    flex-flow: row;
    width: 100%;
    padding: 1rem;
  `;

  const fixturesTitle = css`
    flex: 1;
  `;

  const fixturesHeaderLink = css`
    color: var(--GLOBAL-DANHAXGRADES-SCHEME);
    text-decoration: none;
    justify-self: end;
    align-content: center;
    padding-right: 1rem;
    font-weight: 600;
  `;

  const fixturesOverviewItem = css`
    flex: 1;
    display: flex;
    flex-flow: row;
    border: solid 1px var(--third-divider-bg);
    border-radius: 1rem;
    min-height: 20px;
    align-items: center;
    padding-block: 1rem;
    text-decoration: none;
    color: var(--font-default-color);
  `;

  const fixturesOverviewTeam = css`
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
  `;

  const statsCard = css`
    background-color: var(--card-bg-main);
    border-radius: 1.25rem;
    padding: 1rem;
  `;

  const statsWrapper = css`
    display: flex;
    flex-flow: row;
      > * {
    border-right: 1px solid var(--primary-divider-bg);
    border-radius: 0;

        @media (max-width: 800px) {
            flex-flow: column;
}
    }
    
    @media (max-width: 800px) {
      flex-flow: column;
      > * {
        border: none;
      }
    }

    > :last-child {
      border: none;
    }
  `;

  const totwHeader = css`
   display: flex;
   flex-flow: column;
    height: 5rem;
    background-color: var(--card-bg-main);
    border-radius: 1.25rem 1.25rem 0 0;
    justify-content: center;
    align-items: center;
    width: 100%
  `;

  const totwBar = css`
   display: grid;
   grid-template-columns: 1fr 3fr 1fr;
    place-items: center;
    width: 100%;
  `;

  const bigBox = css`
    position: absolute;
  bottom: -2%;
  left: 50%;
  transform: translate(-50%, 0%)
  `;

  const totwField = css`
      border-radius: 0 0 1.25rem 1.25rem;
      background-color: var(--primary-soccer-field-bg);
      min-width: 400px;
      height: 500px;
      position: relative;
  `

  const totwButton = css`
      background-color: rgb(0, 0, 0, 0);
      border: none;
      cursor: pointer;
      `;

  const RenderTables = () => {
    return (
      <>
        {league.table.table.map((item, index) => (
          <Table
            key={index}
            match={null}
            leagueTable={league.table}
            id={index}
            showTitle={index === 0}
          />
        ))}
      </>
    );
  };

  const RenderOverviewFixtures = () => {
    return (
      <div css={fixturesContent}>
        {league.fixtures
          .filter((m) => !m.status.started)
          .slice(0, 3)
          .map((m) => (
            <a
              key={m.id}
              href={m.pageUrl}
              css={fixturesOverviewItem}
              className="secondary-hover"
            >
              <div css={fixturesOverviewTeam}>
                <img src={m.home.logo} alt={m.home.teamNameShort} width={25} height={25} />
                <span>{m.home.teamNameShort}</span>
              </div>
              <span>{m.matchDate}</span>
              <div css={fixturesOverviewTeam}>
                <img src={m.away.logo} alt={m.away.teamNameShort} width={25} height={25} />
                <span>{m.away.teamNameShort}</span>
              </div>
            </a>
          ))}
      </div>
    );
  };

  const [matchday, setTotwMatchday] = useState(league.topPlayerStats.totw.length);
  const towPlayers = league.topPlayerStats.totw[matchday - 1]
  var backwardMatchday = matchday > 1 ? matchday - 1 : 1
  var forwardMatchday = matchday < league.topPlayerStats.totw.length ? matchday + 1 : league.topPlayerStats.totw.length

  const RenderTOTW = ({ players }) => {
    const content = players?.map(p => {
      if (p !== null) {
        return (
          <PlayerTotw key={p?.playerId} player={p} />
        )
      } else {
        console.error('PLAYER NOT FOUND IN TOTW')
      }
    })

    return (
      content
    )
  }

  const RenderTOTWCard = () => {
    return (
      <div>
        <div css={totwHeader}>
          <h2>{translationsMap?.["teamOfTheWeek"]?.[language]}</h2>
          <div css={totwBar}>
            <button css={totwButton} onClick={() => setTotwMatchday(backwardMatchday)}>
              <DefaultArrow direction="left" bgColor={"var(--primary-arrow-bg)"} strokeBgColor={"var(--primary-arrow-stroke)"} strokeWidth={"2.5"} />
            </button>
            <h4>{`${translationsMap?.["round"]?.[language]} ${matchday}`}</h4>
            <button css={totwButton} onClick={() => setTotwMatchday(forwardMatchday)}>
              <DefaultArrow direction="right" bgColor={"var(--primary-arrow-bg)"} strokeBgColor={"var(--primary-arrow-stroke)"} strokeWidth={"2.5"} />
            </button>
          </div>
        </div>
        <div css={totwField}>
          <div css={bigBox}>
            <PenaltyBox width={267} height={133} strokeColor={'var(--primary-soccer-field-stroke)'} lineWidth={4} />
          </div>
          <RenderTOTW players={towPlayers} />
        </div>
      </div>
    )
  }

  return (
    <>
      <div css={fixturesCard}>
        <div css={fixturesHeader}>
          <h2 css={fixturesTitle}>{translationsMap?.["fixtures"]?.[language]}</h2>
          <a
            css={fixturesHeaderLink}
            className="third-hover"
            href={`/leagues/${league.leagueDetails.id}/fixtures`}
          >
            {translationsMap?.["everyMatch"]?.[language]}
          </a>
        </div>
        <RenderOverviewFixtures />
      </div>

      <div className="global-content-wrapper">
        <div className="global-left-grid">
          <div css={tableCard}>
            <RenderTables />
          </div>

          <div css={statsCard}>
            <div css={statsWrapper}>
              <TopStats metric="topGoals" data={league.topPlayerStats.topGoals} />
              <TopStats metric="topAssists" data={league.topPlayerStats.topAssists} />
              <TopStats metric="topMatchRatings" data={league.topPlayerStats.topMatchRatings} />
            </div>
          </div>
        </div>
        <div className="global-right-grid">
          <RenderTOTWCard />
        </div>
      </div>
    </>
  );
}
