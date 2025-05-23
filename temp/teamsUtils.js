const fetch = require('node-fetch');

async function getTeamData(teamId, leagueData, transfersData, playerData, nationsData) {
    const leagueStatsUrl = `https://danhaxgrades.glitch.me/api/leagueStats`;
    const playerPosUrl = 'http://danhaxgrades.glitch.me/api/allPlayerPos';
    const transfersUrl = `https://danhaxgrades.glitch.me/api/exanontransfers`

    try {
        const resLeagueStats = await fetch(leagueStatsUrl);
        if (!resLeagueStats.ok) {
            const errorText = await resLeagueStats.text();
            console.error(`Error fetching league table: ${resLeagueStats.status} - ${errorText}`);
            throw new Error(`HTTP error (table)! status: ${resLeagueStats.status}`);
        }
        const exanonStatsData = await resLeagueStats.json();

        const resPlayerPos = await fetch(playerPosUrl);
        if (!resPlayerPos.ok) {
            const errorText = await resPlayerPos.text();
            console.error(`Error fetching league table: ${resPlayerPos.status} - ${errorText}`);
            throw new Error(`HTTP error (table)! status: ${resPlayerPos.status}`);
        }
        const allPlayerPosData = await resPlayerPos.json();

        const resExanonTransfers = await fetch(transfersUrl);
        if (!resExanonTransfers.ok) {
            const errorText = await resExanonTransfers.text();
            console.error(`Error fetching league table: ${resExanonTransfers.status} - ${errorText}`);
            throw new Error(`HTTP error (table)! status: ${resExanonTransfers.status}`);
        }
        const exanonTransfersData = await resExanonTransfers.json();

        function getTeamDetails() {
            function isDark(rgbString, threshold) {
                const rgb = rgbString.match(/\d+/g).map(Number);
                const [r, g, b] = rgb;
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                return brightness < threshold;
            }
            const team = leagueData.teams.find(teams => teams.teamId === teamId)
            if (!team) {
                console.error(`NO TEAM WITH TEAMID: "${teamId}" FOUND`)
            } else {
                    const bgLightTheme = team.color
                    const bgDarkTheme = isDark(bgLightTheme, 50) ? "rgb(255, 255, 255)" : team.color
                var teamInfo = {
                    teamDetails: {
                        id: teamId,
                        name: team.teamname,
                        shortName: team.teamname,
                        bgLightTheme: bgLightTheme,
                        bgDarkTheme: bgDarkTheme,
                        fontColorLightTheme: isDark(bgLightTheme, 163) ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
                        fontColorDarkTheme: isDark(bgDarkTheme, 163) ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
                        logo: team.logo,
                        currentLeagues: team.currentLeagues,
                        mainLeague: team.currentLeagues[0],
                    },
                    teamDesc: team.teamdescription,
                    history: {
                        trophies: team.trophieswon,
                        finishes: team.previoustablefinishes,
                    }
                }
            }
            return teamInfo
        }
        const teamDetails = getTeamDetails().teamDetails
        const teamDescription = getTeamDetails().teamDesc
        const teamHistory = getTeamDetails().history
        const mainLeague = teamDetails.mainLeague

        function findLeague(leagueId) {
            for (const key in leagueData) {
                if (leagueData[key].leagueDesc) {
                    if (leagueData[key].leagueDesc.leagueId === leagueId) {
                        const leagueInfo = leagueData[key].leagueDesc
                        return {
                            logo: leagueInfo.logo,
                            name: leagueInfo.leaguename,
                            shortName: leagueInfo.leagueabbr,
                        }
                    }
                }
            }
            return {}
        }

        const leagueInfoObj = {}
        for (let i = 0; i < teamDetails.currentLeagues.length; i++) {
            leagueInfoObj[teamDetails.currentLeagues[i]] = findLeague(teamDetails.currentLeagues[i])
        }

        async function getTeamFixtures(teamnName) {
            let allFixtures = [];

            for (let i = 0; i < teamDetails.currentLeagues.length; i++) {
                const leagueId = teamDetails.currentLeagues[i]
                const fixturesUrl = `https://danhaxgrades.glitch.me/api/leagueFixtures/${leagueId}`;
                const resFixturesStatus = await fetch(fixturesUrl);

                if (!resFixturesStatus.ok) {
                    const errorText = await resFixturesStatus.text();
                    console.error(`Error fetching league table: ${resFixturesStatus.status} - ${errorText}`);
                    throw new Error(`HTTP error (table)! status: ${resFixturesStatus.status}`);
                }

                const fixturesData = await resFixturesStatus.json();
                const teamFixtures = fixturesData.filter(matches => [matches.home.teamName, matches.away.teamName].includes(teamnName))
                teamFixtures.forEach(
                    g => {
                        g.leagueId = leagueId
                        let teamSide;
                        if (g.home.teamName === teamnName) {
                            teamSide = g.home;
                            g.isHomeTeam = true;
                        } else {
                            teamSide = g.away;
                            g.isHomeTeam = false;
                        }
                        console.log(teamSide.teamName, teamnName)
                        const opponentTeamSide = g.home.teamName === teamnName ? g.away : g.home;
                        if (g.hasStarted) {
                            g.scoreStr = (g.home.score + " - " + g.away.score)
                            g.result = teamSide.score > opponentTeamSide.score ? "w" : teamSide.score == opponentTeamSide.score ? "d" : "l"
                        } else {
                            g.scoreStr = null
                            g.result = null
                        }
                    }
                )

                allFixtures.push(...teamFixtures); // Spread fixtures into array
            }
            return allFixtures
        }
        const teamFixtures = await getTeamFixtures(teamDetails.name)
        teamFixtures.sort((a, b) => {
            const getTime = (entry) => {
                if (!entry.timestamp || entry.timestamp.trim() === "") return null;
                const cleanTs = entry.timestamp.replace(/Z|[+-]\d{2}:\d{2}$/, '');
                const date = new Date(cleanTs);
                return isNaN(date.getTime()) ? null : date.getTime();
            };
            const timeA = getTime(a);
            const timeB = getTime(b);
            // If both have timestamps, sort by timestamp descending
            if (timeA !== null && timeB !== null) {
                return timeB - timeA;
            }
            // If only A has a timestamp, A comes first
            if (timeA !== null) return 1;
            // If only B has a timestamp, B comes first
            if (timeB !== null) return -1;
            // Neither have timestamps — keep their original order or use ID to keep it consistent
            return b.id - a.id;
        });

        async function getTeamTables() {
            let allTables = [];

            for (let i = 0; i < teamDetails.currentLeagues.length; i++) {
                const tablesURL = `https://danhaxgrades.glitch.me/api/leaguetable/${teamDetails.currentLeagues[i]}`;
                const resTablesStatus = await fetch(tablesURL);

                if (!resTablesStatus.ok) {
                    const errorText = await resTablesStatus.text();
                    console.error(`Error fetching league table: ${resTablesStatus.status} - ${errorText}`);
                    throw new Error(`HTTP error (table)! status: ${resTablesStatus.status}`);
                }

                const tableData = await resTablesStatus.json();

                allTables.push(tableData);
            }
            return allTables
        }
        const allTeamTables = await getTeamTables(teamDetails.name)

        function getTeamTransfers(teamId) {
            const teamTransfers = exanonTransfersData.filter(s => [s.to, s.from].includes(teamId))
            return teamTransfers
        }
        const teamTransfers = getTeamTransfers(teamId)

        function getPlayerStats() {
            let focusedPlayerStats
            let individualPlayerGameStatsPerId = []
            for (let i = 1; i < playerData.length; i++) {
                if (playerData[i].team == teamId) {
                    let playerTotalStats = {
                        appearances: 0,
                        minutes: 0,
                        playerId: 0,
                        leagueId: 0,
                        playerPosition: "",
                        matchRating: 0,
                        goals: 0,
                        shots: 0,
                        assists: 0,
                        secondassists: 0,
                        keyPasses: 0,
                        chancesCreated: 0,
                        defensiveActions: 0,
                        errors: 0,
                        bigErrors: 0,
                        ownGoals: 0,
                        bcm: 0,
                        duelsWon: 0,
                        duelsLost: 0,
                        passesC: 0,
                        touches: 0,
                        passingA: 0,
                        duelsP: 0,
                        saves: 0,
                        goalsConceded: 0,
                        gkSavePercentage: 0,
                        gkPunches: 0,
                        gkRecovery: 0,
                        actedAsSweeper: 0,
                        teamId: playerData[i].team || 0
                    };

                    focusedPlayerStats = exanonStatsData.filter(player => player.playerId === i);
                    if (focusedPlayerStats.length) {
                        for (const metric in playerTotalStats) {
                            if (!["playerPosition", "playerId", "passingA", "duelsP", "gkSavePercentage", "leagueId", "teamId"].includes(metric)) {
                                for (let eachGame = 0; eachGame < focusedPlayerStats.length; eachGame++) {
                                    if (metric === "matchRating") {
                                        playerTotalStats[metric] += (focusedPlayerStats[eachGame].matchRating)
                                    } else if (metric === "appearances") {
                                        playerTotalStats[metric] += 1;
                                    } else {
                                        playerTotalStats[metric] += Math.round(focusedPlayerStats[eachGame][metric]) || 0;
                                    }
                                }
                            } else if (metric === "passingA") {
                                playerTotalStats[metric] = (playerTotalStats.passesC / (playerTotalStats.passesC + playerTotalStats.touches - (playerTotalStats.passesC + playerTotalStats.shots + playerTotalStats.defensiveActions + playerTotalStats.ownGoals + playerTotalStats.bcm + playerTotalStats.duelsWon + playerTotalStats.duelsLost + playerTotalStats.ownGoals))) || 0;
                            } else if (metric === "duelsP") {
                                playerTotalStats[metric] = (playerTotalStats.duelsWon / (playerTotalStats.duelsWon + playerTotalStats.duelsLost)) || 0;
                            } else if (metric === "gkSavePercentage") {
                                playerTotalStats[metric] = (playerTotalStats.saves / (playerTotalStats.saves + playerTotalStats.goalsConceded)) || 0;
                            } else if (metric === "playerId") {
                                if (focusedPlayerStats.length && focusedPlayerStats[0].playerId === i) playerTotalStats[metric] = focusedPlayerStats[0].playerId;
                            } else if (metric === "leagueId") {
                                if (focusedPlayerStats.length) playerTotalStats[metric] = focusedPlayerStats[0].leagueId;
                            } else if (metric === "playerPosition") {
                                if (focusedPlayerStats.length > 0) {
                                    const focusedPlayerPositions = allPlayerPosData.find(p => p.playerId === i);
                                    if (focusedPlayerPositions) {
                                        const mainPosObj = focusedPlayerPositions.positions.find(pos => pos.isMainsPos) || {};
                                        playerTotalStats.playerPosition = mainPosObj.id || null;
                                    } else {
                                        console.warn(`No API data for playerId ${playerId}`);
                                    }
                                }

                            }
                        }
                        if (playerTotalStats) {
                            individualPlayerGameStatsPerId.push(playerTotalStats);
                        }
                    }
                }
            }

            function getTopPlayersByStat(data, statKey, topN = 3) {
                return data
                    .sort((a, b) => b[statKey] - a[statKey])
                    .slice(0, topN)
                    .map(player => ({
                        playerId: player.playerId,
                        playerName: playerData[player.playerId].playername,
                        value: player[statKey],
                        teamName: leagueData.teams.find(teams => teams.teamId === player.teamId).teamname,
                        teamLogo: leagueData.teams.find(teams => teams.teamId === player.teamId).logo,
                    }));
            }

            const topscorers = getTopPlayersByStat(individualPlayerGameStatsPerId, "goals");
            const topassisters = getTopPlayersByStat(individualPlayerGameStatsPerId, "assists");
            const topbcm = getTopPlayersByStat(individualPlayerGameStatsPerId, "bcm");
            const topchancesCreated = getTopPlayersByStat(individualPlayerGameStatsPerId, "chancesCreated");

            const topgoalandassisters = individualPlayerGameStatsPerId.sort((a, b) => (b.assists + b.goals) - (a.assists + a.goals)).slice(0, 3).map(player => ({
                playerId: player.playerId,
                playerName: playerData[player.playerId].playername,
                value: player.goals + player.assists,
                teamName: leagueData.teams.find(teams => teams.teamId === player.teamId).teamname,
                teamLogo: leagueData.teams.find(teams => teams.teamId === player.teamId).logo,
            }));

            const topPassingAccuracy = individualPlayerGameStatsPerId.filter(player => player.minutes >= 30).sort((a, b) => b.passingA - a.passingA).slice(0, 3).map(player => ({
                playerId: player.playerId,
                playerName: playerData[player.playerId].playername,
                value: `${Math.round(player.passingA * 1000) / 10}%`,
                teamName: leagueData.teams.find(teams => teams.teamId === player.teamId).teamname,
                teamLogo: leagueData.teams.find(teams => teams.teamId === player.teamId).logo,
            }));

            const topDuelsWonPercentage = individualPlayerGameStatsPerId.filter(player => player.duelsWon >= 3).sort((a, b) => b.duelsP - a.duelsP).slice(0, 3).map(player => ({
                playerId: player.playerId,
                playerName: playerData[player.playerId].playername,
                value: `${Math.round(player.duelsP * 1000) / 10}%`,
                teamName: leagueData.teams.find(teams => teams.teamId === player.teamId).teamname,
                teamLogo: leagueData.teams.find(teams => teams.teamId === player.teamId).logo,
            }));

            const topsavePercentage = individualPlayerGameStatsPerId.filter(player => player.saves >= 3).sort((a, b) => b.gkSavePercentage - a.gkSavePercentage).slice(0, 3).map(player => ({
                playerId: player.playerId,
                playerName: playerData[player.playerId].playername,
                value: `${Math.round(player.gkSavePercentage * 1000) / 10}%`,
                teamName: leagueData.teams.find(teams => teams.teamId === player.teamId).teamname,
                teamLogo: leagueData.teams.find(teams => teams.teamId === player.teamId).logo,
            }));

            var topStatsObj = {
                goals: [],
                assists: [],
                chancesCreated: [],
                passesC: [],
                touches: [],
                defensiveActions: [],
                duelsWon: [],
                saves: [],
                goalsConceded: [],
                gkRecovery: [],
                shots: [],
            }

            function statToPer20(metric) {
                individualPlayerGameStatsPerId.forEach(player => {
                    player[`${metric}Per20`] = Math.round((player[metric] / (player.minutes / 20)) * 100) / 100;
                });
                topStatsObj[metric] = individualPlayerGameStatsPerId.filter(player => player.minutes >= 30).sort((a, b) => b[`${metric}Per20`] - a[`${metric}Per20`]).slice(0, 3).map(player => ({
                    playerId: player.playerId,
                    playerName: playerData[player.playerId].playername,
                    value: Math.round((player[metric] / (player.minutes / 20)) * 100) / 100,
                    teamName: leagueData.teams.find(teams => teams.teamId === player.teamId).teamname,
                    teamLogo: leagueData.teams.find(teams => teams.teamId === player.teamId).logo,

                }))
            }
            statToPer20("goals")
            statToPer20("assists")
            statToPer20("chancesCreated")
            statToPer20("passesC")
            statToPer20("touches")
            statToPer20("defensiveActions")
            statToPer20("duelsWon")
            statToPer20("saves")
            statToPer20("goalsConceded")
            statToPer20("gkRecovery")
            statToPer20("shots")

            //ONLY PLAYERS WITH A CERTAIN AMONUT OF GAMES PLAYED OR MORE CAN ARE ALLOWED
            individualPlayerGameStatsPerId.forEach(player => {
                if (player.matchRating !== undefined && player.appearances) {
                    player.matchRating = Math.round((player.matchRating / player.appearances) * 100) / 100;
                }
            });
            var topmatchRatings = individualPlayerGameStatsPerId.filter(player => player.minutes >= 30)
                .sort((a, b) => b.matchRating - a.matchRating).slice(0, 3).map(player => ({
                    playerId: player.playerId,
                    playerName: playerData[player.playerId].playername,
                    value: player.matchRating,
                    teamName: leagueData.teams.find(teams => teams.teamId === player.teamId).teamname,
                    teamLogo: leagueData.teams.find(teams => teams.teamId === player.teamId).logo,
                }))

            return {
                topGoals: topscorers,
                topAssists: topassisters,
                topGa: topgoalandassisters,
                topBcm: topbcm,
                topChancesCreated: topchancesCreated,
                topPassingA: topPassingAccuracy,
                topDuelsP: topDuelsWonPercentage,
                topSavePercentage: topsavePercentage,
                topMatchRatings: topmatchRatings,
                topShotsOnTarget: topStatsObj.shots,
                topGoalsRate: topStatsObj.goals,
                topAssistsRate: topStatsObj.assists,
                topChancesCreatedRate: topStatsObj.chancesCreated,
                topPassesCompletedRate: topStatsObj.passesC,
                topTouchesRate: topStatsObj.touches,
                topDefensiveActionsRate: topStatsObj.defensiveActions,
                topDuelsWonRate: topStatsObj.duelsWon,
                topSavesRate: topStatsObj.saves,
                topGoalsConcededRate: topStatsObj.goalsConceded,
                topRecoveryRate: topStatsObj.gkRecovery,
            };

        }
        const playerStats = getPlayerStats()

        function getSquad() {
            const squadRaw = playerData.filter(p => p.team === teamId)

            const squad = squadRaw.map(p => ({
                playerName: p.playername,
                playerId: p.playerId,
                isCaptain: p.isCaptain || false,
                isManager: p.isManager || false,
                marketvalue: p.marketvalue,
                nation: p.nation
            }));

            squad.forEach(player => {
                const positions = allPlayerPosData.find(p => p.playerId === player.playerId);
                let posArr
                if (positions) {
                    posArr = positions.positions
                        .filter(p => p.ratio > 0.166 || !p.ratio)
                        .map(p => p.id) || [];
                } else {
                    console.warn(`No API data for playerId ${player.playerId}`);
                }
                player.positions = posArr;
                player.nationName = nationsData[player.nation].name || "Unknown";
                player.nationFlag = nationsData[player.nation].flag || "https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/logoless?v=1742054547120";
                player.pageUrl = `/players/${player.playerId}`;
            })

            return squad
        }
        const squad = getSquad()

        async function getOverview(name) {
            const lastMatch = teamFixtures.filter(m => m.hasStarted && m.timestamp)[0]
            if (lastMatch) {
                const lastMatchId = lastMatch.id
                const lastMatchUrl = `https://danhaxgrades.glitch.me/api/matchDetails/${lastMatchId}`
                const resMatch = await fetch(lastMatchUrl);
                if (!resMatch.ok) {
                    const errorText = await resMatch.text();
                    console.error(`Error fetching league table: ${resMatch.status} - ${errorText}`);
                    throw new Error(`HTTP error (table)! status: ${resMatch.status}`);
                }
                const lastMatchData = await resMatch.json();
                const lastMatchLineups = lastMatchData.lineup
                 var teamLineup = lastMatchData.general.home.name === name ? lastMatchLineups.home : lastMatchLineups.away
            } else {
                console.error(`Cant find last match for ${name}`)
                var teamLineup = {}
            }
            const notStartedMatches = teamFixtures.filter(m => !m.hasStarted) || []
            const nextMatch = notStartedMatches[notStartedMatches.length - 1]
            nextMatch.isHomeTeam = nextMatch.home.teamName === name ? true : false;
            const formFixtures = teamFixtures.filter(m => m.hasStarted).slice(0, 5)
            return {
                nextMatch: nextMatch,
                lastLineUp: teamLineup,
                teamForm: formFixtures,
            }
        }
        const overview = await getOverview(teamDetails.name)
        return {
            details: teamDetails,
            teamDesc: teamDescription,
            history: teamHistory,
            squad: squad,
            fixtures: teamFixtures,
            table: allTeamTables,
            playerStats: playerStats,
            transfers: teamTransfers,
            overview: overview,
            leagueInfo: leagueInfoObj,
        }

    } catch (error) {
        console.error(error);
        return { error: 'Server error' };
    }
}

module.exports = {
    getTeamData
};