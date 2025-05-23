import formations from '/lib/formations.js';
import getPlayerRating from '/lib/rating.js';

async function getPlayerStats(individualPlayerData) {
    try {
        let rawPlayersGameStats = []
        function findPlayerPos(formation, playerIndex) {
            if (formations[formation]) {
                return formations[formation][playerIndex] || false
            } else {
                return ""
            }
        }
        //=================================|RAW DATA FOR PLAYER STATS IN THE CUP + LEAUGE|=================================
        //
        //
        function allIndividualPlayerGameStats(team, match, rawPlayersGameStats) {
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
            allIndividualPlayerGameStats("homeplayers", match, rawPlayersGameStats);
            allIndividualPlayerGameStats("awayplayers", match, rawPlayersGameStats);
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
        console.error(err);
    }
}

export default getPlayerStats