'use client';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '../styles/global.css';
import Link from 'next/link';

export default function Error({ error, reset }) {
  const mainPageLink = css`
    display: flex;
    width: 120px;
    height: 50px;
    color: white;
    text-decoration: none;
    background-color: rgb(46, 204, 113);
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
      <p>Page was not found '-'</p>
      <br />
      <Link css={mainPageLink} href="/">Lets Revive!</Link>
    </div>
  );
}
