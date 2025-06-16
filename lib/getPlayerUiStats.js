import { translationsMap } from '/lib/translations';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function getPlayerUiStats(s) {
    const [language, setLanguage] = useState('es');
    useEffect(() => {
        const storedlanguage = localStorage.getItem('language') || 'es';
        setLanguage(storedlanguage)
    })

    const stats = s?.["1"].stats
    const isGoalkeeper = s?.["1"].isGoalkeeper
    const chancesCreated = stats?.keyPasses + stats?.assists;

    if (isGoalkeeper) {
        return {
            stats: [[translationsMap?.["minutes"]?.[language], stats?.minutes]],
            distribution: [
                [translationsMap?.["touches"]?.[language], stats?.touches],
                [translationsMap?.["passingA"]?.[language], stats?.passingA]
            ],
            gkStats: [
                ...(stats?.bigErrors ? [[translationsMap?.["bigErrors"]?.[language], stats?.bigErrors]] : []),
                ...(stats?.ownGoals ? [[translationsMap?.["ownGoals"]?.[language], stats?.ownGoals]] : []),
                [translationsMap?.["saves"]?.[language], stats?.saves],
                [translationsMap?.["goalsConceded"]?.[language], stats?.goalsConceded],
                [translationsMap?.["actedAsSweeper"]?.[language], stats?.actedAsSweeper],
                [translationsMap?.["gkRecovery"]?.[language], stats?.gkRecovery],
                [translationsMap?.["gkPunches"]?.[language], stats?.gkPunches],
                ...(stats?.errors ? [[translationsMap?.["errors"]?.[language], stats?.errors]] : []),
            ]
        };
    } else {
        return {
            stats: [[translationsMap?.["minutes"]?.[language], stats?.minutes]],
            shooting: [
                [translationsMap?.["goals"]?.[language], stats?.goals],
                [translationsMap?.["shots"]?.[language], stats?.shots],
                ...(stats?.bcm ? [[translationsMap?.["bcm"]?.[language], stats?.bcm]] : []),
            ],
            passing: [
                [translationsMap?.["passingA"]?.[language], stats?.passingA],
                [translationsMap?.["assists"]?.[language], stats?.assists],
                [translationsMap?.["chancesCreated"]?.[language], chancesCreated]
            ],
            possession: [[translationsMap?.["touches"]?.[language], stats?.touches]],
            defense: [
                ...(stats?.bigErrors ? [[translationsMap?.["bigErrors"]?.[language], stats?.bigErrors]] : []),
                ...(stats?.ownGoals ? [[translationsMap?.["ownGoals"]?.[language], stats?.ownGoals]] : []),
                ...(stats?.lastManTackles ? [[translationsMap?.["lastManTackles"]?.[language], stats?.lastManTackles]] : []),
                ...(stats?.clearancesOffTheLine ? [[translationsMap?.["clearancesOffTheLine"]?.[language], stats?.clearancesOffTheLine]] : []),
                [translationsMap?.["defensiveActions"]?.[language], stats?.defensiveActions],
                ...(stats?.errors ? [[translationsMap?.["errors"]?.[language], stats?.errors]] : []),
                [translationsMap?.["duelsWon"]?.[language], stats?.duelsWon],
                [translationsMap?.["duelsLost"]?.[language], stats?.duelsLost],
                [translationsMap?.["duelsP"]?.[language], stats?.duelsP],
            ]
        };
    }
}

export default getPlayerUiStats