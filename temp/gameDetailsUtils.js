function generalMatchData(matchId, leagueData, leagueId, teamData, matchData) {
    const general = {}
    const leagueNameMap = {
        1: "Exanon Pretemporada S3",
        2: "Exanon League S3",
        3: "Exanon Copa S3"
    }
    general.matchId = matchId
     general.roundName = matchData.leagueRound
    general.matchName = `${matchData.teamnames[0]} vs ${matchData.teamnames[1]}`
    general.leagueId = leagueId
    general.leagueName = leagueNameMap[leagueId]
    general.timeStamp = matchData.timestamp

    class playerStats {
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
            const homeColor = teamData.find(teams => teams.teamname == matchData.teamnames[0]).color || "rgb(39, 39, 39)"
            const awayColor = teamData.find(teams => teams.teamname == matchData.teamnames[1]).color || "rgb(39, 39, 39)"
            const id = teamData.find(teams => teams.teamname == matchData.teamnames[teamSide]).teamId
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
    general.home = new playerStats(0)
    general.away = new playerStats(1)

    return general
}

function matchStatus(matchData) {
    console.log(matchData)
    function formatMatchTimestamp(isoString) {
        if (isoString) {
            const dateObj = new Date(isoString);
    
            const day = dateObj.getDate();
            const month = dateObj.getMonth() + 1;
            const hours = dateObj.getHours();
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
            const formattedDate = `${day}/${month}`;
            const formattedTime = `${hours}:${minutes} PM`;
    
            return {
                matchDate: formattedDate,
                matchTime: formattedTime
            };
        } else {
            return {
                matchDate: "TBD",
                matchTime: "TBD"
            }
        }
    }
    const status = {}
    status.scoreStr = matchData.scoreline || ""
    status.finished = typeof matchData.finished === 'boolean' ? matchData.finished : false;
    status.started = typeof matchData.started === 'boolean' ? matchData.started : false;    
    status.cancelled = matchData.cancelled || false
    status.awarded = matchData.awarded || false
    status.extraTime = matchData.extraTime || false
    status.penalties = matchData.penalties || false
    if (status.penalties) status.penaltiesScoreStr = matchData.penaltiesScore
    function gameStatusTest() {
        if (status.awarded === true) {
            status.statusShort = "W.O";
        } else if (status.cancelled === true) {
            status.statusShort = "TBC";
        } else if (status.started === true) {
            if (status.finished === true) {
                status.statusShort = "FT";
            } else if (status.extraTime === true) {
                status.statusShort = "AET";
            } else if (status.finished === false) {
                status.statusShort = "Live";
            } else {
                status.statusShort = "Unknown";
            }
        } else {
            if (matchData.timestamp) {
            status.statusShort = (formatMatchTimestamp(matchData.timestamp).matchDate + ", "  + formatMatchTimestamp(matchData.timestamp).matchTime);
            } else {
                status.statusShort = "";
            }
        }
    }    
    gameStatusTest()
    return status
}

class playerStats {
    constructor(stats) {
        this.minutes = stats.minutes || 0;
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

const formationTitle = {
    fourthreethree: "4-3-3", fourtwothreeone: "4-2-3-1", fourfourtwo: "4-4-2",
    fouronefourone: "4-1-4-1", threefourthree: "3-4-3", threetwothreetwo: "3-2-3-2",
    fourtwofour: "4-2-4", fivefourone: "5-4-1", threetwotwothree: "3-2-2-3",
    fouronetwoonetwo: "4-1-2-1-2", threeonefourtwo: "3-1-4-2", threefivetwo: "3-5-2"
}

const formations = {
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
const formationCoords = {
    "fourthreethree": [
        [50, 4], [10, 17], [36.6, 15], [63.3, 15], [90, 17],
        [26.3, 28], [50, 23], [73.6, 28], [26.3, 43], [50, 43], [73.6, 43]
    ],
    "fourtwothreeone": [
        [50, 4], [10, 17], [36.6, 15], [63.3, 15], [90, 17],
        [27.7, 24.25], [50, 35.5], [72.3, 24.25], [18.86, 35.5], [50, 45.5], [81.14, 35.5]
    ],
    "fourfourtwo": [
        [50, 4], [10, 17], [36.6, 15], [63.3, 15], [90, 17],
        [10, 30], [36.6, 28], [63.3, 28], [90, 30], [36.6, 45.5], [63.3, 45.5]
    ],
    "fouronefourone": [
        [50, 4], [10, 17], [36.6, 15], [63.3, 15], [90, 17],
        [50, 24.25], [10, 37.5], [36.6, 35.5], [63.3, 35.5], [90, 37.5], [50, 45.5],
    ],
    "threefourthree": [
        [50, 4], [26.3, 15], [50, 15], [73.6, 15], [10, 32],
        [36.6, 29], [63.3, 29], [90, 32], [26.3, 43], [50, 43], [73.6, 43]
    ],
    "threetwothreetwo": [
        [50, 4], [18.86, 15], [50, 15], [81.14, 15], [36.6, 25.5],
        [63.3, 25.5], [18.86, 35.5], [50, 35.5], [81.14, 35.5], [36.6, 45.5], [63.3, 45.5]
    ],
    "fourthreetwoone": [
        [50, 4], [10, 17], [36.6, 15], [63.3, 15], [90, 17],
        [26.3, 23.75], [50, 23.75], [73.6, 23.75], [36.6, 34.5], [50, 45.5], [63.3, 34.5]
    ],
    "fourtwofour": [
        [50, 4], [10, 17], [36.6, 15], [63.3, 15], [90, 17],
        [70, 30], [30, 30], [10, 42], [36.6, 45.5], [63.3, 45.5], [90, 42]
    ],
    "fivefourone": [
        [50, 4], [27.7, 26], [50, 15], [72.3, 26], [90, 17],
        [36.6, 30], [72.3, 30], [50, 45.5], [20, 45.5], [27.7, 45.5], [80, 45.5]
    ],
    "threetwotwothree": [
        [50, 4], [18.86, 15], [50, 15], [81.14, 15], [36.6, 25.5],
        [63.3, 25.5], [36.6, 35.5], [63.3, 35.5], [26.3, 45.5], [50, 45.5], [73.6, 45.5]
    ],
    "fouronetwoonetwo": [
        [50, 4], [10, 17], [36.6, 15], [63.3, 15], [90, 17],
        [50, 23], [27.7, 30.5], [72.3, 30.5], [50, 38], [27.7, 45.5], [72.3, 45.5]
    ],
    "threeonefourtwo": [
        [50, 4], [18.86, 15], [50, 15], [81.14, 15], [50, 25], [10, 37.5], [36.6, 35.5], [63.3, 35.5], [90, 37.5], [27.7, 45.5], [72.3, 45.5]
    ],
    "threefivetwo": [
        [50, 4], [18.86, 15], [50, 15], [81.14, 15], [10, 31], [30, 29], [50, 29], [70, 29], [90, 31], [27.7, 45.5], [72.3, 45.5]
    ]
};

function matchPlayersStats(matchData, playerData, teamData, nationData) {
    const lineups = {}
    class lineup {
        constructor(teamSide) {
            this.formation = matchData.formation[teamSide] || ""
            this.formationTitle = formationTitle[matchData.formation[teamSide]] || ""
            this.players = {}
            const players = teamSide === 0
                ? matchData.playerslist.homeplayers
                : matchData.playerslist.awayplayers;
            const teamId = teamData.find(teams => teams.teamname == matchData.teamnames[teamSide]).teamId
            for (let i = 0; i < players.length; i++) {
                let player = players[i];
                const playerId = player.playerId
                const stats = new playerStats(player)
                var passesN = stats.touches - (stats.passesC + stats.shots + stats.defensiveActions + stats.ownGoals + stats.bcm + stats.duelsWon + stats.duelsLost);
                passesN = Math.max(0, passesN);

                let duelsP = stats.duelsWon + "/" + (stats.duelsWon + stats.duelsLost) + "  (" + ((stats.duelsWon / (stats.duelsWon + stats.duelsLost)) * 100).toFixed(1) + ")%";
                let passingA = stats.passesC + "/" + (stats.passesC + passesN) + "  (" + ((stats.passesC / (stats.passesC + passesN)) * 100).toFixed(1) + ")%";
                stats.passingA = passingA
                stats.duelsP = duelsP
                const isGK = (typeof player.isGoalkeeper !== "undefined") ? player.isGoalkeeper : false;
                const playerMatchId = i
                if(this.formation) { 
                    var playerPosition = formations[this.formation][playerMatchId] 
                }  else {
                    console.warn('Player is a sub or position not fonud')
                    var playerPosition = ""
                }
                if (this.formation && playerMatchId <= 10) {
                    var playerCoords = {
                        x: formationCoords[this.formation][playerMatchId][1],
                        y: formationCoords[this.formation][playerMatchId][0],
                    }
                } else {
                    console.warn(`Player Coords not found, Player: ${playerId} TeamSide: ${teamSide}, Formation ${this.formationTitle}`)
                    var playerCoords = {
                        x: null,
                        y: null
                    }
                }
                let {
                    minutes,
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

                function getMatchRating(isGK) {
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
                    return {
                        matchRating: matchRating,
                        matchRatingRounded: matchRating.toFixed(1)
                    }
                }

                if (playerData.player[playerId]) {
                    var playerNation = playerData.player[playerId].nation
                    var nationInfo = nationData[playerNation] || {};
                    this.players[playerId.toString()] = {
                        name: playerData.player[playerId].playername,
                        id: playerId,
                        teamId: teamId,
                        nationCode: playerNation,
                        nationName: nationInfo.name,
                        nationFlag: nationInfo.flag,
                        matchRating: getMatchRating(isGK).matchRating,
                        matchRatingRounded: getMatchRating(isGK).matchRatingRounded,
                        isGoalkeeper: isGK,
                        playerNumber: i, //PLAYER NUMBER = 0 to TEAMPLAYERSLENGTH - 1
                        stats: stats,
                        position: playerPosition,
                        coords: playerCoords,
                        playerFacts: []
                    };
                } else {
                    console.error("Player ID doesn't exist or could not be fonud")
                }
            }
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
        assignMVP(lineups.home.players, lineups.away.players);
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

     return lineups
}

function getMatchStats(homePlayers, awayPlayers) {
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
            totalNumberForEachStat += team[player][1].stats[metric]
        }
        return totalNumberForEachStat
    }

    for (let metric = 0; metric < gameStatsKeys.length; metric++) {
        const metricKey = gameStatsKeys[metric]
        const statItem = {
            key: metricKey,
            stats: [findTotalStats(homePlayers, metricKey), findTotalStats(awayPlayers, metricKey)],
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
    return topStats
}



module.exports = {
    generalMatchData,
    matchStatus,
    matchPlayersStats,
    getMatchStats
}