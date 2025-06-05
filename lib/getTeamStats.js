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

        var scorelineParts = focusedMatch.scoreline.split("-");
                matchStats.matches = [1, 1];
        matchStats.goals = [Number(scorelineParts[0]), Number(scorelineParts[1])];
        for (let stat of selectedTeamTotalStats) {
            matchStats[stat] = [
                findTotalStats(focusedMatch.playerslist.homeplayers, stat),
                findTotalStats(focusedMatch.playerslist.awayplayers, stat)
            ];
        }

        const homeStats = Object.fromEntries(
            Object.entries(matchStats).map(([key, value]) => [key, value[0]])
        );
        const awayStats = Object.fromEntries(
            Object.entries(matchStats).map(([key, value]) => [key, value[1]])
        );

        const homeId = focusedMatch.teamIds[0];
        const awayId = focusedMatch.teamIds[1];

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

    //=================================| GETTING EXANON TOTALS |=================================

    const selectedTotalStats = ["goals", "shots", "bcm", "touches", "ownGoals", "keyPasses", "defensiveActions", "bigErrors", "duelsWon", "duelsLost", "passesC", "matches",];
    let exanonTotal = {}
    function findTotalExanonStats(stat) {
        const exanonTotalArr = Object.entries(teamStatsRaw).map(i => i[1].for)
        return exanonTotalArr.reduce((sum, player) => sum + (player[stat] || 0), 0)
    }
    for (let stat of selectedTotalStats) {
        exanonTotal[stat] = findTotalExanonStats(stat)
    }

    //=================================| GETTING EXANON AVERAGES |=================================

    const selectedAvgStats = ["goals", "shots", "bcm", "touches", "ownGoals", "keyPasses", "defensiveActions", "bigErrors", "duelsWon", "duelsLost", "passesC"];
    let exanonAverage = {}
    function findAverageExanonStats(stat) {
        return exanonTotal[stat] / exanonTotal.matches
    }
    for (let stat of selectedAvgStats) {
        exanonAverage[stat] = findAverageExanonStats(stat)
    }

    function findAverageExanonStatsPercetages(successful, unsuccessful) {
        return exanonTotal[successful] / (exanonTotal[successful] + exanonTotal[unsuccessful])
    }
    const selectedPercentageStats = [{ key: "bigChanceConversion", successful: "goals", unsuccessful: "bcm" }, { key: "duelsPercentage", successful: "duelsWon", unsuccessful: "duelsLost" }]
    for (let stat of selectedPercentageStats) {
        exanonAverage[stat.key] = findAverageExanonStatsPercetages(stat.successful, stat.unsuccessful)
    }

    //=================================| GETTING TEAM STRENGTHS AND WEAKNESESS |=================================

    function getExanonStrengths(team) {
        const strengthsMap = [
            {
                key: "goals",
                statKey: "goals",
                indicies: [1, 0.5, -0.5, -1],
                forAgainst: "for",
                reverse: false,
                isPercentage: false,
                successful: false,
                unsuccessful: false,
            },
            {
                key: "defense",
                statKey: "goals",
                indicies: [1, 0.5, -0.5, -1],
                forAgainst: "against",
                reverse: true,
                isPercentage: false,
                successful: false,
                unsuccessful: false,
            },
            {
                key: "shotFrequency",
                statKey: "shots",
                indicies: [3, 1.5, -1.5, 3],
                forAgainst: "for",
                reverse: false,
                isPercentage: false,
                successful: false,
                unsuccessful: false,
            },
            {
                key: "keyPasses",
                statKey: "keyPasses",
                indicies: [3, 1.5, -1.5, 3],
                forAgainst: "for",
                reverse: false,
                isPercentage: false,
                successful: false,
                unsuccessful: false,
            },
            {
                key: "keyPassesAllowed",
                statKey: "keyPasses",
                indicies: [3, 1.5, -1.5, 3],
                forAgainst: "against",
                reverse: true,
                isPercentage: false,
                successful: false,
                unsuccessful: false,
            },
            {
                key: "passesC",
                statKey: "passesC",
                indicies: [20, 10, -10, -20],
                forAgainst: "for",
                reverse: false,
                isPercentage: false,
                successful: false,
                unsuccessful: false,
            },
            {
                key: "forcingErrors",
                statKey: "bigErrors",
                indicies: [0.25, 0.125, -0.125, -0.25],
                forAgainst: "against",
                reverse: false,
                isPercentage: false,
                successful: false,
                unsuccessful: false,
            },
            {
                key: "errorProneness",
                statKey: "bigErrors",
                indicies: [0.25, 0.125, -0.125, -0.25],
                forAgainst: "for",
                reverse: true,
                isPercentage: false,
                successful: false,
                unsuccessful: false,
            },
            {
                key: "bigChanceConversion",
                statKey: "bigChanceConversion",
                indicies: [0.25, 0.125, -0.125, -0.25],
                forAgainst: "for",
                reverse: false,
                isPercentage: true,
                successful: "goals",
                unsuccessful: "bcm",
            },
            {
                key: "duelsPercentage",
                statKey: "duelsPercentage",
                indicies: [.075, .0375, -.0375, -.05],
                forAgainst: "for",
                reverse: false,
                isPercentage: true,
                successful: "duelsWon",
                unsuccessful: "duelsLost",
            },
        ]

        function getTeamStrengths(stat, indicies, forAgainst, reverse = false, isPercentage = false, successful = false, unsuccessful = false) {
            const val = isPercentage ? teamStatsRaw[team][forAgainst][successful] / (teamStatsRaw[team][forAgainst][successful] + teamStatsRaw[team][forAgainst][unsuccessful]) : (teamStatsRaw[team][forAgainst][stat] / teamStatsRaw[team][forAgainst].matches)
            const difference = val - exanonAverage[stat]
            const newVale = reverse ? -difference : difference;
            return newVale > indicies[0] ? "veryStrong" : newVale > indicies[1] ? "strong" : newVale > indicies[2] ? "average" : newVale > indicies[3] ? "weak" : "veryWeak"
        }

        teamStatsRaw[team].strengths = {};
        for (const { key, statKey, indicies, forAgainst, reverse, isPercentage, successful, unsuccessful } of strengthsMap) {
            const strength = getTeamStrengths(statKey, indicies, forAgainst, reverse, isPercentage, successful, unsuccessful)
            teamStatsRaw[team].strengths[key] = strength
        }
    }
    for (const [teamId, stats] of Object.entries(teamStatsRaw)) {
        getExanonStrengths(teamId)
    }

    return teamStatsRaw
}

export default getTeamStats