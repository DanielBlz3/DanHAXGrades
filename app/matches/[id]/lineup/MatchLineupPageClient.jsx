'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { translationsMap } from '/lib/translations';
import formatMatchTimestamp from '/lib/timeFormatter';
import '/styles/global.css';
import positionCoords from '/lib/posCoordsPlayerPosMap';
import SoccerField from '/components/pitchSVGHorizontal';
import Player from '/components/Player';
import SubstituteEl from '/components/Substitutes.jsx';

export default function MatchLineupPageClient({ match }) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'lineup';
    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const updateThemeColors = () => {
            const storedTheme = localStorage.getItem('theme') || 'theme-light';
            setTheme(storedTheme);
        };

        updateThemeColors();

        window.addEventListener('themechange', updateThemeColors);

        return () => {
            window.removeEventListener('themechange', updateThemeColors);
        };
    }, [match]);

    const matchContent = css`
      display: grid;
      overflow-x: hidden;
      width: 100%;
    `;

    const matchContentWrapper = css`
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: center;
    `;

    const teamsLineupsInfo = css`
  background-color: var(--team-formation-info--bg-color);
  border-radius: 1.25rem 1.25rem 0 0;
  color: var(--team-formation-info-font-color);
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1rem;
`;

    const teamInfoLineup = css`
  align-items: center;
  display: flex;
  flex-flow: row;
  gap: 2vw;
`;

    const homeTeamLineup = css`
  flex-flow: row;
`;

    const awayTeamLineup = css`
  flex-flow: row-reverse;
`;

    const lineupTeam = css`
  align-items: center;
  display: flex;
  flex-flow: row;
  gap: 0.5vw;
`;

    const playerUi = css`
  background-color: var(--player-ui-bg-color);
  border-radius: 1rem;
  bottom: 45%;
  color: var(--primary-font-color);
  display: none;
  flex-direction: column;
  position: fixed;
  right: 50%;
  transform: translate(50%, 50%);
  width: 400px;
  z-index: 1000;
`;

    const playerUiOverlay = css`
  background: rgba(0, 0, 0, 0.7);
  display: none;
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
`;

    const playerUiHeader = css`
  align-items: center;
  background-color: var(--card-bg-main);
  border-radius: 1rem 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  max-height: 100px;
  min-height: 67.5px;
  padding-top: 1.5rem;
  width: 100%;
  z-index: 111111;
`;

    const playerUiName = css`
  color: var(--font-default-color);
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

    const playerUiMain = css`
  max-height: 350px;
  overflow-y: scroll;
  padding-top: 1rem;
`;

    const playerUiStats = css`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
`;

    const playerUiNationality = css`
  display: flex;
  flex-flow: row;
align-items: center;
  gap: 9x;
  justify-content: center;
`;

    const headerMetric = css`
  background-color: var(--card-bg-main);
  border-bottom: solid 0.25px rgb(75, 75, 75);
  display: flex;
  flex-direction: row;
  padding-bottom: 1rem;
  width: 100%;
`;

    const headerMetricItem = css`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

    const playerUiBioMetric = css`
  color: grey;
`;

    const statGroup = css`
  display: flex;
  flex-direction: column;
`;

    const statGroupTitle = css`
  height: 2rem;
`;

    const statLine = css`
  line-height: 2;
`;

    const substitutesContainer = css`
  background-color: var(--card-bg-main);
  border-radius: 0 0 1.5rem 1.5rem;
  text-align: center;
`;

    const substitutesTitle = css`
  align-items: center;
  display: flex;
  height: 5rem;
  justify-content: center;
`;

    const substitutesContent = css`
  column-gap: 10vw;
  display: grid;
  grid-template-columns: 1fr 1fr;
  list-style: none;
  padding-bottom: 1rem;
`;

    const soccerFieldWrapper = css`
  height: 600px;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;
`;

    const renderLineupContent = () => {
        if (["FT", "Live", "AET"].includes(match.matchStatus.statusShort)) {
            const lineup = match.lineup
            const renderTeamInfo = () => {
                function renderTeam(team) {
                    const teamWrapperCSS = team === 'home' ? homeTeamLineup : awayTeamLineup
                    const lineupTeamInfo = match.lineup[team]
                    const rating = lineupTeamInfo.rating
                    const ratingColor = Number(rating) >= 7.0 ? 'var(--RATING-GREEN)' : Number(rating) >= 5.5 ? 'var(--RATING-ORANGE)' : 'var(--RATING-RED)'
                    const teamRating = css`
                background-color: ${ratingColor};
                `
                    return (
                        <div css={[teamInfoLineup, teamWrapperCSS]}>
                            <div className="primary-rating" css={teamRating}>
                                <span>{rating}</span>
                            </div>
                            <div css={lineupTeam}>
                                <img src={match.general[team].logo} width="20px" />
                                <span>{lineupTeamInfo.teamName}</span>
                            </div>
                            <span>{lineupTeamInfo.formationTitle}</span>
                        </div>
                    )
                }
                const homeEl = renderTeam('home')
                const awayEl = renderTeam('away')

                return (
                    <div css={teamsLineupsInfo}>
                        {homeEl}
                        {awayEl}
                    </div>
                )
            }

            const renderLineups = () => {
                const PlayerEvent = ({ icon, count, leftOrRight, initialX, y, metric }) => {
                    return [...Array(count)].map((_, i) => {
                        const style = {
                            bottom: `${y}%`,
                            [leftOrRight]: `${initialX - 10 * i}px`, // fixed math here
                            zIndex: 8 - i,
                        };

                        if (metric === "ownGoals") {
                            style.filter = "hue-rotate(110deg) saturate(1)";
                        }

                        return (
                            <div key={i} className="player-event" style={style}>
                                {icon}
                            </div>
                        );
                    });
                };

                // LineupField maps players and passes Player component imported from elsewhere
                const LineupField = ({ team }) => {
                    const players = Object.values(lineup[team].players)
                        .filter((p) => p.playerNumber <= 10)
                        .sort((a, b) => a.playerNumber - b.playerNumber);

                    return players.map((player) => (
                        <Player
                            key={player.id}
                            player={player}
                            team={team}
                            // Pass PlayerEvent component if Player needs it (if not, ignore)
                            PlayerEvent={PlayerEvent}
                        />
                    ));
                };

                const SubstitutesList = ({ team, lineup }) => {
                    const playersObj = team === "home" ? lineup.home.players : lineup.away.players;

                    const substitutes = Object.values(playersObj)
                        .filter(player => player.playerNumber >= 11)
                        .sort((a, b) => a.playerNumber - b.playerNumber);

                    return (
                        <ul>
                            {substitutes.map(player => (
                                <SubstituteEl key={player.id} player={player} />
                            ))}
                        </ul>
                    );
                };
                return (
                    <div>
                        <div css={soccerFieldWrapper}>
                            <SoccerField
                                width={950}
                                height={600}
                                fillColor={"var(--soccer-field-bg-color-primary)"}
                                strokeColor={"var(--soccer-field-stroke)"}
                            />
                            <LineupField team="home" />
                            <LineupField team="away" />
                        </div>
                        <div css={substitutesContainer}>
                            <h2 css={substitutesTitle}>Substitutes</h2>
                            <div css={substitutesContent}>
                                <div>
                                    <SubstitutesList team="home" lineup={lineup} />
                                </div>
                                <div>
                                    <SubstitutesList team="away" lineup={lineup} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            };

            return (
                <div>
                    {renderTeamInfo()}
                    {renderLineups()}
                </div>
            )
        }
    }

    function getRatingClass(rating, isMvp) {
        let ratingColor;
        if (isMvp === true) ratingColor = "var(--RATING-BLUE)";
        else if (rating < 5.5) ratingColor = "var(--RATING-RED)";
        else if (rating < 6.949) ratingColor = "var(--RATING-ORANGE)";
        else ratingColor = "var(--RATING-GREEN)";

        return css`
            background-color: ${ratingColor};
            color: white;
            font-weight: bold;
            border-radius: 1rem;
            padding: 0.025rem 0.3rem;
            cursor: default;
          `;
    }

    function generateGroupedStats(s) {
        const stats = s?.["1"].stats
        console.log(stats)
        const isGoalkeeper = s?.["1"].isGoalkeeper
        const chancesCreated = stats?.keyPasses + stats?.assists;

        if (isGoalkeeper) {
            return {
                stats: [[translationsMap?.["minutes"]?.[language], stats?.minutes]],
                distribution: [
                    [translationsMap?.["touches"]?.[language], stats?.touches],
                    [translationsMap?.["passingA"]?.[language], stats?.passingA]
                ],
                gkStats: [
                    ...(stats?.bigErrors ? [[translationsMap?.["bigErrors"]?.[language], stats?.bigErrors]] : []),
                    ...(stats?.ownGoals ? [[translationsMap?.["ownGoals"]?.[language], stats?.ownGoals]] : []),
                    [translationsMap?.["saves"]?.[language], stats?.saves],
                    [translationsMap?.["goalsConceded"]?.[language], stats?.goalsConceded],
                    [translationsMap?.["actedAsSweeper"]?.[language], stats?.actedAsSweeper],
                    [translationsMap?.["gkRecovery"]?.[language], stats?.gkRecovery],
                    [translationsMap?.["gkPunches"]?.[language], stats?.gkPunches],
                    ...(stats?.errors ? [[translationsMap?.["errors"]?.[language], stats?.errors]] : []),
                ]
            };
        } else {
            return {
                stats: [[translationsMap?.["minutes"]?.[language], stats?.minutes]],
                shooting: [
                    [translationsMap?.["goals"]?.[language], stats?.goals],
                    [translationsMap?.["shots"]?.[language], stats?.shots],
                    ...(stats?.bcm ? [[translationsMap?.["bcm"]?.[language], stats?.bcm]] : []),
                ],
                passing: [
                    [translationsMap?.["passingA"]?.[language], stats?.passingA],
                    [translationsMap?.["assists"]?.[language], stats?.assists],
                    [translationsMap?.["chancesCreated"]?.[language], chancesCreated]
                ],
                possession: [[translationsMap?.["touches"]?.[language], stats?.touches]],
                defense: [
                    ...(stats?.bigErrors ? [[translationsMap?.["bigErrors"]?.[language], stats?.bigErrors]] : []),
                    ...(stats?.ownGoals ? [[translationsMap?.["ownGoals"]?.[language], stats?.ownGoals]] : []),
                    ...(stats?.lastManTackles ? [[translationsMap?.["lastManTackles"]?.[language], stats?.lastManTackles]] : []),
                    ...(stats?.clearancesOffTheLine ? [[translationsMap?.["clearancesOffTheLine"]?.[language], stats?.clearancesOffTheLine]] : []),
                    [translationsMap?.["defensiveActions"]?.[language], stats?.defensiveActions],
                    ...(stats?.errors ? [[translationsMap?.["errors"]?.[language], stats?.errors]] : []),
                    [translationsMap?.["duelsWon"]?.[language], stats?.duelsWon],
                    [translationsMap?.["duelsLost"]?.[language], stats?.duelsLost],
                    [translationsMap?.["duelsP"]?.[language], stats?.duelsP],
                ]
            };
        }
    }
    const PlayerStatsDisplay = ({ groupedStats }) => {
        return (
            visible && playerData ? (
                <>
                    <div css={playerUiOverlay} className="player-ui-overlay" style={{ display: 'flex' }}></div>
                    <div css={playerUi} className="player-ui" style={{ display: 'flex' }}>
                        <div css={playerUiHeader}>
                            <a css={playerUiName} href={`/players/${playerData.id}`}> {playerData.name} </a>
                            <div css={headerMetric}>
                                <div css={headerMetricItem}>
                                    <span>{playerData.position}</span>
                                    <span css={playerUiBioMetric}>{translationsMap?.["position"]?.[language]}</span>
                                </div>
                                <div css={headerMetricItem}>
                                    <span css={getRatingClass(playerStats?.["1"].matchRating, playerStats?.["1"].isMvp)}> {playerStats?.["1"].matchRatingRounded} </span>
                                    <span css={playerUiBioMetric}>{translationsMap?.["matchRating"]?.[language]}</span>
                                </div>
                                <div css={headerMetricItem}>
                                    <div css={playerUiNationality}>
                                        <img height="17" width="17" src={playerData.nationFlag} />
                                        <span >{playerData.nationName}</span>
                                    </div>
                                    <span css={playerUiBioMetric}>{translationsMap?.["country"]?.[language]}</span>
                                </div>
                            </div>
                        </div>
                        <div css={playerUiMain}>
                            <div css={playerUiStats}>
                                {Object.entries(groupedStats).map(([section, stats]) => (
                                    <div key={section} css={statGroup}>
                                        <h3 css={statGroupTitle}>
                                            {translationsMap?.[section]?.[language]}
                                        </h3>
                                        {stats.map(([label, value], i) => (
                                            <span key={i} css={statLine}>
                                                {label}: {value}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : null

        );
    };


    const playersInMatch = [...Object.entries(match.lineup.home.players), ...Object.entries(match.lineup.away.players)]

    const [visible, setVisible] = useState(false);
    const [playerData, setPlayerData] = useState(null);
    const [playerStats, setPlayerStats] = useState(null);
    useEffect(() => {
        const handleHashChange = async () => {
            const hash = window.location.hash;
            const playerId = Number(new URLSearchParams(hash.slice(1)).get("player"));

            if (playerId) {
                try {
                    const res = await fetch(`/api/playersShort/${playerId}`);
                    const data = await res.json();
                    setPlayerData(data);
                    setPlayerStats(playersInMatch.find(p => Number(p[0]) === playerId));
                    setVisible(true);
                    document.body.classList.add("no-scroll");
                } catch (err) {
                    console.error("Error fetching player data", err);
                }
            } else {
                setVisible(false);
                setPlayerData(null);
                setPlayerStats(null);
                document.body.classList.remove("no-scroll");
            }
        };

        const handleClickOutside = (e) => {
            if (
                !e.target.closest('.player-ui') &&
                !e.target.closest('.player') // assumes clickable players have this class
            ) {
                setVisible(false);
                setPlayerData(null);
                setPlayerStats(null);
                document.body.classList.remove("no-scroll");
                window.location.hash = '';
            }
        };

        handleHashChange(); // run once on load
        window.addEventListener('hashchange', handleHashChange);
        document.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            document.removeEventListener('click', handleClickOutside);
            document.body.classList.remove("no-scroll");
        };
    }, []);

    return (
        <div>
            <div css={matchContent}>
                <div css={matchContentWrapper}>
                    {renderLineupContent()}
                </div>
            </div>
            <PlayerStatsDisplay
                groupedStats={generateGroupedStats(playerStats)}
            />
        </div>
    )
}