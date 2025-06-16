async function getPlayerInfo(playerId, player, nations, teamData, allPlayerPosData, playerStatsPerId, playerStatsRaw) {
    try {
        function isDark(rgbString) {
            const rgb = rgbString.match(/\d+/g).map(Number);
            const [r, g, b] = rgb;
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            return brightness < 50;
        }
        if (!player) {
            throw new Error('Player not found');
        }


        //===================================|GENERAL DATA FOR THE PLAYER|===============================//
        //                                                                                                       //
        //
        const playerNationality = nations[player.nation] || "na"
        player.nationName = playerNationality.name
        player.nationFlag = playerNationality.flag
        player.nationContinent = playerNationality.continent
        player.teamLogo = teamData.teams[player.team].logo
        player.teamName = teamData.teams[player.team].teamname
        player.career = player?.career?.map(t => {
            const team = teamData.teams.find(team => team.teamId === t.team)
            return {
                ...t,
                logo:  team?.logo || '/images/teamLogos/0',
                teamName: team?.teamname || 'N/A', 
            }
        })
        player.teamColors = {}
        if (teamData.teams[player.team].color) {
            player.teamColors.teamColorMain = teamData.teams[player.team].color
            player.teamColors.teamColorAlternate = isDark(player.teamColors.teamColorMain) === true ? "rgb(255, 255, 255)" : teamData.teams[player.team].color
        } else {
            [player.teamColors.teamColorMain, player.teamColors.teamColorAlternate].forEach(element => {
                element = "rgb(39,39,39)"
            });
        }
        const leagueMap = {
            1: "fixturesPreTemp3",
            2: "fixturesLiga3",
            3: "fixturesCopa3",
        }
        class percentileGoalkeeperMetrics {
            constructor() {
                this.errors = {};
                this.bigErrors = {};
                this.ownGoals = {};
                this.passesC = {};
                this.touches = {};
                this.passingA = {};
                this.saves = {};
                this.goalsConceded = {};
                this.gkSavePercentage = {};
                this.gkPunches = {};
                this.gkRecovery = {};
                this.actedAsSweeper = {};
            }
        }
        class percentileOutfieldMetrics {
            constructor() {
                this.goals = {};
                this.shots = {};
                this.assists = {};
                this.chancesCreated = {};
                this.defensiveActions = {};
                this.errors = {};
                this.bigErrors = {};
                this.ownGoals = {};
                this.bcm = {};
                this.duelsWon = {};
                this.passesC = {};
                this.touches = {};
                this.passingA = {};
                this.duelsP = {};
            }
        }

        const focusedPlayerGameStats = playerStatsRaw.filter(players => players.playerId === playerId) || []
        const focusedPlayerTotalStats = playerStatsPerId.find(players => players.playerId === playerId) || {};
        const playerGameStatsFormattedFP = playerStatsPerId.filter(players => players.minutes >= 25 || players.playerId == playerId);


        //=================================| PLAYER PERCENTILE STATS |=================================
        //
        //
        const playerPositions = allPlayerPosData.find(player => player.playerId === playerId)
        if (playerPositions.positions.find(pos => pos.isMainPos === true)) {
            var mainPos = playerPositions.positions.find(pos => pos.isMainPos === true).id
        } else {
            var mainPos = null
        }

        function playerPercentiles(playerId, playerTotalStats, playerPool) {
            var statData = {};
            var playerRatings = [{}, {}, {}, {}, {}, {}];
            var competitionStatsValues = [];

            let player = allPlayerPosData.find(p => p.playerId == playerId);

            let mainPosFind = player && Array.isArray(player.positions)
                ? player.positions.find(pos => pos.isMainPos === true)
                : null;

            let gkOrOutfielder = mainPosFind && mainPosFind.id === "GK" ? "gk" : "nonGk";
            const allowedPositionsForEachPosition = {
                ST: ["ST", "FWD"],
                LW: ["LW", "RW", "AM"],
                RW: ["LW", "RW", "AM"],
                AM: ["LW", "RW", "AM"],
                LM: ["CM", "DM", "LM", "RM", "MID"],
                RM: ["CM", "DM", "LM", "RM", "MID"],
                CM: ["CM", "DM", "LM", "RM", "MID"],
                LWB: ["LB", "RB", "LWB", "RWB"],
                RWB: ["LB", "RB", "LWB", "RWB"],
                DM: ["CM", "DM", "LM", "RM", "MID"],
                LB: ["LB", "RB", "LWB", "RWB"],
                RB: ["LB", "RB", "LWB", "RWB"],
                CB: ["CB", "DEF"],
                GK: ["GK"]
            }

            playerPool = playerPool.filter(player => {
                const playerData = allPlayerPosData.find(p => p.playerId === player.playerId);
                const mainPosObj = playerData && Array.isArray(playerData.positions)
                    ? playerData.positions.find(pos => pos.isMainPos === true)
                    : null;
                if (!mainPosObj) return false;
                const mainPosition = mainPosObj.id;
                return player.minutes >= 25 && allowedPositionsForEachPosition[mainPos].includes(mainPosition) && player.playerId !== playerId;
            });


            let playerPrecentileCalc = gkOrOutfielder === "nonGk" ? new percentileOutfieldMetrics() : new percentileGoalkeeperMetrics()
            function precentileforeachmetricpergame(metric) {
                const metricObj = playerPrecentileCalc[metric]
                let count = 0
                for (let player = 0; player < playerPool.length; player++) {

                    if (playerPool[player][metric] < playerTotalStats[metric]) {
                        count++
                    }
                }

                let percentile = ((count / playerPool.length)) * 100
                metricObj.precentileRankTotal = (["errors", "bigErrors", "ownGoals", "bcm", "goalsConceded"].includes(metric)) ? 100 - percentile : percentile
                count = 0
                for (let player = 0; player < playerPool.length; player++) {
                    if (["passingA", "duelsP", "gkSavePercentage"].includes(metric)) {
                        if ((playerPool[player][metric] / 1) < playerTotalStats[metric]) {
                            count++
                        }
                    } else {
                        if ((playerPool[player][metric] / (playerPool[player].minutes / 20)) < playerTotalStats[metric] / (playerTotalStats.minutes / 20)) {
                            count++
                        }
                    }
                    percentile = ((count / playerPool.length)) * 100
                    metricObj.precentileRankPer20 = (["errors", "bigErrors", "ownGoals", "bcm", "goalsConceded"].includes(metric)) ? 100 - percentile : percentile
                }

                metricObj.valueTotal = playerTotalStats[metric]
                if (!["passingA", "duelsP", "gkSavePercentage"].includes(metric)) {
                    metricObj.valuePer20 = Math.round((playerTotalStats[metric] / (playerTotalStats.minutes / 20)) * 100) / 100
                } else {
                    metricObj.valuePer20 = `${(playerTotalStats[metric] * 100).toFixed(1)}%`
                    metricObj.valueTotal = `${(playerTotalStats[metric] * 100).toFixed(1)}%`
                }
                metricObj.id = metric
            }

            for (let key in playerPrecentileCalc) {
                precentileforeachmetricpergame(key)
            }

            const ratingsChartMetricNames = [
                {
                    nonGk: "shooting", gk: "sweeper"
                },
                {
                    nonGk: "creativity", gk: "goalsConceded"
                },
                {
                    nonGk: "ballRetention", gk: "ballClaiming"
                },
                {
                    nonGk: "touches", gk: "saving"
                },
                {
                    nonGk: "duels", gk: "distribution"
                },
                {
                    nonGk: "defense", gk: "errorProneness"
                }

            ]

            function ratingValueAndTitle(num, value) {
                const ratingItem = playerRatings[num]
                ratingItem.value = Math.round(Math.min(value, 100))
                ratingItem.title = ratingsChartMetricNames[num][gkOrOutfielder]
            }

            if (gkOrOutfielder == "gk" && (playerPrecentileCalc.actedAsSweeper || playerPrecentileCalc.actedAsSweeper === 0)) {
                ratingValueAndTitle(0, ((playerPrecentileCalc.actedAsSweeper.precentileRankPer20 * .75) + (playerPrecentileCalc.gkPunches.precentileRankPer20 * .25)))
                ratingValueAndTitle(1, (playerPrecentileCalc.goalsConceded.precentileRankPer20))
                ratingValueAndTitle(2, (playerPrecentileCalc.touches.precentileRankPer20))
                ratingValueAndTitle(3, (playerPrecentileCalc.saves.precentileRankPer20 * .67) + (playerPrecentileCalc.gkSavePercentage.precentileRankPer20 * .33))
                ratingValueAndTitle(4, (playerPrecentileCalc.passesC.precentileRankPer20 * .75) + (playerPrecentileCalc.touches.precentileRankPer20 * .25))
                ratingValueAndTitle(5, (playerPrecentileCalc.bigErrors.precentileRankPer20 * .4) + (playerPrecentileCalc.errors.precentileRankPer20 * .3) + (playerPrecentileCalc.ownGoals.precentileRankPer20 * .3))

            } else if (gkOrOutfielder == "nonGk" && (playerPrecentileCalc.goals || playerPrecentileCalc.goals === 0)) {
                ratingValueAndTitle(0, (playerPrecentileCalc.shots.precentileRankPer20 * .25) + (playerPrecentileCalc.goals.precentileRankPer20 * .6) + (playerPrecentileCalc.bcm.precentileRankPer20 * .15))
                ratingValueAndTitle(1, (playerPrecentileCalc.assists.precentileRankPer20 * .5) + (playerPrecentileCalc.chancesCreated.precentileRankPer20 * .5))
                ratingValueAndTitle(2, (playerPrecentileCalc.passingA.precentileRankPer20 * .6) + (playerPrecentileCalc.passesC.precentileRankPer20 * .4))
                ratingValueAndTitle(3, (playerPrecentileCalc.touches.precentileRankPer20))
                ratingValueAndTitle(4, ((playerPrecentileCalc.duelsWon.precentileRankPer20 * 0.5) + ((playerPrecentileCalc.duelsP.precentileRankPer20 + 10) * 0.5)))
                ratingValueAndTitle(5, (playerPrecentileCalc.defensiveActions.precentileRankPer20 * .75) + (playerPrecentileCalc.errors.precentileRankPer20 * .075) + (playerPrecentileCalc.bigErrors.precentileRankPer20 * .15) + (playerPrecentileCalc.ownGoals.precentileRankPer20 * .025))
            } else {
                console.error("PLAYER DOES NOT FIT ANY POSITIONAL REQUIREMENTS")
            }

            let competitionStatsMetrics = gkOrOutfielder === "nonGk" ? ["goals", "assists", "ownGoals", "appearances", "minutes", "matchRating", "shots", "defensiveActions"] :
                ["saves", "goalsConceded", "gkSavePercentage", "appearances", "minutes", "matchRating", "bigErrors", "ownGoals"]

            function competitionStatsObj(num) {
                const competitionStatsItem = {}
                competitionStatsItem.value = playerTotalStats[competitionStatsMetrics[num]]
                competitionStatsItem.id = competitionStatsMetrics[num]
                competitionStatsValues.push(competitionStatsItem)
            }

            for (let metric = 0; metric < competitionStatsMetrics.length; metric++) {
                competitionStatsObj(metric)
            }

            if (gkOrOutfielder === "nonGk") {
                statData = {
                    shooting: {
                        goals: playerPrecentileCalc["goals"],
                        shots: playerPrecentileCalc["shots"],
                        bcm: playerPrecentileCalc["bcm"],
                    },
                    possession: {
                        touches: playerPrecentileCalc["touches"],
                    },
                    passing: {
                        assists: playerPrecentileCalc["assists"],
                        chancesCreated: playerPrecentileCalc["chancesCreated"],
                        passesC: playerPrecentileCalc["passesC"],
                        passingA: playerPrecentileCalc["passingA"],
                    },
                    defense: {
                        defensiveActions: playerPrecentileCalc["defensiveActions"],
                        duelsWon: playerPrecentileCalc["duelsWon"],
                        duelsP: playerPrecentileCalc["duelsP"],
                        errors: playerPrecentileCalc["errors"],
                        bigErrors: playerPrecentileCalc["bigErrors"],
                        ownGoals: playerPrecentileCalc["ownGoals"],
                    },
                };
            } else if (gkOrOutfielder === "gk") {
                statData = {
                    gkStats: {
                        saves: playerPrecentileCalc["saves"],
                        goalsConceded: playerPrecentileCalc["goalsConceded"],
                        gkSavePercentage: playerPrecentileCalc["gkSavePercentage"],
                        gkPunches: playerPrecentileCalc["gkPunches"],
                        gkRecovery: playerPrecentileCalc["gkRecovery"],
                        actedAsSweeper: playerPrecentileCalc["actedAsSweeper"],
                        errors: playerPrecentileCalc["errors"],
                        bigErrors: playerPrecentileCalc["bigErrors"],
                        ownGoals: playerPrecentileCalc["ownGoals"],
                    },
                    distribution: {
                        passingA: playerPrecentileCalc["passingA"],
                        passesC: playerPrecentileCalc["passesC"],
                        touches: playerPrecentileCalc["touches"],
                    },
                };
            }
            return {
                precentile: statData,
                ratings: playerRatings,
                competitionStats: competitionStatsValues
            }
        }
        
        var percentileAndRating = []
        var playerCompetitionStats = []
        if (mainPos) {
            var percentileAndRating = playerPercentiles(playerId, focusedPlayerTotalStats, playerGameStatsFormattedFP)
            var playerCompetitionStats = percentileAndRating.competitionStats
        }
        const playerPercentileInfo = focusedPlayerTotalStats.minutes > 25 ? percentileAndRating.precentile : []
        const playerRatings = focusedPlayerTotalStats.minutes > 25 ? percentileAndRating.ratings : []


        //=================================| PLAYER MATCH STATS |=================================
        //
        //

        function playerMatchStats(playerMatches, leagueData) {
            const playerMatchStats = []
            for (let match = 0; match < playerMatches.length; match++) {
                if (playerMatches && playerMatches[match]) {
                    const playerAndMatchInfo = {}
                    const matchInfo = playerMatches[match]

                    playerAndMatchInfo.matchId = matchInfo.matchId

                    playerAndMatchInfo.opponentTeamId = matchInfo.opponentTeamId
                    const opponentTeam = leagueData.teams.find(teams => teams.teamId === matchInfo.opponentTeamId)
                    playerAndMatchInfo.opponentTeamName = opponentTeam?.teamname || "N/A"
                    playerAndMatchInfo.opponentsLogo = opponentTeam?.logo || "https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/logoless?v=1742054547120"

                    playerAndMatchInfo.pageUrl = playerAndMatchInfo.matchId ? "/matches/" + playerAndMatchInfo.matchId + "/overview" : `/matches/-1`
                    playerAndMatchInfo.leagueKey = matchInfo.leagueId

                    const league = leagueData[leagueMap[matchInfo.leagueId]]
                    playerAndMatchInfo.leagueNameShort = league ? league.leagueDesc.leagueabbr : "N/A"
                    playerAndMatchInfo.matchRating = {
                        value: matchInfo.matchRating.toFixed(1),
                        backgroundColor: matchInfo.isMvp === true ? "var(--RATING-BLUE)" : matchInfo.matchRating < 5.5 ? "var(--RATING-RED)" : matchInfo.matchRating < 6.95 ? "var(--RATING-ORANGE)" : "var(--RATING-GREEN)"
                    }

                    playerAndMatchInfo.isHome = matchInfo.isHome
                    playerAndMatchInfo.isMvp = matchInfo.isMvp
                    playerAndMatchInfo.minutes = matchInfo.minutes
                    playerAndMatchInfo.goals = matchInfo.goals
                    playerAndMatchInfo.assists = matchInfo.assists
                    playerAndMatchInfo.touches = matchInfo.touches
                    playerAndMatchInfo.passesC = matchInfo.passesC
                    playerAndMatchInfo.scoreline = matchInfo.scoreline
                    playerMatchStats.push(playerAndMatchInfo)
                }
            }
            return playerMatchStats
        }
        const recentGames = playerMatchStats(focusedPlayerGameStats, teamData)

        return {
            ...player,
            totalStats: focusedPlayerTotalStats,
            rawStats: focusedPlayerGameStats,
            playerPositions: playerPositions,
            percentileStats: playerPercentileInfo,
            ratings: playerRatings,
            competitionStats: playerCompetitionStats,
            recentGames: recentGames,
        };
    } catch (err) {
        console.error(err);
    }
}

export default getPlayerInfo