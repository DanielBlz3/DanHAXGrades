import formations from '/lib/formations.js';
import formatMatchTimestamp from '/lib/timeFormatter.js';
import getPlayerRating from '/lib/rating.js';
import getMatchStatus from '/lib/getMatchStatus.js';
const roundMap = {
    "1/1": "Finals",
    "1/2": "Semi_Finals",
    "1/4": "Quarter_Finals",
    "1/8": "Round_Of_16",
    "1/16": "Round_Of_32"
}
async function getMatchDetails(matchId, leagueId, teamData, matchData, playerData, nationData) {
    const general = {}
    const leagueNameMap = {
        1: ["Exanon Pretemporada S3"],
        2: ["Exanon League S3"],
        3: ["Exanon Copa S3"]
    }
    general.matchId = matchId
    general.roundName = roundMap[matchData.leagueRound] || String(matchData.leagueRound)
    general.round = matchData.leagueRound
    general.matchName = `${teamData.find(t => t.teamId == matchData.teamIds[0])?.teamname} vs ${teamData.find(t => t.teamId == matchData.teamIds[1])?.teamname}`
    general.leagueId = leagueId
    general.leagueName = leagueNameMap[leagueId][0]
    general.leagueLogo = `/images/leagueLogos/${leagueId}.png`
    general.timeStamp = matchData.timestamp

    class teamInfo {
        constructor(teamSide) {
            function isDark(rgbString, threshold) {
                const rgb = rgbString.match(/\d+/g).map(Number);
                const [r, g, b] = rgb;
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                return brightness < threshold;
            }
            function isColorsSimilar(rgbString1, rgbString2, threshold) {
                const rgb1 = rgbString1.match(/\d+/g).map(Number);
                const rgb2 = rgbString2.match(/\d+/g).map(Number);

                const [r1, g1, b1] = rgb1;
                const [r2, g2, b2] = rgb2;

                // Calculate the Euclidean distance between the two colors
                const distance = Math.sqrt(
                    Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
                );

                return distance < threshold; // If distance is less than threshold, they are considered similar
            }
            const homeColor = teamData.find(teams => teams.teamId == matchData.teamIds[0])?.color || "rgb(39, 39, 39)"
            const awayColor = teamData.find(teams => teams.teamId == matchData.teamIds[1])?.color || "rgb(39, 39, 39)"
            const id = matchData.teamIds[teamSide] || -1
            const teamInfo = teamData.find(teams => teams.teamId == id)
            const url = `/teams/${id}`
            this.id = id
            this.name = teamInfo.teamname
            this.logo = teamInfo.logo
            this.pageUrl = url
            if (teamSide == 0) {
                this.bgLightTheme = teamInfo.color
                this.bgDarkTheme = isDark(this.bgLightTheme, 50) ? "rgb(255, 255, 255)" : teamInfo.color
            }
            if (teamSide == 1) {
                this.bgLightTheme = isColorsSimilar(homeColor, awayColor, 100) ? teamInfo.colorAlternate : teamInfo.color
                this.bgDarkTheme = isDark(this.bgLightTheme, 50) ? "rgb(255, 255, 255)" : this.bgLightTheme
            }
            this.fontColorLightTheme = isDark(this.bgLightTheme, 163) ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"
            this.fontColorDarkTheme = isDark(this.bgDarkTheme, 163) ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"
        }
    }
    general.home = new teamInfo(0)
    general.away = new teamInfo(1)

    const status = getMatchStatus(matchData)

    const lineups = {}
    class lineup {
        constructor(teamSide) {
            const players = teamSide === 0 ? matchData.playerslist.homeplayers : matchData.playerslist.awayplayers;
            const teamId = matchData.teamIds[teamSide]
            this.formation = matchData.formation[teamSide] || ""
            const formationObj = formations[this.formation]
            this.formationTitle = formationObj?.formationTitle || ""
            this.teamName = teamData.find(t => t.teamId == matchData.teamIds[teamSide])?.teamname
            this.teamId = teamId
            this.players = {}
            players.map((player, i) => {
                const playerId = player.playerId;
                const stats = player
                const isGK = typeof player.isGoalkeeper !== "undefined" ? player.isGoalkeeper : false;
                const playerMatchId = i;
                let playerPosition = "";
                if (this.formation) {
                    playerPosition = formationObj?.positions?.[playerMatchId];
                } else {
                    console.warn('Player is a sub or position not found');
                }

                let playerCoords = { x: null, y: null };
                if (this.formation && playerMatchId <= 10) {
                    playerCoords = {
                        x: formations[this.formation]?.coords[playerMatchId][1],
                        y: formations[this.formation]?.coords[playerMatchId][0],
                    };
                } else {
                    console.warn(`Player Coords not found, Player: ${playerId} TeamSide: ${teamSide}, Formation ${this.formationTitle}`);
                }

                if (playerData.find(p => p.playerId === playerId)) {
                    const playerNation = playerData.find(p => p.playerId === playerId).nation;
                    const nationInfo = nationData[playerNation] || {};
                    const matchRating = getPlayerRating(stats, isGK);
                    const matchRatingRounded = matchRating.toFixed("1")

                    let passesN = stats.touches - (stats.passesC + stats.shots + stats.defensiveActions + stats.ownGoals + stats.bcm + stats.duelsWon + stats.duelsLost);
                    passesN = Math.max(0, passesN);
                    let duelsP = stats.duelsWon + "/" + (stats.duelsWon + stats.duelsLost) + "  (" + ((stats.duelsWon / (stats.duelsWon + stats.duelsLost)) * 100).toFixed(1) + ")%";
                    let passingA = stats.passesC + "/" + (stats.passesC + passesN) + "  (" + ((stats.passesC / (stats.passesC + passesN)) * 100).toFixed(1) + ")%";
                    stats.passingA = passingA;
                    stats.duelsP = duelsP;

                    this.players[playerId.toString()] = {
                        name: playerData.find(p => p.playerId === playerId).playername,
                        id: playerId,
                        teamId: teamId,
                        nationCode: playerNation,
                        nationName: nationInfo.name,
                        nationFlag: nationInfo.flag,
                        matchRating,
                        matchRatingRounded,
                        isGoalkeeper: isGK,
                        playerNumber: i,
                        stats,
                        position: playerPosition,
                        coords: playerCoords,
                        playerFacts: []
                    };
                } else {
                    console.error("Player ID doesn't exist or could not be found");
                }
            });

            const playersUpdated = Object.entries(this.players)

            function findTeamAvg() {
                var ratingCumulative = 0
                for (let i = 0; i < 11; i++) {
                    if (playersUpdated[i]) {
                        var playerMatchRating = playersUpdated[i][1].matchRating
                        ratingCumulative += playerMatchRating
                    } else {
                        console.error(`Player does not exist, player index: ${ratingCumulative}`)
                    }
                }
                ratingCumulative /= 11
                return ratingCumulative.toFixed(1)
            }
            this.rating = playersUpdated.length ? findTeamAvg() : ""
        }
    }
    lineups.home = new lineup(0)
    lineups.away = new lineup(1)

    function assignMVP(homePlayers, awayPlayers) {
        const allPlayers = [...Object.values(homePlayers), ...Object.values(awayPlayers)];
        allPlayers.sort((a, b) => b.matchRating - a.matchRating);
        const mvp = allPlayers[0];
        allPlayers.forEach(player => player.isMvp = false);
        mvp.isMvp = true;
        return mvp;
    }

    if (Object.keys(lineups.home.players).length && Object.keys(lineups.away.players).length) {
        assignMVP(lineups.home?.players, lineups.away?.players);
    } else {
        console.warn("No players - can't find MVP")
    }

    const playerFactLongValues = [{ key: "duelsWon", value: 0, players: [] }, { key: "duelsLost", value: 0, players: [] }, { key: "defensiveActions", value: 0, players: [] }, { key: "keyPasses", value: 0, players: [] }, { key: "touches", value: 0, players: [] }, { key: "passesC", value: 0, players: [] }, { key: "shots", value: 0, players: [] }]
    const playerFactShortValues = [{ key: "passingA", value: 0, players: [] }, { key: "bigErrors", value: 0, players: [] }, { key: "ownGoals", value: 0, players: [] }]
    /*DISPLAYS THE METRIC, PLAYER WITH THE HIGHEST, THE VALUE OF IT,
    AND THE TEXT THAT COMES AFTER IN ENGLISH/ESPANOL*/
    let playerBestStatsObject = {
        shots: {
            descen: "had the most shots on target", //ENGLISH TEXT CONTEXT THAT APPEARS IN PLAYER FACTS BEFORE THE STAT
            desces: "tuvo el mayor número de tiras a puerta", //SPANISH TEXT CONTEXT THAT APPEARS IN PLAYER FACTS BEFORE THE STAT
            player: [], //THE PLAYER(S) DEPENDING ON IF ITS AN ARRAY METRIC OR REGULAR VARIABLE
            value: 0, //DISPLAYS THE HIGHEST OF EACH, FOR EX: MESSI HAD THE MOST SHOTS ON TARGET (VALUE)
        },
        duelsWon: {
            descen: "had the most duels won", desces: "tuvo el mayor número de duelos ganó",
            player: [], value: 0,
        },
        duelsLost: {
            descen: "had the most duels lost", desces: "tuvo el mayor número de duelos perdidos",
            player: [], value: 0,
        },
        defensiveActions: {
            descen: "had the most defensive actions", desces: "tuvo el mayor número de acciones defensivas",
            player: [], value: 0,
        },
        keyPasses: {
            descen: "had the most chances created", desces: "tuvo el mayor número de oportunidades creada",
            player: [], value: 0,
        },
        touches: {
            descen: "had the most touches", desces: "tuvo el mayor número de toques",
            player: [], value: 0,
        },
        passesC: {
            descen: "had the most passes completed", desces: "completó el mayor número de pases",
            player: [], value: 0,
        },
        passingA: {
            descen: "was the player who made the most accuracte passes", desces: "ha sido el jugador que ha realizado los pases más precisos.",
            player: [], value: 0,
        },
        bigErrors: {
            descen: "made an error that led to a goal for",
            desces: {
                start: "ha cometido un error que ha provocado que", //COMES BEFORE THE VALUE || ONLY FOR THE SPANISH VERSION THIS IS NEEDED
                end: "marque un gol.", //COMES AFTER THE VALUE, || ONLY FOR THE SPANISH VERSION THIS IS NEEDED
            },
            player: [], value: 0,
        },
        ownGoals: {
            descen: "had an own goal.",
            desces: " ha marcado un gol en propia meta.",
            player: [], value: 0,
        },
    }

    function findHighestMetric(homePlayers, awayPlayers) {
        const allPlayers = [...Object.values(homePlayers), ...Object.values(awayPlayers)];
        for (let metric = 0; metric < playerFactLongValues.length; metric++) {
            const key = playerFactLongValues[metric].key
            const maxMetric = Math.max(...allPlayers.map(p => (p.stats[key] !== undefined && p.stats[key] !== null) ? p.stats[key] : 0));

            playerFactLongValues[metric].value = maxMetric
            playerFactLongValues[metric].players = allPlayers
                .filter(p => {
                    const stat = (p.stats[key] !== undefined && p.stats[key] !== null) ? p.stats[key] : 0;
                    return stat === maxMetric;
                })
                .map(p => p.id);
        }
    }
    findHighestMetric(lineups.home.players, lineups.away.players)

    const topStats = []
    const otherStats = []
    const gameStatsKeys = [
        "shots",
        "bcm",
        "passesC",
        "touches",
        "keyPasses",
        "defensiveActions",
        "bigErrors",
        "duelsWon",
        "duelsLost",
        "ownGoals",
    ];

    function findTotalStats(team, metric) {
        let totalNumberForEachStat = 0
        for (let player = 0; player < team.length; player++) {
            totalNumberForEachStat += team[player][metric]
        }
        return totalNumberForEachStat
    }

    for (let metric = 0; metric < gameStatsKeys.length; metric++) {
        const metricKey = gameStatsKeys[metric]
        const statItem = {
            key: metricKey,
            stats: [findTotalStats(matchData.playerslist.homeplayers, metricKey), findTotalStats(matchData.playerslist.awayplayers, metricKey)],
            type: "number"
        }
        if (["duelsLost", "ownGoals"].includes(gameStatsKeys[metric])) {
            otherStats.push(statItem)
        } else {
            topStats.push(statItem)
        }
    }

    //CONVERTS MOST OF THE METRIC OBJECT STAT VALUES INTO VARIABLES
    const touches = topStats.find(stat => stat.key === "touches").stats
    const passesC = topStats.find(stat => stat.key === "passesC").stats
    const duelsWon = topStats.find(stat => stat.key === "duelsWon").stats
    const duelsLost = otherStats.find(stat => stat.key === "duelsLost").stats
    const defensiveActions = topStats.find(stat => stat.key === "defensiveActions").stats
    const shots = topStats.find(stat => stat.key === "shots").stats
    const bcm = topStats.find(stat => stat.key === "bcm").stats
    const ownGoals = otherStats.find(stat => stat.key === "ownGoals").stats

    //ADDS POSSESSION OBJ
    let possession = {
        key: "possession",
        stats: [],
        type: "percentage"
    }
    function getPossession(home, away) {
        return Math.round(((home / (home + away)) * 100))
    }

    possession.stats.push(getPossession(topStats.find(stat => stat.key === "passesC").stats[0], topStats.find(stat => stat.key === "passesC").stats[1]))
    possession.stats.push(getPossession(topStats.find(stat => stat.key === "passesC").stats[1], topStats.find(stat => stat.key === "passesC").stats[0]))
    topStats.unshift(possession)

    //ADDS DUELS WON % OBJ
    let duelsP = {
        key: "duelsP",
        stats: [],
        type: "percentage"
    }
    function getDuelsP(duelsWon, duelsLost) {
        return Math.round(((duelsWon / (duelsWon + duelsLost)) * 100))
    }

    duelsP.stats.push(getDuelsP(duelsWon[0], duelsLost[0]))
    duelsP.stats.push(getDuelsP(duelsWon[1], duelsLost[1]))
    topStats.push(duelsP)

    //ADDS PASSING ACCURACY
    let passingA = {
        key: "passingA",
        stats: [],
        type: "percentage"
    }
    function getDuelsP(accuractePasses, nonAccuractePasses) {
        return Math.round(((accuractePasses / (accuractePasses + nonAccuractePasses)) * 100))
    }
    const homeNonAccuractePasses = touches[0] - (passesC[0] + shots[0] + defensiveActions[0] + ownGoals[0] + bcm[0] + duelsWon[0] + duelsLost[0])
    const awayNonAccuractePasses = touches[1] - (passesC[1] + shots[1] + defensiveActions[1] + ownGoals[1] + bcm[1] + duelsWon[1] + duelsLost[1])
    passingA.stats.push(getDuelsP(passesC[0], homeNonAccuractePasses))
    passingA.stats.push(getDuelsP(passesC[1], awayNonAccuractePasses))
    topStats.push(passingA)

    //FINDS THE TEAM THAT SHOULD BE HIGLIGHTED IN THE HTML
    topStats.forEach(stat => {
        const [val1, val2] = stat.stats;
        const key = stat.key;

        if (key === "bigErrors" || key === "bcm") {
            //HIGHLIGHTS THE HIGHER VALUE
            stat.highlighted = val1 < val2 ? 0 : val1 > val2 ? 1 : -1;
        } else {
            //HIGHLIGHTS THE LOWER VALUE
            stat.highlighted = val1 > val2 ? 0 : val1 < val2 ? 1 : -1;
        }
    });
    return {
        general: general,
        matchStatus: status,
        lineup: lineups,
        topStats: topStats,
    }

}

export default getMatchDetails