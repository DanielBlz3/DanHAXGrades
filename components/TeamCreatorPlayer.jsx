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
  background-color: rgba(0, 0, 0, 0);
  border: none;
  cursor: pointer;
`;

const playerWrapper = css`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 45px;
  width: 45px;
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

const TeamCreatorPlayer = ({ player, coords }) => {
console.log(coords)
  return (
    <button
      css={playerContainer}
      className="primary-hover player"
      style={{
        top: `${(100 - coords?.y * 2)}%`,
        left: `${coords?.x}%`,
        position: "absolute",
      }}
    >
      <div css={playerWrapper}>
        <img
          src="/images/defaulticon.png"
          width={32}
          height={32}
        />
      </div>
      <span css={[startingPlayerName, playerName]}>{player?.name}</span>
    </button>
  );
};

export default TeamCreatorPlayer;