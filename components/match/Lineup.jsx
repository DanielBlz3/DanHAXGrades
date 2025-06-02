'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import '/styles/global.css';
import positionCoords from '/lib/posCoordsPlayerPosMap';
import SoccerField from '/components/pitchSVGHorizontal';
import Player from '/components/Player';
import SubstituteEl from '/components/Substitutes.jsx';

const renderLineupContent = ({ match, hasSubs, hasLineupInfo }) => {

    //===============================| STYLES |===============================

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

    //===============================| FUNCTION |===============================
    if (["FT", "Live", "AET"].includes(match.matchStatus.statusShort)) {
        const lineup = match.lineup
        const renderTeamInfo = () => {
            if (hasLineupInfo) {
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
            } else {
                return null
            }
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

            const RenderSubs = () => {
                if (hasSubs) {
                    const RenderSubstitutePlayers = ({ team, lineup }) => {
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
                    }
                    return (
                        <div css={substitutesContainer}>
                            <h2 css={substitutesTitle}>Substitutes</h2>
                            <div css={substitutesContent}>
                                <div>
                                    <RenderSubstitutePlayers team="home" lineup={lineup} />
                                </div>
                                <div>
                                    <RenderSubstitutePlayers team="away" lineup={lineup} />
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return null
                }
            }


            return (
                <div>
                    <div css={soccerFieldWrapper}>
                        <SoccerField
                            width={960}
                            height={600}
                            fillColor={"var(--soccer-field-bg-color-primary)"}
                            strokeColor={"var(--soccer-field-stroke)"}
                        />
                        <LineupField team="home" />
                        <LineupField team="away" />
                    </div>
                    <RenderSubs/>
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

/*
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
*/
export default renderLineupContent