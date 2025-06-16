'use client';
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from '@emotion/react';
import { translationsMap } from '/lib/translations';

import '/styles/global.css';

const MatchTimeline = ({ match }) => {
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

    const timelineCard = css`
        display: flex;
        flex-flow: column;
        background-color: var(--card-bg-main);
        border-radius: 1.25rem;
        padding-inline: 2rem;
        justify-content: center;
        align-items: center;
    `;

    const topStatsTitle = css`
        display: flex;
        height: 5rem;
        justify-content: center;
        align-items: center;
    `;

    const timelineContentCSS = css`
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        width: 90%;
        margin-bottom: 1rem;
        gap: 2rem;
    `;

    const goalCard = css`
        display: flex;
        flex-flow: column;
        border-radius: 1.25rem;
        width: 20rem;
    `;

    const minutesCSS = css`
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--card-bg-second);
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        font-weight: bold;
    `;

    const goalMain = css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 4rem;
        background-color: var(--card-bg-second);
        border-radius: 0 0 1.25rem 1.25rem;
    `;

    const goalMainWrapper = css`
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        width: 90%;
        gap: 0.5rem;
    `;

    const goalScorer = css`
        color: var(--primary-font-color);
        text-decoration: none;
    `;

    const assister = css`
        color: var(--GLOBAL-FONT-COLOR-GREY);
        text-decoration: none;
    `;

    const RenderTimelineItems = ({ timeline }) => {
        const timelineContent = timeline.map(ti => {
            const [team, rowFlow] = ti.team === 'home' ? ['home', 'row-reverse'] : ['away', 'row']
            let timelineItem;

            const timelineItemCss = css`
        display: grid;
        grid-template-columns: 4.5fr 1fr 4.5fr;
        justify-items: center;
        align-items: center;
        width: 100%;
        gap: 1rem;

        @media (max-width: 960px) {
        display: flex;
        flex-flow: ${rowFlow};
        justify-content: center;
        }
    `;

            if (ti.type === "goal") {
                const goalHeader = css`
                    display: flex;
                    height: 2rem;
                    justify-content: center;
                    align-items: center;
                    background-color: var(--${team}-bg-color);
                    color: var(--${team}-font-color);
                    border-radius: 1.25rem 1.25rem 0 0;
                `;

                timelineItem = (
                    <div css={goalCard}>
                        <header css={goalHeader}>
                            <h3>{ti.goalType === 'ownGoal' ? `${translationsMap?.["ownGoal"]?.[language]} !!!` : `${translationsMap?.["goal"]?.[language]} !!!`}</h3>
                        </header>
                        <div css={goalMain}>
                            <div css={goalMainWrapper}>
                                <a css={goalScorer} href={ti.goalscorerPageUrl} className="third-hover">
                                    {`${translationsMap?.["goalScorer"]?.[language]}: ${ti.goalscorerName || ""}`}
                                </a>
                                <a css={assister} href={ti.assisterPageUrl} className="third-hover">
                                    {`${translationsMap?.["assister"]?.[language]}: ${ti.assisterName || translationsMap?.["none_Stat"]?.[language]}`}
                                </a>
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div css={[timelineItemCss,]}>
                    <div>
                        {team === "home" ? timelineItem : null}
                    </div>
                    <span css={minutesCSS}>{`${ti.minute}'`}</span>
                    <div>
                        {team === "away" ? timelineItem : null}
                    </div>
                </div>
            );
        });

        return <>{timelineContent}</>;
    };

    return (
        <div css={timelineCard}>
            <header css={topStatsTitle}>
                <h2>{translationsMap?.["timeline"]?.[language]}</h2>
            </header>
            <div css={timelineContentCSS}>
                <RenderTimelineItems timeline={match.timeline} />
            </div>
        </div>
    );
};

export default MatchTimeline;
