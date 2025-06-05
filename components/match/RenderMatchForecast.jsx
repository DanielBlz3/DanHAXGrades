'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations';
import '/styles/global.css';

const RenderForecast = ({ teams, teamStats }) => {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage);
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, []);

    const forecastItem = css`
        display: flex;
    flex-flow: row;
    height: 2.5rem;
    border-top: 1px solid var(--primary-divider-bg);
    width: 100%;
    align-items: center;
        justify-content: flex-end;
        padding: .5rem;
        border-radius: .5rem;
    `;

    const matchForecastHeader = css`
        display: flex;
          justify-content: center;
      align-items: center;
      height: 4rem;
        `;

    const forecastTitle = css`
        flex: 1;
    color: var(--GLOBAL-FONT-COLOR-GREY);
    font-weight: bold;
    `;

    const forecastStats = [
        {
            key: "goals_Forecast",
            forStat: "goals",
            againstStat: "defense"

        },
        {
            key: "keyPasses_Forecast",
            forStat: "keyPasses",
            againstStat: "keyPassesAllowed"
        },
        {
            key: "shotsOnTarget_Forecast",
            forStat: "shotFrequency",
            againstStat: "defense"
        },
        {
            key: "errors_Forecast",
            forStat: "forcingErrors",
            againstStat: "errorProneness"
        },
        {
            key: "duelWinning_Forecast",
            forStat: "duelsPercentage",
            againstStat: "duelsPercentage"
        },
        {
            key: "control_Forecast",
            forStat: "duelsPercentage",
            againstStat: "duelsPercentage"
        },
    ]

    function getForecastDetails(home, away) {
        const forecast = []
        function getForecastStats(key, forStat, againstStat) {
            const veryStrong = "veryStrong"
            const strong = "strong"
            const average = "average"
            const weak = "weak"
            const veryWeak = "veryWeak"
            var probability
            if ([veryStrong].includes(home[forStat]) && [veryWeak, weak, average].includes(away[againstStat])) {
                probability = { team: "home", key: key, likeliness: "veryLikely" }
            } else if ([strong].includes(home[forStat]) && [veryWeak, weak].includes(away[againstStat])) {
                probability = { team: "home", key: key, likeliness: "likely" }
            } else if ([average].includes(home[forStat]) && [veryStrong].includes(away[againstStat])) {
                probability = { team: "away", key: key, likeliness: "likely" }
            } else if ([veryWeak, weak].includes(home[againstStat]) && [veryStrong].includes(away[forStat])) {
                probability = { team: "away", key: key, likeliness: "veryLikely" }
            } else if ([veryWeak, weak].includes(home[againstStat]) && [strong].includes(away[forStat])) {
                probability = { team: "away", key: key, likeliness: "likely" }
            } else if ([average].includes(home[againstStat]) && [veryStrong].includes(away[forStat])) {
                probability = { team: "away", key: key, likeliness: "likely" }
            }
            return probability || { key, likeliness: "common" };
        }

        for (const { key, forStat, againstStat } of forecastStats) {
            forecast.push(getForecastStats(key, forStat, againstStat))
        }
        return forecast
    }
    const forecast = getForecastDetails(teamStats?.[String(teams.home.id)].strengths, teamStats?.[String(teams.away.id)].strengths)
    console.log(forecast)
    const likelyForecast = forecast.filter(f => ["veryLikely", "likely"].includes(f.likeliness))
    const likelyForecastSorted = likelyForecast.sort((a, b) => {
        if (a.likeliness === 'veryLikely' && b.likeliness !== 'veryLikely') return -1;
        if (a.likeliness !== 'veryLikely' && b.likeliness === 'veryLikely') return 1;
        return 0;
    });

    const ForecastContent = () => {
        const forecastItems = likelyForecastSorted?.map(i => {
            const forecastBackground = i.likeliness === "veryLikely" ? 'var(--RATING-BLUE)' : "var(--RATING-GREEN)"

            const forecastValue = css`
    justify-self: flex-end;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    height: 1.5rem;
    padding-inline: .2rem;
        background-color: ${forecastBackground};
    `;

            return (
                <div
                    key={i[0]}
                    css={forecastItem}
                    className="secondary-hover"
                >
                    <span css={forecastTitle}>
                        {`${teams[i.team].name} ${translationsMap?.[i.key]?.[language]}`}
                    </span>
                    <span css={forecastValue}>
                        {`${translationsMap?.[i.likeliness]?.[language]}`}
                    </span>
                </div>
            )
        })
        return (
            <>
                <div css={matchForecastHeader}>
                    <h2>{translationsMap?.["forecast"]?.[language]}</h2>
                </div>
                {forecastItems}
            </>
        )
    }
    return (
        <ForecastContent />
    )
}


export default RenderForecast