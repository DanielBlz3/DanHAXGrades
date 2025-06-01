'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';

// Styles
const benchListItem = css`
  display: flex;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  border-bottom: 1px solid var(--divider-bg-secondary);
  width: 100%;
  height: 6rem;
`;

const playerContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3.5px;
  position: relative;
  height: 65px;
  width: 65px;
  text-decoration: none;
  color: var(--primary-font-color);
`;

const playerWrapper = css`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  max-height: 40px;
  min-height: 40px;
  max-width: 40px;
  min-width: 40px;
  border-radius: 50%;
  background-color: var(--primary-player-bg-color);
`;

const playerEvent = css`
  border: 1px solid var(--player-event-outline-color);
  background-color: var(--player-event-bg-color);
  border-radius: 50%;
  font-size: 0.8rem;
  position: absolute;
  display: flex;
  cursor: default;
`;

const playerName = css`
  width: 300%;
  text-align: center;
  cursor: default;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: inset;
  text-decoration: none;
`;

const benchPlayerName = css`
  color: var(--font-default-color);
  text-decoration: none;
`;

// Component
const Substitute = ({ player }) => {
    const PlayerEvent = ({ icon, count, leftOrRight, initialX, y, metric }) => {
        return [...Array(count)].map((_, i) => {
            const style = {
                bottom: `${y}%`,
                [leftOrRight]: `${initialX + -10 * i}px`,
                zIndex: 8 - i,
            };

            if (metric === "ownGoals") {
                style.filter = "hue-rotate(110deg) saturate(1)";
            }

            return (
                <div key={i} css={playerEvent} style={style}>
                    {icon}
                </div>
            );
        });
    };
    let ratingColor;
    if (player.isMvp) ratingColor = "var(--RATING-BLUE)";
    else if (player.matchRating < 5.5) ratingColor = "var(--RATING-RED)";
    else if (player.matchRating < 6.949) ratingColor = "var(--RATING-ORANGE)";
    else ratingColor = "var(--RATING-GREEN)";

    const matchRatingOnPlayer = css`
    position: absolute;
    top: 0%;
    right: 25%;
    transform: translate(50%, -50%);
    background-color: ${ratingColor};
    color: white;
    font-weight: bold;
    font-size: 0.75rem;
    border-radius: 1rem;
    padding: 0.025rem 0.3rem;
    cursor: default;
  `;

    return (
        <li css={benchListItem}>
            <a href={`#player=${player.id}`} css={playerContainer} className="primary-hover">
                <div css={playerWrapper}>
                    <img
                        src="https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/noicon.png?v=1740716552808"
                        width={30}
                        height={30}
                        alt="player"
                    />
                    <span css={matchRatingOnPlayer}>{player.matchRatingRounded}</span>
                    <div data-events-player={player.id}>
                        <PlayerEvent icon="⚽" count={player.stats.goals} leftOrRight="right" initialX={5} y={27.5} metric="goals" />
                        <PlayerEvent icon="🅰️" count={player.stats.assists} leftOrRight="left" initialX={5} y={27.5} metric="assists" />
                        <PlayerEvent icon="⚽" count={player.stats.ownGoals} leftOrRight="right" initialX={5} y={27.5} metric="ownGoals" />
                    </div>
                </div>
                <span css={[benchPlayerName, playerName]}>{player.name}</span>
            </a>
        </li>
    );
};

export default Substitute;