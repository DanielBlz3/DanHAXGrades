'use client';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import React from "react";
import { translationsMap } from '/lib/translations.js';
import '/styles/global.css';
import positionCoords from '/lib/posCoordsPlayerPosMap.json';
import SoccerField from '/components/pitchSVGVertical.jsx';

function isLight(rgbString) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = rgb;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness >= 200;
}

export default function PlayerPageClient({ player }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const updateThemeColors = () => {
            const storedTheme = localStorage.getItem('theme') || 'theme-light';
            setTheme(storedTheme);

            const root = document.documentElement;
            if (storedTheme === 'theme-light') {
                root.style.setProperty('--team-color', player.teamColors.teamColorMain);
                root.style.setProperty('--team-font-color', isLight(player.teamColors.teamColorMain) ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)');
            } else {
                root.style.setProperty('--team-color', player.teamColors.teamColorAlternate);
                root.style.setProperty('--team-font-color', isLight(player.teamColors.teamColorAlternate) ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)');
            }
        };

        updateThemeColors();
        window.addEventListener('themechange', updateThemeColors);
        return () => {
            window.removeEventListener('themechange', updateThemeColors);
        };
    }, [player]);

    const teamColor = theme === "theme-light" ? player?.teamColors?.teamColorMain : player?.teamColors?.teamColorAlternate;
    const mainPosition = player?.playerPositions?.positions.find(p => p.isMainPos === true) || null;
    const otherPositions = player?.playerPositions?.positions.filter(p => !p.isMainPos && (p.ratio >= 0.166 || p.occurences >= 2)) || [];
    const otherPositionsStr = otherPositions.length ? otherPositions.map(p => translationsMap?.[p.id]?.[language]).reduce((acc, curr) => acc + ", " + curr) : ""
    const minutes = player.totalStats.minutes

    //===============================|  LAYOUT  | ===============================
    const playerContent = css`
    display: grid;
    grid-template-columns: minmax(853px, 2fr) minmax(327px, 1fr);
    grid-gap: 1rem;
    max-width: 1280px;
    width: 100%;
    overflow-x: hidden;

    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  `;

    const playerContentItem = css`
    display: flex;
    flex-flow: column;
    gap: 1rem;
    width: 100%
  `;

    const playerHeader = css`
    display: flex;
    flex-flow: column;
    width: 100%;
  `;

    const playerInfo = css`
    display: flex;
    flex-flow: row;
    width: 100%;
    background-color: var(--primary-card-bg);
    border-radius: 0 0 1.25rem 1.25rem;

    @media (max-width: 800px) {
      flex-flow: column;
    }
  `;

    //===============================|  PLAYER CARD  | ===============================
    const playerCard = css`
    background-color: var(--team-color);
    color: var(--team-font-color);
    border-radius: 1.25rem 1.25rem 0 0;
    padding: 1rem;
    max-width: 100%;
    margin: 0;
  `;

    const cardWrapper = css`
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    gap: 10px;
  `;

    const cardContent = css`
    display: flex;
    flex-flow: row;
    gap: .5rem;
    align-items: center;
    `;

    const avatar = css`
    border-radius: 50%;
    `;

    const cardText = css`
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
    color: var(--team-font-color);
    gap: 5px;
    place-items: center;
  `;

    const cardLogo = css`
    display: inline;
  `;

    const teamLinkHeader = css`
    color: var(--team-font-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  `;

    //===============================|  TOOLTIP  | ===============================
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
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    transition: opacity 0.2s ease;
    pointer-events: none;
  `;

    //===============================|  BIO SECTION  | ===============================
    const bio = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 250px;
    max-height: 300px;
    border-right: 1px solid var(--primary-divider-bg);
    padding-left: 1rem;
    flex: 1;
     @media (max-width: 800px) {
    border-right: none;
    border-bottom: 1px solid var(--primary-divider-bg);
    }
  `;

    const bioItem = css`
    display: flex;
    flex-flow: column;
    justify-content: center;
    width: 150px;
    height: 75px;
    border-bottom: 1px solid var(--primary-divider-bg);
  `;

    const bioValue = css``

    const bioMetric = css`
    font-size: 0.8rem;
    color: var(--GLOBAL-FONT-COLOR-GREY);
    padding-top: 0.3rem;
  `;

    const bioNation = css`
    display: flex;
    flex-flow: row;
    gap: 5px;
    align-items: center
  `
  function getRatingColor(rating) {
      //COLOR DEPENDS ON RATING, RETURNS A CSS
        let ratingColor;
        if (rating >= 90) ratingColor = "var(--RATING-BLUE)";
        else if (rating >= 80) ratingColor = "var(--RATING-GREEN)";
        else if (rating >= 65) ratingColor = "var(--RATING-ORANGE)";
        else ratingColor = "var(--RATING-RED)";

        return css`
        display: flex;
        place-items: center;
        justify-content: center;
        background-color: ${ratingColor};
        color: white;
        border-radius: .5rem;
        cursor: default;
        width: 30px;
        `;
    }

    //===============================|  POSITIONS  | ===============================

    const positionSection = css`
    display: flex;
    flex: 1;
    flex-flow: column wrap;
    justify-content: center;
    height: 250px;
    max-height: 300px;
    padding: 1rem;
    border-radius: 1.25rem;
    gap: 10px;
  `;

    const positionMapImgWrapper = css`
    position: relative;
    width: 169px;
    height: 218px;
  `;
    const positionsContainer = css``;
    const positionsWrapper = css`
    display: flex;
    flex-flow: column;
    gap: .25rem;
    max-width: 200px
    `;
    const playerPositionStr = css`
    font-size: 14px;
    `

    const mainPositionCoords = positionCoords?.[mainPosition?.id];
    const label = translationsMap?.[mainPosition?.id]?.[language]

    const mainPosOnPosMap = mainPosition ? (
        <div
            title={label}
            css={css`
        position: absolute;
        left: ${mainPositionCoords.x - 10}%;
        top: ${mainPositionCoords.y}%;
        color: var(--team-font-color);
        background-color: var(--team-color);
        font-size: 0.8rem;
        font-weight: 600;
        padding: 4px 6.25px;
        border-radius: 1.25rem;
        min-width: 37.5px;
        display: flex;
        justify-content: center;
        text-align: center;
        object-fit: cover;
      `}
        >
            {mainPosition?.id}
        </div>
    ) : (
        null
    );

    const otherPosOnPosMap = otherPositions
        .map((pos) => {
            const posCoords = positionCoords?.[pos.id]
                ? { x: positionCoords[pos.id].x - 10, y: positionCoords[pos.id].y }
                : { x: 0, y: 0 };

            const isLightTheme = theme === "theme-light";
            const label = translationsMap?.[pos.id]?.[language]

            return (
                <div
                    key={pos.id}
                    title={label}
                    css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            left: ${posCoords.x}%;
            top: ${posCoords.y}%;
            min-width: 37.5px;
            background-color: grey;
            opacity: ${(pos.ratio * 100 + 25) / 100};
            color: ${isLightTheme ? "white" : "black"};
            z-index: 8;
            padding: 4px 6.25px;
            border-radius: 1.25rem;
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
            background-color: var(--primary-card-bg);
            border-radius: 1.25rem;
    `

    const competitionStatsTitleWrapper = css`
    flex-flow: row wrap;
    max-width: 100%;
    border-radius: 1.25em 1.25em 0 0;
    border-right: none;
    border-bottom: 1px solid var(--primary-divider-bg);
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
    min-height: 200px;
    max-width: 100%;
    padding: 1rem;
    border-radius: 0 0 1.25em 1.25em;
    border-right: none;

    @media (max-width: 800px) {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }
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

    const RenderCompetitionStats = ({ stats, minutes }) => {
        if (minutes > 0) {
            const competitionItems = stats.map((i, index) => {
                const isMatchRatingEl = (i.id === 'matchRating')
                const valueCss = isMatchRatingEl ? 'secondary-rating' : null
                const colorCss = isMatchRatingEl ? i.value > 6.999 ? 'var(--RATING-GREEN)' : i.value > 5.499 ? 'var(--RATING-ORANGE)' : 'var(--RATING-RED)' : null
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
                        background-color: ${colorCss};
                        `
                        }
                            className={valueCss}
                        >{i.value}</span>
                        <span css={
                            css` color: var(--GLOBAL-FONT-COLOR-GREY); font-weight: bold;`}
                        >{translationsMap?.[i.id]?.[language]}</span>
                    </div>
                )
            })

            return (
                <div css={competitionStatsCard}>
                    <div className="primary-hover" css={competitionStatsTitleWrapper}>
                        <a css={competitionStatsLink} href="/leagues/2/overview">
                            <h2 css={competitionStatsTitle}>
                                Exanon T3 (Copa + Liga)
                            </h2>
                        </a>
                    </div>
                    <div css={competitionStatsContent}>
                        {competitionItems}
                    </div>
                </div>
            )
        } else {
            return null
        }
    }


    //===============================|  PLAYER MATCHES  | ===============================
    //
    //
    const RenderPlayerRecentMatches = ({ matches }) => {
        if (matches.length) {
            const RenderPlayerRecentMatchesContent = matches.map((match, index) => (
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

            return (
                <div css={playerMatchesCard}>
                    <div css={playerMatchesHeader}>
                        <h2>{translationsMap?.["matchStats"]?.[language]}</h2>
                        <div css={statsIconBar}>
                            <div id="competition" css={pMCompetition}>
                                <select css={pMSelect} id="competition-matches">
                                    <option value="alltheleagues">{translationsMap?.["everyLeague"]?.[language]}</option>
                                    <option value="fixturesLiga3">EXL Liga Season 3</option>
                                    <option value="fixturesCopa3">EXL Copa Season 3</option>
                                </select>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="minutes">⌚</div>
                                <span css={toolTip}>Minutes Played</span>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="goals">⚽</div>
                                <span css={toolTip}>Goals</span>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="assists">🅰️</div>
                                <span css={toolTip}>Assists</span>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="touches">🐾</div>
                                <span css={toolTip}>Touches</span>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="passes">🧩</div>
                                <span css={toolTip}>Passes Completed</span>
                            </div>
                            <div css={toolTipWrapper}>
                                <div id="matchrating">⭐</div>
                                <span css={toolTip}>Matchrating</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        {RenderPlayerRecentMatchesContent}
                    </div>
                </div>
            )
        } else {
            return null
        }
    }

    const playerMatchesCard = css`
    padding-top: 1rem;
    border-radius: 1.25rem;
    padding-inline: 2rem;
    background-color: var(--primary-card-bg);
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
    border-top: solid 1px var(--primary-divider-bg);
    border-bottom: solid 1px var(--primary-divider-bg);
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
    background-color: var(--primary-card-bg);
    border: none;
    color: var(--primary-font-color);
    outline: var(--primary-font-color);
    `


    //===============================|  PERCENTILE STATS  | ===============================
    const pSCard = css`
    display: flex;
    flex-flow: column;
    font-weight: bold;
    border-radius: 2rem;
    padding-top: 1rem;
    background-color: var(--primary-card-bg);
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
    margin: 1rem;
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
    border-radius: 1.25rem;
    overflow: hidden;
    position: relative;
     @media (max-width: 800px) {
    width: 150px;
    }
    `;

    const progressBar = css`
    height: 100%;
    width: 0%;
    background-color: var(--PROGRESS-BAR-LOW);
    border-radius: .5rem;
    transition: width 0.35s ease-in-out;
    `;

    const [mode, setMode] = useState('per20');
    const Renderbuttons = () => {
        const per20ButtonStyle = mode === 'total' ? pSButtonUntoggled : pSButtonToggled;
        const totalButtonStyle = mode === 'per20' ? pSButtonUntoggled : pSButtonToggled;
        return (
            <div css={pSButtons}>
                <button css={[psButton, per20ButtonStyle]} onClick={() => setMode('per20')}>
                    {translationsMap?.["per20"]?.[language]}
                </button>
                <button css={[psButton, totalButtonStyle]} onClick={() => setMode('total')}>
                    {translationsMap?.["total"]?.[language]}
                </button>
            </div>
        );
    };

    const RenderPercentileStats = (stats, minutes) => {
        if (minutes >= 25) {
            const RenderPercentileStatsContent = () => {
                var percentileStatsItems = Object.entries(stats).map(([metric, metricStats], i) => {
                    const [percentileRankKey, valueKey] = mode === 'total' ? ['precentileRankTotal', 'valueTotal'] : ['precentileRankPer20', 'valuePer20']
                    const metricStatsEl = Object.entries(metricStats).map((stats, i) => {
                        const progressBackgroundColor = stats[1][percentileRankKey] >= 70 ? "var(--PROGRESS-BAR-HIGH)" : stats[1][percentileRankKey] >= 30 ? "var(--PROGRESS-BAR-MIDDLE)" : "var(--PROGRESS-BAR-LOW)"
                        return (
                            <div
                                key={stats[0]}
                                css={percentileStatsMetric}
                                className='secondary-hover'
                            >
                                <span>{translationsMap?.[stats[1].id]?.[language]}</span>
                                <span css={percentileStatTitle}>{stats[1][valueKey]}</span>
                                <div title={`${stats[1][percentileRankKey]}%`} css={progressBarContianer}>
                                    <span css={progressBar} style={{ width: `${stats[1][percentileRankKey]}%`, backgroundColor: progressBackgroundColor }}></span>
                                </div>
                            </div>
                        )
                    })
                    return (
                        <div key={i}>
                            <h3 key={metric} css={percentileStatsMetricTitle}>
                                {translationsMap?.[metric]?.[language]}
                            </h3>
                            {metricStatsEl}
                        </div>
                    )
                });

                return percentileStatsItems
            }
            return (
                <div css={pSCard}>
                    <div css={pSHeader}>
                        <h2 css={pSHeaderText}>{translationsMap?.["seasonPerformance"]?.[language]}</h2>
                        <div css={pSHeaderContent}>
                            {Renderbuttons()}
                            <div css={minutesPlayed}>
                                {`${translationsMap?.["minutes"]?.[language]}: ${minutes}`}
                            </div>
                        </div>
                    </div>
                    <div css={percentileStatsContent}>
                        {RenderPercentileStatsContent()}
                    </div>
                </div>
            )
        } else {
            return null
        }
    }



    //===============================|  RATINGS  | ===============================
    const ratingsCard = css`
    width: 100%;
                font-size: 0.8rem;
                border-radius: 1.25rem;
                background-color: var(--primary-card-bg);
                display: flex;
                flex-flow: column;
                max-height: 500px;
    `;

    const ratingsChartHeader = css`
                min-width: 100%;
                display: flex;
                flex-flow: column;
                align-items: start;
                margin-top: 1rem;
                margin-left: 1rem;
                padding-bottom: .2rem;
                text-align: center;
                border-bottom: solid 1px var(--primary-divider-bg);
    `;

    const percentileStatComparison = css`
     display: flex;
    flex-flow: row;
    width: 100%;
    `;

    const percentileStatComparisonContent = css`
    display: flex;
    flex-flow: row;
    width: 100%;
    `;

    const percentileStatComparisonImg = css`
    margin-bottom: -3px;
    align-self: center;
    `;

    const percentileStatComparisonButton = css`
    background-color: var(--invisible);
    filter: brightness(var(--settings-button-color));
    border: none;
    cursor: pointer;
    z-index: 1000;
    &:hover {
     transform: scale(1.3);
    transform-origin: center;
    transition: transform 150ms ease-in-out;
    }
    `;

    const ratingContent = css`
    display: flex;
    align-items: center;
    margin-inline: 1rem;
    `;

    const ratingContentLeft = css`
        display: flex;
    align-items: flex-end;
    flex-flow: column-reverse;

    > :first-child {
    margin-right: -25px;
  }

  > :last-child {
      margin-right: -25px;
  }
    `

    const ratingContentRight = css`
        display: flex;
    align-items: flex-start;
    flex-flow: column;


    > :first-child {
    margin-left: -25px;
  }

  > :last-child {
      margin-left: -25px;
  }
    `;

    const ratingContentItem = css`
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    gap: 50px;
    `;

    const ratingChart = css`
        flex: 2;
  display: block;
  max-width: 300px;
  height: 250px;
  display: block;
    `;

    const ratingChartLegendItem = css`
    display: flex;
    flex-flow: row;
    align-items: center;
    gap: 5px;
      @media (max-width: 600px) {
          flex-flow: column-reverse;
              gap: 0;
        }
    `;

    const ratingLegendLeft = css`
        flex-flow: row;
    `;

    const ratingLegendRight = css`
    flex-flow: row-reverse;
    `;

    const ratingChartMetric = css`
        color: var(--GLOBAL-FONT-COLOR-GREY);
    `;

    const ratingChartValue = css`
        font-weight: bold;
    `;

    function generateHexPaths(ratings) {
        const center = { x: 96, y: 96 };
        const radius = 91;
        const angleStep = (2 * Math.PI) / ratings.length;
        const rotationOffset = -Math.PI / 2; // Rotate -90 degrees for vertical hex

        return ratings.map((rating, i) => {
            const valueRatio = rating.value / 100;
            const startAngle = angleStep * (i + 1) + rotationOffset;
            const endAngle = angleStep * (i) + rotationOffset;

            const x1 = center.x + Math.cos(startAngle) * radius * valueRatio;
            const y1 = center.y + Math.sin(startAngle) * radius * valueRatio;
            const x2 = center.x + Math.cos(endAngle) * radius * valueRatio;
            const y2 = center.y + Math.sin(endAngle) * radius * valueRatio;

            return (
                <path
                    key={i}
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d={`M${center.x} ${center.y} L${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} Z`}
                    fill={teamColor}
                    fillOpacity={0.3 + 0.6 * valueRatio}
                    mask="url(#hexagon-mask-right)"
                />
            );
        });
    }

    const RenderRatings = ({ ratings, minutes }) => {
        if (minutes >= 25) {
            function ratingLegend(side) {
                const [min, max, css] = side === "left" ? [3, 6, ratingLegendLeft] : [0, 3, ratingLegendRight]
                const legendItem = ratings.slice(min, max).map(s => {
                    return (
                        <div
                            css={[ratingChartLegendItem, css]}
                            key={s.title}
                        >
                            <span css={ratingChartMetric}>
                                {translationsMap?.[s.title]?.[language]}
                            </span>
                            <span css={ratingChartValue}>
                                {s.value}
                            </span>
                        </div>
                    )
                })
                return legendItem
            }
            const leftLegend = ratingLegend('left')
            const rightLegend = ratingLegend('right')

            let ratingsComparison
            switch (true) {
                case ["ST"].includes(mainPosition?.id):
                    if (language == "en") ratingsComparison = "Stats compared to other strikers.";
                    if (language == "es") ratingsComparison = "Estadísticas comparadas con otros delanteros.";
                    break;
                case ["LW", "RW", "AM"].includes(mainPosition?.id):
                    if (language == "en") ratingsComparison = "Stats compared to other attacking midfielders/wingers.";
                    if (language == "es") ratingsComparison = "Estadísticas comparadas con otros centrocampistas ofensivos/extremos.";
                    break;
                case ["CM", "DM", "LM", "RM"].includes(mainPosition?.id):
                    if (language == "en") ratingsComparison = "Stats compared to other midfielders.";
                    if (language == "es") ratingsComparison = "Estadísticas comparadas con otros centrocampistas.";
                    break;
                case ["LB", "RB", "LWB", "RWB"].includes(mainPosition?.id):
                    if (language == "en") ratingsComparison = "Stats compared to other fullbacks.";
                    if (language == "es") ratingsComparison = "Estadísticas comparadas con otros laterales.";
                    break;
                case ["CB"].includes(mainPosition?.id):
                    if (language == "en") ratingsComparison = "Stats compared to other center-backs.";
                    if (language == "es") ratingsComparison = "Estadísticas comparadas con otros centrales.";
                    break;
                case ["GK"].includes(mainPosition?.id):
                    if (language == "en") ratingsComparison = "Stats compared to other keepers.";
                    if (language == "es") ratingsComparison = "Estadísticas comparadas con otros porteros.";
                    break;
                default:
                    if (language == "en") ratingsComparison = "Stats compared to other players.";
                    if (language == "es") ratingsComparison = "Estadísticas comparadas con otros jugadores.";
            }

            return (
                <div css={ratingsCard}>
                    <div css={ratingsChartHeader}>
                        <h2>{translationsMap?.["playerRatings"]?.[language]}</h2>
                        <div css={percentileStatComparison}>
                            <span css={percentileStatComparisonContent}>{ratingsComparison}</span>
                            <div css={percentileStatComparisonImg}>
                                <button css={percentileStatComparisonButton}>
                                    <img src="https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/question-butotn?v=1743878872340"
                                        width="14px" height="14px"></img>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div css={ratingContent}>
                        <div css={[ratingContentItem, ratingContentLeft]}>
                            {leftLegend}
                        </div>
                        <svg css={ratingChart} viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <mask id="hexagon-mask-right">
                                    <rect width="100%" height="100%" fill="black" />
                                    <path
                                        d="M169.174 47.4019L101.5 8.33014C98.0961 6.36518 93.9029 6.36517 90.4995 8.33013L22.8252 47.4019C19.4218 49.3669 17.3252 52.9983 17.3252 56.9282V135.072C17.3252 139.002 19.4218 142.633 22.8252 144.598L90.4995 183.67C93.9029 185.635 98.0961 185.635 101.5 183.67L169.174 144.598C172.577 142.633 174.674 139.002 174.674 135.072V56.9282C174.674 52.9983 172.577 49.3669 169.174 47.4019Z"
                                        fill="white"
                                    />
                                </mask>
                            </defs>
                            {generateHexPaths(player.ratings)}
                            <path fillRule="evenodd" clipRule="evenodd" d="M96.5 6L96.5 186L95.5 186L95.5 6L96.5 6Z" fill="var(--player-radar-bg)"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M173.885 51.5L18 141.5L17.5 140.634L173.385 50.634L173.885 51.5Z" fill="var(--player-radar-bg)"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.6311 50.5L174.516 140.5L174.016 141.366L18.1311 51.366L18.6311 50.5Z" fill="var(--player-radar-bg)"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M169.174 47.4019L101.5 8.33014C98.0961 6.36518 93.9029 6.36517 90.4995 8.33013L22.8252 47.4019C19.4218 49.3669 17.3252 52.9983 17.3252 56.9282V135.072C17.3252 139.002 19.4218 142.633 22.8252 144.598L90.4995 183.67C93.9029 185.635 98.0961 185.635 101.5 183.67L169.174 144.598C172.577 142.633 174.674 139.002 174.674 135.072V56.9282C174.674 52.9983 172.577 49.3669 169.174 47.4019ZM102 7.46411C98.2867 5.32052 93.7123 5.32052 89.9995 7.46411L22.3252 46.5359C18.6124 48.6795 16.3252 52.641 16.3252 56.9282V135.072C16.3252 139.359 18.6124 143.321 22.3252 145.464L89.9995 184.536C93.7123 186.68 98.2867 186.68 102 184.536L169.674 145.464C173.387 143.321 175.674 139.359 175.674 135.072V56.9282C175.674 52.641 173.387 48.6795 169.674 46.5359L102 7.46411Z" fill="var(--player-radar-bg)"></path>
                        </svg>
                        <div css={[ratingContentItem, ratingContentRight]}>
                            {rightLegend}
                        </div>
                    </div>
                </div>
            )
        } else {
            return null
        }
    }

    return (
        <div css={playerContent}>
            <div className="left-grid" css={playerContentItem}>
                <div css={playerHeader}>
                    <div css={playerCard}>
                        <div css={cardWrapper}>
                            <div css={cardContent}>
                                <img css={avatar} src={player.avatar} width={50} height={50}/>
                                <div css={cardText}>
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
                    </div>
                    <div css={playerInfo}>
                        <section css={bio}>
                            <div css={bioItem}>
                                <div css={bioValue} >{player.nationContinent}</div>
                                <div css={bioMetric}>{translationsMap?.["continent"]?.[language]}</div>
                            </div>
                            <div css={bioItem}>
                                <div css={bioValue} >{player.username || "N/A"}</div>
                                <div css={bioMetric}>{translationsMap?.["username"]?.[language]}</div>
                            </div>
                            <div css={bioItem}>
                                <div css={bioNation}>
                                    <img
                                        src={player.nationFlag}
                                        width="14" height="14" />
                                    <div css={bioValue} >{player.nationName}</div>
                                </div>
                                <div css={bioMetric}>{translationsMap?.["country"]?.[language]}</div>
                            </div>
                            <div css={bioItem}>
                                <div css={bioValue} >{player.league}</div>
                                <div css={bioMetric}>{translationsMap?.["league"]?.[language]}</div>
                            </div>
                            <div css={bioItem}>
                                <div css={bioValue} >{player.marketvalue}</div>
                                <div css={bioMetric}>{translationsMap?.["marketValue"]?.[language]}</div>
                            </div>
                            <div css={bioItem}>
                                <div css={[bioValue, getRatingColor(player.rating)]} >{player.rating}</div>
                                <div css={bioMetric}>{translationsMap?.["rating"]?.[language]}</div>
                            </div>
                        </section>
                        <section css={positionSection}>
                            <h3>{translationsMap?.["position"]?.[language]}</h3>
                            <div css={positionsContainer}>
                                <div css={positionsWrapper}>
                                    <h4>{translationsMap?.["primary"]?.[language]}</h4>
                                    <div css={playerPositionStr}>{translationsMap?.[mainPosition?.id]?.[language]}</div>
                                </div>
                                <div css={positionsWrapper}>
                                    <h4>{translationsMap?.["others"]?.[language]}</h4>
                                    <div css={playerPositionStr}>{otherPositionsStr}</div>
                                </div>
                            </div>
                            <div css={positionMapImgWrapper}>
                                <SoccerField width={169} height={230} fillColor={'var(--secondary-soccer-field-bg)'} strokeColor={'var(--secondary-soccer-field-stroke)'} />
                                {mainPosOnPosMap}
                                {otherPosOnPosMap}
                            </div>
                        </section>
                    </div>
                </div>
                <RenderCompetitionStats stats={player.competitionStats} minutes={minutes} />
                <RenderPlayerRecentMatches matches={player.recentGames} />
                {RenderPercentileStats(player.percentileStats, minutes)}
            </div>
            <div className='right-grid' css={playerContentItem}>
                <RenderRatings ratings={player.ratings} minutes={minutes} />
            </div>
        </div>
    );
}
