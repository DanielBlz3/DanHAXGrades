'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';

const playerContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3.5px;
  position: absolute;
  height: 65px;
  width: 65px;
  transform: translate(-50%, -50%);
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

const playerName = css`
  width: 300%;
  text-align: center;
  cursor: default;
  font-size: 0.8rem;
  font-weight: bold;
  text-decoration: none;
`;

const startingPlayerName = css`
  color: var(--GLOBAL-FONT-COLOR-WHITE);
`;

const playerClub = css`
position: absolute;
right: 8px;
bottom: 22px;
`

const avatar = css`
border-radius: 50%;
`

const PlayerTotw = ({ player }) => {
  const coords = { x: player?.coords.x, y: player?.coords.y };

  let ratingColor;
  if (player?.isMvp) ratingColor = "var(--RATING-BLUE)";
  else if (player?.matchRating < 5.5) ratingColor = "var(--RATING-RED)";
  else if (player?.matchRating < 6.949) ratingColor = "var(--RATING-ORANGE)";
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
    <a
      href= {'/players/' + player?.playerId}
      css={playerContainer}
      className="primary-hover player"
      style={{
        top: `${coords.y}%`,
        left: `${coords.x}%`,
        position: "absolute",
      }}
    >
      <div css={playerWrapper}>
        <img css={avatar}
          src={player.avatar}
          width={40}
          height={40}
        />
        <span css={matchRatingOnPlayer}>{player?.matchRating.toFixed(1)}</span>
        <img src={player?.teamLogo} width={15} height={15} css={playerClub}/>
      </div>
      <span css={[startingPlayerName, playerName]}>{player?.playerName}</span>
    </a>
  );
};

export default PlayerTotw;