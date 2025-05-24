'use client'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '../../../styles/global.css';

const res = await fetch('http://localhost:3002/api/leagues', { cache: 'no-store' });
const data = await res.json();

console.log()
export default function PlayerPage({ params }) {

  const playerHeader = css`
    display: "flex";
    flex-flow: "column";
    width: "100%";
  `
  const playerCard = css`
  background-color: teamColor;
            border-radius: "1em 1em 0 0";
            padding: "1rem";
      max-width: "100%";
    color: teamFontColor;
    margin: 0;
  `;
  const cardWrapper = css`
  display: "flex";
            flex-flow: "row nowrap";
            gap: "10px";
            align-items: "bottom";
  `;
  const cardContent = css`
  display: "flex";
            flex-direction: "column";
  `;
  const cardName = css`
      align-content: "center";
  `;
  const cardTeam = css`
  flex-direction: "row";
            display: "flex";
            justify-content: "left";
            gap: "8px";
            color: teamFontColor;
  `
  const teamLink = css`
  color: teamFontColor;
  `
  const cardLogo = css`
  display: inline;
  `
  return (
    <div css={playerHeader}>
      <div css={playerCard}>
        <div css={cardWrapper}>
          <div css={cardContent}>
            <div css={cardName}>
              <h2>Player</h2>
            </div>
            <div css={cardTeam}>
              <img css= {cardLogo}
                src="https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/logoless?v=1742054547120"
                alt="Arsenal F.C" width="20" height="20" />
              <a css={teamLink} href="">
                <span>Free Agent</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
