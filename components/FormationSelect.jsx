import { useEffect, useState } from 'react';
import { translationsMap } from '/lib/translations.js';
import formations from '/lib/formations';

export default function FormationSelect() {

    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setTheme(storedTheme);
    }, []);

    const [selectedFormation, setSelectedFormation] = useState('fourthreethree');

    const handleChange = (e) => {
        setSelectedFormation(e.target.value);
    };

    console.log(Object.entries(formations))
    const RenderSelectItems = () => {
        const content = Object.entries(formations).map(f => {
            const formationInfo = f[1]
            return (
                <option 
                key = {f[0]}
                value={formationInfo.coords}>{f[0]}</option>
            )
        })
        return (
            content
        )
    }

    return (
        <>
            <span>{`${translationsMap?.["formation"]?.[language]}:`} </span>
            <select value={selectedFormation} onChange={handleChange}>
                <RenderSelectItems/>
            </select>
        </>
    );
}