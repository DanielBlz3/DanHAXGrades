'use client';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations.js';
import React from "react";
import '/styles/global.css';
export default function MatchPageClient({ match }) {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme') || 'theme-light';
            const storedLang = localStorage.getItem('language') || 'es';
            setTheme(storedTheme);
            setLanguage(storedLang);
        }
    }, []);

    return (
        <div>
            
        </div>
    );
}
