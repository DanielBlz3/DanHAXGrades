'use client';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '../styles/global.css';

export default function Error({ error, reset }) {
  const mainPageLink = css`
    color: var(--primary-font-color);
    text-decoration: none;
    background-color: rgb(46, 204, 113);
    display: flex;
    width: 120px;
    height: 50px;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    font-weight: bold;
  `;
  const errorWrapper = css`
    padding: 2rem;
    color: var(--primary-font-color)
  `;

  return (
    <div css={errorWrapper}>
      <h1>Oh Dear!!</h1>
      <br />
      <p>404 Error</p>
      <br />
      <a css={mainPageLink} href="/">Lets Revive!</a>
    </div>
  );
}
