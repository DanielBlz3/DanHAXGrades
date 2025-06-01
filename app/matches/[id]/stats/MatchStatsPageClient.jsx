'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { translationsMap } from '/lib/translations.js';
import formatMatchTimestamp from '/lib/timeFormatter.js';
import '/styles/global.css';
import positionCoords from '/lib/posCoordsPlayerPosMap.json';
import SoccerField from '/components/pitchSVGVertical.jsx';

function isDark(rgbString) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = rgb;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness < 50;
}
function isLight(rgbString) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = rgb;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness >= 200;
}

export default function MatchStatsPageClient({ match }) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'lineup';
    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');

    return (
        <div>
        </div>
    );
}