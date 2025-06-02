async function getTeamStats(matches, teamData) {
    const selectedTeamTotalStats = [
        "shots",
        "bcm",
        "touches",
        "ownGoals",
        "keyPasses",
        "defensiveActions",
        "bigErrors",
        "duelsWon",
        "duelsLost",
        "passesC",
    ];

    const teamStatsRaw = {}
    const matchesFilter = matches.filter(m => m.playerslist.homeplayers.length && m.playerslist.awayplayers.length)
    for (let match = 0; match < matchesFilter.length; match++) {
        const focusedMatch = matchesFilter[match];

        function findTotalStats(team, stat) {
            return team.reduce((sum, player) => sum + (player[stat] || 0), 0);
        }

        const matchStats = {};
        for (let stat of selectedTeamTotalStats) {
            matchStats[stat] = [
                findTotalStats(focusedMatch.playerslist.homeplayers, stat),
                findTotalStats(focusedMatch.playerslist.awayplayers, stat)
            ];
        }
        var scorelineParts = focusedMatch.scoreline.split("-");
        matchStats.goals = [Number(scorelineParts[0]), Number(scorelineParts[1])];
        matchStats.matches = [1, 1];

        // Split into home and away stats
        const homeStats = Object.fromEntries(
            Object.entries(matchStats).map(([key, value]) => [key, value[0]])
        );
        const awayStats = Object.fromEntries(
            Object.entries(matchStats).map(([key, value]) => [key, value[1]])
        );

        const homeId = focusedMatch.teamIds[0];
        const awayId = focusedMatch.teamIds[1];

        // Helper to merge 'for' and 'against' objects
        function updateTeamStats(teamId, statsFor, statsAgainst) {
            if (!teamStatsRaw[teamId]) {
                teamStatsRaw[teamId] = { for: {}, against: {} };
            }

            Object.entries(statsFor).forEach(([key, val]) => {
                teamStatsRaw[teamId].for[key] = (teamStatsRaw[teamId].for[key] || 0) + val;
            });

            Object.entries(statsAgainst).forEach(([key, val]) => {
                teamStatsRaw[teamId].against[key] = (teamStatsRaw[teamId].against[key] || 0) + val;
            });
        }

        updateTeamStats(homeId, homeStats, awayStats);
        updateTeamStats(awayId, awayStats, homeStats);
    }

    const selectedTotalStats = ["goals","shots", "bcm", "touches", "ownGoals", "keyPasses", "defensiveActions", "bigErrors", "duelsWon", "duelsLost", "passesC", "matches",];
    let exanonTotal = {}
    function findTotalExanonStats(stat) {
        const exanonTotalArr = Object.entries(teamStatsRaw).map(i => i[1].for)
        return exanonTotalArr.reduce((sum, player) => sum + (player[stat] || 0), 0)
    }
    for (let stat of selectedTotalStats) {
        exanonTotal[stat] = findTotalExanonStats(stat)
    }

    const selectedAvgStats = ["goals", "shots", "bcm", "touches", "ownGoals", "keyPasses", "defensiveActions", "bigErrors", "duelsWon", "duelsLost", "passesC"];
    let exanonAverage = {}
    function findAverageExanonStats(stat) {
        return exanonTotal[stat] / exanonTotal.matches
    }
    for (let stat of selectedAvgStats) {
        exanonAverage[stat] = findAverageExanonStats(stat)
    }

    function getExanonStrengths(team) {
        const strengthsMap = [
            {
                key: "goals",
                indicies: [1, 0.5, -0.5, -1],
                forAgainst: "for",
            },
            {
                key: "shots",
                indicies: [3, 1.5, -1.5, 3],
                forAgainst: "for",
            },
            {
                key: "keyPasses",
                indicies: [3, 1.5, -1.5, 3],
                forAgainst: "for",
            },
            {
                key: "passesC",
                indicies: [20, 10, -10, -20],
                forAgainst: "for",
            },
            {
                key: "bcm",
                indicies: [0.5, 0.25, -0.25, -0.5],
                forAgainst: "for",
            },
            {
                key: "bigErrors",
                indicies: [-0.25, -0.125, 0.125, 0.25],
                forAgainst: "for",
            },
        ]

        function getTeamStrengths(stat, indicies, forAgainst) {
            const difference = ((teamStatsRaw[team].for[stat] / teamStatsRaw[team][forAgainst].matches) - exanonAverage[stat])
            return difference > indicies[0] ? "veryStrong" : difference > indicies[1] ? "strong" : difference > indicies[2] ? "average" : difference > indicies[3] ? "weak" : "veryWeak"
        }

        teamStatsRaw[team].strengths = {};
        for (const { key, indicies, forAgainst } of strengthsMap) {
            const strength = getTeamStrengths(key, indicies, forAgainst)
            teamStatsRaw[team].strengths[key] = strength
        }
    }
    for (const [teamId, stats] of Object.entries(teamStatsRaw)) {
        getExanonStrengths(teamId)
    }

    return [teamStatsRaw, exanonAverage]
}

export default getTeamStats