'use client';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from "react";
import React from "react";
import '/styles/global.css';
import positionCoords from '/lib/posCoordsPlayerPosMap.json';
function isDark(rgbString) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = rgb;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness < 50;
}
function isLight(rgbString) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = rgb;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness >= 200;
}
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'theme-light' : 'theme-light'

export default function PlayerPageClient({ player }) {

    const playerContent = css`
    display: grid;
    grid-template-columns: minmax(853px, 2fr) minmax(327px, 1fr);
    grid-gap: 1rem;
    max-width: 1280px;
    width: 100%;
    overflow-x: hidden;
  `;

    const teamColor = storedTheme === "theme-light" ? player?.teamColors?.teamColorMain : player?.teamColors?.teamColorAlternate
    const teamFontColor = isLight(teamColor) === true ? "black" : "white"
    const playerHeader = css`
    display: flex;
    flex-flow: column;
    width: 100%;
  `;

    const playerContentItem = css`
display: flex;
flex-flow: column;
gap: 1rem;
`;

    const playerCard = css`
    background-color: ${teamColor};
    color: ${teamFontColor};
    border-radius: 1em 1em 0 0;
    padding: 1rem;
    max-width: 100%;
    margin: 0;
  `;

    const cardWrapper = css`
    display: flex;
    flex-flow: row nowrap;
    gap: 10px;
    align-items: flex-end;
  `;

    const cardContent = css`
    display: flex;
    flex-direction: column;
  `;

    const cardName = css`
    align-content: center;
  `;

    const cardTeam = css`
    display: flex;
    flex-direction: row;
    justify-content: left;
    gap: 8px;
    color: ${teamFontColor};
  `;

    const teamLinkHeader = css`
    color: ${teamFontColor};
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
  `;

    const cardLogo = css`
    display: inline;
  `;

    const playerInfo = css`
    display: flex;
            flexFlow: row;
            width: 100%;
        background-color: var(--card-bg-main);
    `;

    const toolTipWrapper = css`
  position: relative;
  display: inline-block;
`;

    const toolTip = css`
  visibility: hidden;
  opacity: 0;
  width: max-content;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 6px 10px;
  border-radius: 4px;
  position: absolute;
  z-index: 10;
  bottom: 125%; /* Position above the element */
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.2s ease;
  pointer-events: none;
`;


    //===============================|  BIO  | ===============================
    //
    //
    const bio = css`
    display: grid;
            height: 250px;
            max-height: 300px;
            grid-template-columns: 1fr 1fr;
            border-right: 1px solid var(--divide-bg-primary);
            border-radius: 0 0 0 1rem;
            padding-left: 1rem;
            flex: 1;
    `;

    const bioValue = css`
    display: flex;
                flex-flow: column;
                width: 150px;
                height: 75px;
                flex-direction: column;
                justify-content: center;
                border-bottom: 1px solid var(--divide-bg-primary);
    `;

    const bioMetric = css`
    font-size: 0.8rem;
                color: var(--GLOBAL-FONT-COLOR-GREY);
                padding-top: 0.3rem;
    `;


    //===============================|  POSITIONS  | ===============================
    //
    //
    const positionSection = css`
     display: flex;
    flex: 1;
            height: 250px;
            max-height: 300px;
            flex-flow: column wrap;
            padding: 1rem;
            border-radius: 0 0 1em 0;
            justify-content: center;
            gap: 10px;
    `;

    const positionMapImgWrapper = css`
    position: relative;
            width: 169px;
            height: 218px;
    `;

    const positionMapImg = css`
    border-radius: 0.5rem;
    user-select: none;
    ::-webkit-user-drag: none;
    filter: var(--position-pitch-brightness);
    `;

    const positionWrapper = css``;
    const primaryPositionEl = css``;
    const otherPositionEl = css``;

    const mainPosition = player?.playerPositions?.positions.find(p => p.isMainPos === true) || null
    const mainPositionCoords = positionCoords?.[mainPosition?.id]
    const mainPosOnPosMap = mainPosition ? <div css=
        {
            css`
    position: absolute;
    left: ${mainPositionCoords.x - 10}%;
    top: ${mainPositionCoords.y}%;
    color: ${teamFontColor};
    background-color: ${teamColor};
    font-size: .8rem;
    font-weight: 600;
    padding: 4px 6.25px;
    border-radius: 1rem;
    min-width: 37.5px;
    display: flex;
    text-align: center;
    justify-content: center;
    object-fit: cover;
    `
        }
    >{mainPosition?.id}</div> : <div></div>

    const otherPositions = player?.playerPositions?.positions.filter(p => p.isMainPos === false) || []
    const otherPosOnPosMap = otherPositions
        .filter(pos => !pos.isMainPos && pos.ratio > 0.166)
        .map((pos, index, arr) => {
            const posCoords = { x: positionCoords?.[pos.id]?.x - 10, y: positionCoords?.[pos.id]?.y } || { x: 0, y: 0 };
            console.log(posCoords)
            const isLightTheme = storedTheme === "theme-light";
            return (
                <div
                    key={pos.id}
                    css={css`
        display: flex;
          align-items: center;
          justify-content: center;
        min-width: 37.5px;
          position: absolute;
          left: ${posCoords.x}%;
        top: ${posCoords.y}%;
          background-color: grey;
          opacity: ${(pos.ratio * 100 + 25) / 100};
          color: ${isLightTheme ? "white" : "black"};
          z-index: 8;
          padding: 4px 6.25px;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 0.8rem;
          text-align: center;
         `}
                >
                    {pos.id}
                </div>
            );
        });


    //===============================|  COMPEITION STATS  | ===============================
    //
    //
    const competitionStatsCard = css`
            background-color: var(--card-bg-main);
            border-radius: 1.25rem;
    `

    const competitionStatsTitleWrapper = css`
    flex-flow: row wrap;
    max-width: 100%;
    border-radius: 1em 1em 0 0;
    border-right: none;
    border-bottom: 1px solid var(--divide-bg-primary);
    color: var(--primary-font-color);
    `;

    const competitionStatsLink = css`
    display: flex;
    text-decoration: none;
    width: 100%;
    height: 100%;
    color: var(--primary-font-color);
    `;

    const competitionStatsTitle = css`
    padding: 1rem;
    align-self: center;
    `;

    const competitionStatsContent = css`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    height: 200px;
    max-width: 100%;
    padding: 1rem;
    border-radius: 0 0 1em 1em;
    border-right: none;
    `;

    const matchItem = css`
    display: grid;
    grid-template-columns: 4fr 7fr 4fr repeat(5, 1fr) 2fr;
    justify-items: center;
    align-items: center;
    padding-block: .8rem;
    border-radius: .5rem;
    font-weight: bold;
    text-decoration: none;
    color: var(--primary-font-color);
    `;

    const matchItemTeam = css`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    align-self: start;
    justify-self: start;
    `

    const competitionItems = player.competitionStats.map((i, index) => {
        return (
            <div key={index} css={css`
        min-width: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
        color: var(--primary-font-color);
        `}>
                <span css={css`
                        font-size: 1.05rem;
                    `}>{i.value}</span>
                <span css={css`
                    color: var(--GLOBAL-FONT-COLOR-GREY);
    font-weight: bold;
                    `}>{i.id}</span>
            </div>
        )
    })


    //===============================|  PLAYER MATCHES  | ===============================
    //
    //
    const playerRecentMatches = player.recentGames.map((match, index) => (
        <a key={index} href={match.pageUrl} className="secondary-hover" css={matchItem}>
            <div>{match.leagueNameShort}</div>

            <div css={matchItemTeam}>
                <img src={match.opponentsLogo} height={20} width={20} alt={match.opponentTeamName} title={match.opponentTeamName} />
                <span>{match.opponentTeamName}</span>
            </div>

            <div style={{ display: "flex", flexFlow: "row", justifySelf: "start", gap: "3px" }}>
                {match.scoreline.split("").map((char, charIndex) => {
                    const isBold =
                        (match.isHome === true && charIndex === 0) ||
                        (match.isHome === false && charIndex === 2);
                    return (
                        <span
                            key={charIndex}
                            style={{
                                fontWeight: isBold ? "bolder" : "bold",
                                color: isBold ? "inherit" : "grey",
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>

            <div>{match.minutes || "N/A"}</div>

            {["goals", "assists", "touches", "passesC"].map((metric) => (
                <div key={metric}>{Math.round(match[metric])}</div>
            ))}

            <div
                className="secondary-rating"
                style={{ backgroundColor: match.matchRating.backgroundColor }}
            >
                {match.matchRating.value}
            </div>
        </a>
    ));

    const playerMatchesCard = css`
    padding-top: 1rem;
    border-radius: 1.25rem;
    padding-inline: 2rem;
    background-color: var(--card-bg-main);
    `;

    const playerMatchesHeader = css`
    display: flex;
    flex-flow: column;
    gap: 20px;
    `;

    const statsIconBar = css`
    display: grid;
    grid-template-columns: 15fr repeat(5, 1fr) 2fr;
    justify-items: center;
    align-items: center;
    padding-block: .66rem;
    border-top: solid 1px var(--divide-bg-primary);
    border-bottom: solid 1px var(--divide-bg-primary);
    cursor: default;
    margin-bottom: .5rem;
    `;

    const pMCompetition = css`
    display: flex;
    flex-flow: row-reverse;
    gap: 10px;
    justify-self: start;
    `;

    const pMSelect = css`
    background-color: var(--card-bg-main);
    border: none;
    color: var(--primary-font-color);
    outline: var(--primary-font-color);
    `


    //===============================|  PERCENTILE STATS  | ===============================
    //
    //
    const pSCard = css`
    display: flex;
    flex-flow: column;
    font-weight: bold;
    border-radius: 2rem;
    padding-top: 1rem;
    background-color: var(--card-bg-main);
    `;

    const pSHeader = css`
    display: flex;
    flex-flow: row;
    align-items: end;
    padding-inline: 1rem
    `;

    const pSHeaderText = css`
        align-self: center;
    `

    const pSHeaderContent = css`
    flex: 1;
            display: flex;
            flex-flow: column;
            row-gap: 10px;
            color: var(--GLOBAL-FONT-COLOR-GREY);
            padding-top: 1rem;
            justify-content: end;
    `;

    const pSButtons = css`
    display: flex;
            flex-flow: row;
            justify-content: end;
            column-gap: 15px;
    `;

    const percentileStatsContent = css`
    `;

    const percentileStatsMetricTitle = css`
    margin-inline: 1rem;
    padding-inline: 1rem;
    `;
    const psButton = css`
    max-width: 200px;
    border-radius: 1.25rem;
    padding-inline: 1.5rem;
    padding-block: .75rem;
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
    box-shadow: none;
    border: none;
    outline: none;
    cursor: pointer;
    `;

    const pSButtonUntoggled = css`
    background-color: var(--percentile-button-default-bg);
    color: var(--percentile-button-default-font-color);

    &:hover {
         background-color: var(--percentile-button-hover-bg);
    }
    `;

    const pSButtonToggled = css`
     background-color: var(--percentile-button-toggled-bg);
    color: var(--percentile-button-toggled-font-color);
    `;

    const minutesPlayed = css`
    font-size: 1.25rem;
            display: flex;
            justify-content: end;
    `;

    const percentileStatsMetric = css`
    display: grid;
    align-items: center;
    grid-template-columns: 1.2fr .1fr .2fr;
    gap: 20px;
    border-radius: .5rem;
    margin-inline: 1rem;
    padding-inline: 1rem;
    `;

    const percentileStatTitle = css`
    display: flex;
    height: 40px;
    align-items: center;
    padding-left: .35rem;
    `;

    const progressBarContianer = css`
    display: flex;
    width: 300px;
    height: 12.5px;
    background-color: var(--progress-bar-background-color);
    border-radius: 1rem;
    overflow: hidden;
    position: relative;
    `;

    const progressBar = css`
    height: 100%;
    width: 0%;
    background-color: var(--PROGRESS-BAR-LOW);
    border-radius: .5rem;
    transition: width 0.35s ease-in-out;
    `;

    const [mode, setMode] = useState('per20');
    const renderbuttons = () => {
        const per20ButtonStyle = mode === 'total' ? pSButtonUntoggled : pSButtonToggled;
        const totalButtonStyle = mode === 'per20' ? pSButtonUntoggled : pSButtonToggled;
        return (
            <div css={pSButtons}>
                <button css={[psButton, per20ButtonStyle]} onClick={() => setMode('per20')}>
                    Per 20
                </button>
                <button css={[psButton, totalButtonStyle]} onClick={() => setMode('total')}>
                    Total
                </button>
            </div>
        );
    };

    const renderSection = (section) => {
        const percentileStatsItems = Object.entries(section).map(([metric, metricStats], i) => {
            const [percentileRankKey, valueKey] = mode === 'total' ? ['precentileRankTotal', 'valueTotal'] : ['precentileRankPer20', 'valuePer20']
            const metricStatsEl = Object.entries(metricStats).map((stats, i) => {
                const progressBackgroundColor = stats[1][percentileRankKey] >= 70 ? "var(--PROGRESS-BAR-HIGH)" : stats[1][percentileRankKey] >= 30 ? "var(--PROGRESS-BAR-MIDDLE)" : "var(--PROGRESS-BAR-LOW)"
                return (
                    <div
                        key={stats[0]}
                        css={percentileStatsMetric}
                        className='secondary-hover'
                    >
                        <span>{stats[1].id}</span>
                        <span css={percentileStatTitle}>{stats[1][valueKey]}</span>
                        <div css={progressBarContianer}>
                            <span css={progressBar} style={{ width: `${stats[1][percentileRankKey]}%`, backgroundColor: progressBackgroundColor }}></span>
                        </div>
                    </div>
                )
            })
            return (
                <div key={i}>
                    <h2 key={metric} css={percentileStatsMetricTitle}>
                        {metric}
                    </h2>
                    {metricStatsEl}
                </div>
            )
        });
        return percentileStatsItems
    };

    return (
        <div css={playerContent}>
            <div className="left-grid" css={playerContentItem}>
                <div css={playerHeader}>
                    <div css={playerCard}>
                        <div css={cardWrapper}>
                            <div css={cardContent}>
                                <div css={cardName}>
                                    <h1>{player.playername}</h1>
                                </div>
                                <div css={cardTeam}>
                                    <img
                                        css={cardLogo}
                                        src={player.teamLogo || 'https://cdn.glitch.global/placeholder.png'}
                                        alt={player.teamName || 'Free Agent'}
                                        width="20"
                                        height="20"
                                    />
                                    <a css={teamLinkHeader} href={`/teams/${player.teamId || ''}`}>
                                        <span>{player.teamName || 'Free Agent'}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div css={playerInfo}>
                        <section css={bio}>
                            <div css={bioValue}>
                                <div >{player.nationContinent}</div>
                                <div data-lang-es="Continente" data-lang-en="Continent" css={bioMetric}>Continent</div>
                            </div>
                            <div css={bioValue}>
                                <div >{player.shirtNum}</div>
                                <div data-lang-es="Camiseta" data-lang-en="Shirt #" css={bioMetric}>Shirt #</div>
                            </div>
                            <div css={bioValue}>
                                <div>
                                    <img
                                        src={player.nationFlag}
                                        width="14" height="14" />
                                    <div >{player.nationName}</div>
                                </div>
                                <div data-lang-es="País" data-lang-en="Country" css={bioMetric}>Country</div>
                            </div>
                            <div css={bioValue}>
                                <div >{player.league}</div>
                                <div data-lang-es="Liga" data-lang-en="League" css={bioMetric}>League</div>
                            </div>
                            <div css={bioValue}>
                                <div >{player.marketvalue}</div>
                                <div data-lang-es="Valor de Mercado" data-lang-en="Market Value" css={bioMetric}>Market value
                                </div>
                            </div>
                        </section>
                        <section css={positionSection}>
                            <div data-lang-es="Posición" data-lang-en="Position">Position</div>
                            <div css={positionWrapper}>
                                <div css={primaryPositionEl}>
                                    <div data-lang-es="Primaria" data-lang-en="Primary">
                                        Primary</div>
                                    <div id="primaryposition"></div>
                                </div>
                                <div css={otherPositionEl}>
                                    <div data-lang-es="Otros" data-lang-en="Others">Others
                                    </div>
                                    <div id="otherpositions"></div>
                                </div>
                            </div>
                            <div css={positionMapImgWrapper}>
                                <img css={positionMapImg} src="https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/positionfield?v=1741506408303"
                                    alt="Positions" width="169" height="218" />
                                {mainPosOnPosMap}
                                {otherPosOnPosMap}
                            </div>
                        </section>
                    </div>
                </div>
                <div css={competitionStatsCard}>
                    <div className="primary-hover" css={competitionStatsTitleWrapper}>
                        <a css={competitionStatsLink} href="leagues/2">
                            <h2 css={competitionStatsTitle}>
                                Exanon T3 (Copa + Liga)
                            </h2>
                        </a>
                    </div>
                    <div css={competitionStatsContent}>
                        {competitionItems}
                    </div>
                </div>
                <div css={playerMatchesCard}>
                    <div css={playerMatchesHeader}>
                        <h2 data-lang-en="Match Stats" data-lang-es="Estadísticas partidos">Match Stats</h2>
                        <div css={statsIconBar}>
                            <div id="competition" css={pMCompetition}>
                                <select css={pMSelect} id="competition-matches">
                                    <option value="alltheleagues">Todos las ligas</option>
                                    <option value="fixturesLiga3">EXL Liga Season 3</option>
                                    <option value="fixturesCopa3">EXL Copa Season 3</option>
                                </select>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="minutes">⌚</div>
                                <span css={toolTip} data-lang-en="Minutes Played"
                                    data-lang-es="Minutos Jugados">Minutes Played</span>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="goals">⚽</div>
                                <span css={toolTip} data-lang-en="Goals" data-lang-es="Goles">Goals</span>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="assists">🅰️</div>
                                <span css={toolTip} data-lang-en="Assists" data-lang-es="Asistencias">Assists</span>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="touches">🐾</div>
                                <span css={toolTip} data-lang-en="Touches" data-lang-es="Toques">Touches</span>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="passes">🧩</div>
                                <span css={toolTip} data-lang-en="Passes Completed" data-lang-es="Pases">Passes
                                    Completed</span>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="matchrating">⭐</div>
                                <span css={toolTip} data-lang-en="Matchrating"
                                    data-lang-es="Puntuación">Matchrating</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        {playerRecentMatches}
                    </div>
                </div>
                <div css={pSCard}>
                    <div css={pSHeader}>
                        <h2 css={pSHeaderText}>Season Performance
                        </h2>
                        <div css={pSHeaderContent}>
                            {renderbuttons()}
                            <div css={minutesPlayed}>
                            </div>
                        </div>
                    </div>
                    <div css={percentileStatsContent}>
                        {renderSection(player.percentileStats)}
                    </div>
                </div>
            </div>
            <div className='right-grid'>
                <div class="ratings-chart-container">
                    <div class="ratings-chart-title">
                        <h2 data-lang-es="Valoración de Jugadores" data-lang-en="Player Ratings">Player Ratings</h2>
                        <div class="ratings-chart-stats-compared-to-other">
                            <span id="whatplayerstatsarecomparedtoo"
                                class="ratings-chart-stats-compared-to-other-text">Stats compared to other players.</span>
                            <div class="ratings-chart-stats-compared-to-other-image">
                                <button onclick="ratingChartStatsComparedToOtherFAQ()">
                                    <img src="https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/question-butotn?v=1743878872340"
                                        width="14px" height="14px"></img>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="rating-chart-content">

                    </div>
                </div>
            </div>
        </div>
    );
}
