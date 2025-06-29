'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { translationsMap } from '/lib/translations';

import '/styles/global.css';

const RenderMatchStats = ({ match, visible, acceptedStats }) => {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedLanguage);
        const updateThemeColors = () => {
            const storedTheme = localStorage.getItem('theme') || 'theme-light';
            setTheme(storedTheme);

            const root = document.documentElement;
            if (storedTheme === 'theme-light') {
                root.style.setProperty('--home-bg-color', match.general.home.bgLightTheme);
                root.style.setProperty('--home-font-color', match.general.home.fontColorLightTheme);
                root.style.setProperty('--away-bg-color', match.general.away.bgLightTheme);
                root.style.setProperty('--away-font-color', match.general.away.fontColorLightTheme);
            } else {
                root.style.setProperty('--home-bg-color', match.general.home.bgDarkTheme);
                root.style.setProperty('--home-font-color', match.general.home.fontColorDarkTheme);
                root.style.setProperty('--away-bg-color', match.general.away.bgDarkTheme);
                root.style.setProperty('--away-font-color', match.general.away.fontColorDarkTheme);
            }
        };

        updateThemeColors();

        window.addEventListener('themechange', updateThemeColors);

        return () => {
            window.removeEventListener('themechange', updateThemeColors);
        };
    }, [match]);


    const topStatsCard = css`
    background-color: var(--primary-card-bg);
  border-radius: 1.25rem;
  padding-inline: 2rem;
    `

    const topStatsTitle = css`
    display: flex;
      height: 5rem;
      justify-content: center;
      align-items: center;
    `

    const topStatsItem = css`
     display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  justify-items: center;
  align-items: center;
  height: 4rem;
    `;

    const topStatsValue = css`
    border-radius: 1rem;
  padding-inline: .5vw;
  text-align: center;
  text-align: middle;
    `;

    if (visible) {
        const RenderMetrics = () => {
            const filteredStats = match.topStats.filter(stat => acceptedStats.includes(stat.key));
            const metricEl = filteredStats.map(s => {
                const [homeValueBgColor, homeValueFontColor] = s.highlighted === 0 ? ["var(--home-bg-color)", "var(--home-font-color)"] : ["rgba(0, 0, 0, 0)", "var(--primary-font-color)"]
                const [awayValueBgColor, awayValueFontColor] = s.highlighted === 1 ? ["var(--away-bg-color)", "var(--away-font-color)"] : ["rgba(0, 0, 0, 0)", "var(--primary-font-color)"]
                const hasPercentage = s.type === "percentage" ? '%' : "" 
                
                return (
                    <li
                        key={s.key}
                        css={topStatsItem}
                    >
                        <span
                            css={[
                                topStatsValue,
                                css`
                            background-color: ${homeValueBgColor};
      color: ${homeValueFontColor};
    `
                            ]}
                        >
                            {`${s.stats[0]}${hasPercentage}`}
                        </span>
                        <span>{translationsMap?.[s.key]?.[language]}</span>
                        <span
                            css={[
                                topStatsValue,
                                css`
                            background-color: ${awayValueBgColor};
      color: ${awayValueFontColor};
    `
                            ]}
                        > {`${s.stats[1]}${hasPercentage}`} </span>
                    </li>
                )
            })
            return (
                <>
                    {metricEl}
                </>
            )
        }
        return (
            <div css={topStatsCard}>
                <h2 css={topStatsTitle}>{translationsMap?.["topStats"]?.[language]}</h2>
                <ul>
                    <RenderMetrics />
                </ul>
            </div>
        )
    } else {
        return null
    }
}

export default RenderMatchStats