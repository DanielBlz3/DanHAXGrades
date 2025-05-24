
async function getPlayerStatsPerId(playerData, leagueData, playerStatsRaw, playerPositions) {

    try {
        let allPlayerStats = []
        for (let i = 1; i < playerData.length + 1; i++) {
            const playerInfo = playerData.find(p => p.playerId === i)
            let playerTotalStats = {
                playerId: i,
                leagueId: 0,
                teamId: playerInfo ? playerData.find(p => p.playerId === i).team : 0,
                playerPosition: "",
                appearances: 0,
                minutes: 0,
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
            };

            const focusedPlayerPositions = playerPositions.find(p => p.playerId === i);
            if (focusedPlayerPositions) {
                const mainPosObj = focusedPlayerPositions.positions.find(pos => pos.isMainsPos) || {};
                playerTotalStats.playerPosition = mainPosObj.id || null;
            } else {
                console.warn(`No API data for playerId ${i}`);
            }

            const team = leagueData.teams.find(teams => teams.teamId === playerTotalStats.teamId)
            playerTotalStats.teamName = team ? team.teamname : null
            playerTotalStats.teamLogo = team ? team.logo : null
            playerTotalStats.teamColor = team ? team.color : null

            var focusedPlayer = playerStatsRaw.filter(o => o.playerId === i);
            for (const metric in playerTotalStats) {
                if (!["playerPosition", "playerId", "passingA", "duelsP", "gkSavePercentage", "leagueId", "teamId", "teamName", "teamLogo", "teamColor"].includes(metric)) {
                    for (let eachGame = 0; eachGame < focusedPlayer.length; eachGame++) {
                        if (metric === "matchRating") {
                            playerTotalStats[metric] += (focusedPlayer[eachGame].matchRating)
                        } else if (metric === "appearances") {
                            playerTotalStats[metric] += 1;
                        } else {
                            playerTotalStats[metric] += Math.round(focusedPlayer[eachGame][metric]) || 0;
                        }
                    }
                } else if (metric === "passingA") {
                    playerTotalStats[metric] = (playerTotalStats.passesC / (playerTotalStats.passesC + playerTotalStats.touches - (playerTotalStats.passesC + playerTotalStats.shots + playerTotalStats.defensiveActions + playerTotalStats.ownGoals + playerTotalStats.bcm + playerTotalStats.duelsWon + playerTotalStats.duelsLost + playerTotalStats.ownGoals))) || 0;
                } else if (metric === "duelsP") {
                    playerTotalStats[metric] = (playerTotalStats.duelsWon / (playerTotalStats.duelsWon + playerTotalStats.duelsLost)) || 0;
                } else if (metric === "gkSavePercentage") {
                    playerTotalStats[metric] = (playerTotalStats.saves / (playerTotalStats.saves + playerTotalStats.goalsConceded)) || 0;
                } else if (metric === "leagueId") {
                    if (focusedPlayer.length) playerTotalStats[metric] = focusedPlayer[0].leagueId;
                }
            }
            allPlayerStats.push(playerTotalStats);
        }
        allPlayerStats.forEach(p => p.matchRating = Math.round((p.matchRating / p.appearances) * 100) / 100)
        return allPlayerStats

    } catch (err) {
        console.error('Failed to fetch player positions per id:', err);
    }
}

export default getPlayerStatsPerId