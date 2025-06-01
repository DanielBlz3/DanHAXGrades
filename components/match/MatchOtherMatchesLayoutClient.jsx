'use client';
import Link from 'next/link';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { translationsMap } from '/lib/translations';
import formatMatchTimestamp from '/lib/timeFormatter';
import '/styles/global.css';

export default function Layout({ match, children }) {
    const [language, setLanguage] = useState('es');

    return (
        <div></div>
    )
}