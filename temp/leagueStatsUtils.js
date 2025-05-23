async function getLeagueStats(exanonLeagueData, exanonCupData) {
    try {
        exanonLeagueData.games.forEach(game => { game.leagueId = 2 });
        exanonCupData.games.forEach(game => { game.leagueId = 3 });
        const individualPlayerData = [...exanonLeagueData.games, ...exanonCupData.games]
        let rawPlayersGameStats = []

        const formationsPositions = {
            "fourthreethree": ["GK", "LB", "CB", "CB", "RB", "CM", "DM", "CM", "LW", "ST", "RW"],
            "fourtwothreeone": ["GK", "LB", "CB", "CB", "RB", "DM", "AM", "DM", "LW", "ST", "RW"],
            "fourfourtwo": ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "CM", "RM", "ST", "ST"],
            "fouronefourone": ["GK", "LB", "CB", "CB", "RB", "DM", "LM", "AM", "AM", "RM", "ST"],
            "threefourthree": ["GK", "CB", "CB", "CB", "LM", "CM", "CM", "RM", "LW", "ST", "RW"],
            "threetwothreetwo": ["GK", "CB", "CB", "CB", "DM", "DM", "LM", "CAM", "RM", "ST", "ST"],
            "fourthreetwoone": ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "AM", "AM", "ST"],
            "fourtwofour": ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "LW", "ST", "ST", "RW"],
            "fivefourone": ["GK", "LWB", "CB", "CB", "CB", "RWB", "LM", "CM", "CM", "RM", "ST"],
            "threetwotwothree": ["GK", "CB", "CB", "CB", "DM", "DM", "AM", "AM", "LW", "ST", "RW"],
            "fouronetwoonetwo": ["GK", "LB", "CB", "CB", "RB", "DM", "CM", "CM", "AM", "ST", "ST"],
            "threeonefourtwo": ["GK", "CB", "CB", "CB", "DM", "LM", "CM", "CM", "RM", "ST", "ST"],
            "threefivetwo": ["GK", "CB", "CB", "CB", "LM", "CM", "CM", "CM", "RM", "ST", "ST"],
        }

        class playerStats {
            constructor(stats) {
                this.goals = stats.goals || 0;
                this.shots = stats.shots || 0;
                this.bcm = stats.bcm || 0;
                this.passesC = stats.passesC || 0;
                this.assists = stats.assists || 0;
                this.keyPasses = stats.keyPasses || 0;
                this.secondAssists = stats.secondAssists || 0;
                this.touches = stats.touches || 0;
                this.defensiveActions = stats.defensiveActions || 0;
                this.errors = stats.errors || 0;
                this.bigErrors = stats.bigErrors || 0;
                this.ownGoals = stats.ownGoals || 0;
                this.duelsWon = stats.duelsWon || 0;
                this.duelsLost = stats.duelsLost || 0;
                this.lastManTackles = stats.lastManTackles || 0;
                this.clearancesOffTheLine = stats.clearancesOffTheLine || 0;
                this.saves = stats.saves || 0;
                this.goalsConceded = stats.goalsConceded || 0;
                this.gkPunches = stats.gkPunches || 0;
                this.gkRecovery = stats.gkRecovery || 0;
                this.actedAsSweeper = stats.actedAsSweeper || 0;
                this.bonus = stats.bonus || 0;
            }
        }

        function findPlayerPos(formation, playerIndex) {
            if (formationsPositions[formation]) {
                return formationsPositions[formation][playerIndex] || false
            } else {
                return ""
            }
        }

        function getPlayerRating(playerInfo) {
            const stats = new playerStats(playerInfo)
            var passesN = stats.touches - (stats.passesC + stats.shots + stats.defensiveActions + stats.ownGoals + stats.bcm + stats.duelsWon + stats.duelsLost);
            passesN = Math.max(0, passesN);

            let duelsP = stats.duelsWon + "/" + (stats.duelsWon + stats.duelsLost) + "  (" + ((stats.duelsWon / (stats.duelsWon + stats.duelsLost)) * 100).toFixed(1) + ")%";
            let passingA = stats.passesC + "/" + (stats.passesC + passesN) + "  (" + ((stats.passesC / (stats.passesC + passesN)) * 100).toFixed(1) + ")%";
            stats.passingA = passingA
            stats.duelsP = duelsP
            const isGK = (typeof playerInfo.isGoalkeeper !== "undefined") ? playerInfo.isGoalkeeper : false;

            let {
                goals,
                shots,
                bcm,
                passesC,
                assists,
                keyPasses,
                secondAssists,
                touches,
                defensiveActions,
                errors,
                bigErrors,
                ownGoals,
                duelsWon,
                duelsLost,
                lastManTackles,
                clearancesOffTheLine,
                saves,
                goalsConceded,
                gkPunches,
                gkRecovery,
                actedAsSweeper,
                bonus
            } = stats || {}

            if (isGK === true) {
                var matchRating = 6.0 + (assists * 1 +
                    keyPasses * 0.35 +
                    errors * -0.3 +
                    bigErrors * -0.7 +
                    ownGoals * -0.5 +
                    duelsWon * 0.08 +
                    duelsLost * -0.08 +
                    saves * 0.3 +
                    goalsConceded * -0.3 +
                    gkPunches * 0.15 +
                    gkRecovery * 0.05 +
                    actedAsSweeper * 0.2 +
                    bonus * 0.1)
                if (goalsConceded == 0) matchRating += 0.5;
            } else {
                var matchRating = 6.0 + (shots * 0.15 +
                    goals * 1.0 +
                    assists * 0.5 +
                    keyPasses * 0.2 +
                    secondAssists * 0.3 +
                    defensiveActions * 0.1 +
                    lastManTackles * 0.3 +
                    clearancesOffTheLine * 0.45 +
                    errors * -0.3 +
                    bigErrors * -0.7 +
                    ownGoals * -0.5 +
                    bcm * -0.2 +
                    duelsWon * 0.1 +
                    duelsLost * -0.05 +
                    (passesC * 0.05 + passesN * -0.03 + passesC / 75) +
                    bonus * 0.1)
            }
            matchRating = Math.max(0.1, Math.min(10, Math.round(matchRating * 100) / 100))

            return Math.round(matchRating * 100) / 100
        }


        //=================================|RAW DATA FOR PLAYER STATS IN THE CUP + LEAUGE|=================================
        //
        //
        function allIndividualPlayerGameStats(team, match, individualPlayerData, rawPlayersGameStats) {
            var teamSide = team === "homeplayers" ? 0 : 1
            let game = individualPlayerData[match];
            if (game) {
                game.playerslist[team].forEach((clonedPlayer, playerIndex) => {
                    clonedPlayer.chancesCreated = clonedPlayer.keyPasses + clonedPlayer.assists
                    clonedPlayer.matchRating = getPlayerRating(clonedPlayer)
                    clonedPlayer.playerIndex = playerIndex;
                    clonedPlayer.position = findPlayerPos(game.formation[teamSide], clonedPlayer.playerIndex)
                    clonedPlayer.matchId = game.gameId;
                    clonedPlayer.matchNumberExanonStats = match;
                    clonedPlayer.leagueId = game.leagueId;
                    clonedPlayer.leagueRound = game.leagueRound
                    clonedPlayer.scoreline = game.scoreline;
                    clonedPlayer.teamName = game.teamnames[teamSide];
                    clonedPlayer.opponentTeamName = team === "homeplayers" ? game.teamnames[1] : game.teamnames[0]
                    clonedPlayer.isHome = team === "homeplayers" ? true : false
                    rawPlayersGameStats.push(clonedPlayer);
                });
            }
        }

        for (let match = 0; match < individualPlayerData.length; match++) {
            allIndividualPlayerGameStats("homeplayers", match, individualPlayerData, rawPlayersGameStats);
            allIndividualPlayerGameStats("awayplayers", match, individualPlayerData, rawPlayersGameStats);
        }
        individualPlayerData.forEach((match) => {
            const matchPlayers = rawPlayersGameStats.filter(p => p.matchId == match.gameId)
            if (matchPlayers) {
                matchPlayers.sort((a, b) => b.matchRating - a.matchRating);
                const mvp = matchPlayers[0]
                if (mvp) {
                    rawPlayersGameStats.forEach(p => {
                        if (p.matchId === match.gameId) {
                            p.isMvp = (p.playerId == mvp.playerId)
                        }
                    })
                } else {
                    console.error("MVPS NOT FOUND")
                }
            } else {
                console.error("PLAYERS NOT FOUND")
            }
        })


        return rawPlayersGameStats

    } catch (err) {
        console.error('Failed to fetch player positions:', err);
    }
}

module.exports = {
    getLeagueStats
};