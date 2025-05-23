const fetch = require('node-fetch');

async function getLeagueData(leagueId, leagueData, signingsData, playerData, nationsData) {
    const fixturesUrl = `https://danhaxgrades.glitch.me/api/leagueFixtures/${leagueId}`;
    const tableUrl = `https://danhaxgrades.glitch.me/api/leaguetable/${leagueId}`;
    const leagueStatsUrl = `https://danhaxgrades.glitch.me/api/leagueStats`;
    const playerPosUrl = 'http://danhaxgrades.glitch.me/api/allPlayerPos';
    const playerStatsPerIdUrl = 'https://danhaxgrades.glitch.me/api/playerStatsPerId/';

    try {
        const resFixtures = await fetch(fixturesUrl);
        if (!resFixtures.ok) {
            const errorText = await resFixtures.text();
            console.error(`Error fetching fixtures: ${resFixtures.status} - ${errorText}`);
            throw new Error(`HTTP error (fixtures)! status: ${resFixtures.status}`);
        }
        const fixturesData = await resFixtures.json();

        const resTable = await fetch(tableUrl);
        if (!resTable.ok) {
            const errorText = await resTable.text();
            console.error(`Error fetching league table: ${resTable.status} - ${errorText}`);
            throw new Error(`HTTP error (table)! status: ${resTable.status}`);
        }
        const leagueTableData = await resTable.json();

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

        const statsPerIdRes = await fetch(playerStatsPerIdUrl);
        if (!statsPerIdRes.ok) {
            const errorText = await statsPerIdRes.text();
            console.error(`Error fetching data: ${statsPerIdRes.status} - ${errorText}`);
            throw new Error(`HTTP error! status: ${statsPerIdRes.status}`);
        }
        const playerStatsRaw = await statsPerIdRes.json()

        function findLeague(leagueId) {
            for (const key in leagueData) {
                if (leagueData[key].leagueDesc) {
                    if (leagueData[key].leagueDesc.leagueId === leagueId) {
                        return leagueData[key]
                    }
                }
            }
        }

        const leagueInfoObj = findLeague(leagueId)

        if (!leagueInfoObj) {
            throw new Error(`No league found for id: ${leagueId}`);
        }

        function leagueInfo() {
            return details = {
                id: leagueInfoObj.leagueDesc.leagueId,
                name: leagueInfoObj.leagueDesc.leaguename,
                logo: leagueInfoObj.leagueDesc.logo,
                color: leagueInfoObj.leagueDesc.color,
                shortName: leagueInfoObj.leagueDesc.leagueabbr,
                leagueStatus: leagueInfoObj.leagueDesc.leagueStatus,
                minForPer20Stats: leagueInfoObj.leagueDesc.minforPer20Stats,
                currentMatchday: leagueInfoObj.leagueDesc.currentMatchday,
            }
        }

        const leagueDetails = leagueInfo()

        function leagueFixtures() {
            return fixturesData
        }
        function leagueTables() {
            return leagueTableData
        }

        const leagueStatsData = exanonStatsData.filter(games => games.leagueId == leagueId)

        function playerStats() {
            var individualPlayerGameStatsPerId = playerStatsRaw

            function getTopPlayersByStat(data, statKey, topN = 3) {
                return data
                    .sort((a, b) => b[statKey] - a[statKey])
                    .slice(0, topN)
                    .map(player => ({
                        playerId: player.playerId,
                        playerName: playerData[player.playerId].playername,
                        value: player[statKey],
                        teamId: player.teamId,
                        teamName: player.teamName,
                        teamLogo: player.teamLogo,
                        teamColor: player.teamColor,
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
                teamId: player.teamId,
                teamName: player.teamName,
                teamLogo: player.teamLogo,
                teamColor: player.teamColor,
            }));

            const topPassingAccuracy = individualPlayerGameStatsPerId.filter(player => player.minutes >= 25).sort((a, b) => b.passingA - a.passingA).slice(0, 3).map(player => ({
                playerId: player.playerId,
                playerName: playerData[player.playerId].playername,
                value: `${Math.round(player.passingA * 1000) / 10}%`,
                teamId: player.teamId,
                teamName: player.teamName,
                teamLogo: player.teamLogo,
                teamColor: player.teamColor,
            }));

            const topDuelsWonPercentage = individualPlayerGameStatsPerId.filter(player => player.duelsWon >= 3).sort((a, b) => b.duelsP - a.duelsP).slice(0, 3).map(player => ({
                playerId: player.playerId,
                playerName: playerData[player.playerId].playername,
                value: `${Math.round(player.duelsP * 1000) / 10}%`,
                teamId: player.teamId,
                teamName: player.teamName,
                teamLogo: player.teamLogo,
                teamColor: player.teamColor,
            }));

            const topsavePercentage = individualPlayerGameStatsPerId.filter(player => player.saves >= 3).sort((a, b) => b.gkSavePercentage - a.gkSavePercentage).slice(0, 3).map(player => ({
                playerId: player.playerId,
                playerName: playerData[player.playerId].playername,
                value: `${Math.round(player.gkSavePercentage * 1000) / 10}%`,
                teamId: player.teamId,
                teamName: player.teamName,
                teamLogo: player.teamLogo,
                teamColor: player.teamColor,
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

            console.log(individualPlayerGameStatsPerId)
            function statToPer20(metric) {
                individualPlayerGameStatsPerId.forEach(player => {
                    player[`${metric}Per20`] = Math.round((player[metric] / (player.minutes / 20)) * 100) / 100;
                });
                topStatsObj[metric] = individualPlayerGameStatsPerId.filter(player => player.minutes >= 25).sort((a, b) => b[`${metric}Per20`] - a[`${metric}Per20`]).slice(0, 3).map(player => ({
                    playerId: player.playerId,
                    playerName: playerData[player.playerId].playername,
                    value: Math.round((player[metric] / (player.minutes / 20)) * 100) / 100,
                    teamId: player.teamName,
                    teamName: player.teamName,
                    teamLogo: player.teamLogo,
                    teamColor: player.teamColor,
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

            //ONLY PLAYERS WITH A CERTAIN AMONUT OF GAMES PLAYED OR MORE CAN ARE ALLOWE
            var topmatchRatings = individualPlayerGameStatsPerId.filter(player => player.minutes >= 25)
                .sort((a, b) => b.matchRating - a.matchRating).slice(0, 3).map(player => ({
                    playerId: player.playerId,
                    playerName: playerData[player.playerId].playername,
                    value: player.matchRating,
                    teamId: player.teamId,
                    teamName: player.teamName,
                    teamLogo: player.teamLogo,
                    teamColor: player.teamColor,
                }));

            function tots(matchday, totsArr) {
                const playerGameStats = matchday == "matchdayTOTS" ? individualPlayerGameStatsPerId :
                    leagueStatsData.filter(playerStat => playerStat.leagueRound == matchday)
                playerGameStats.sort((a, b) => b.matchRating - a.matchRating)

                if (matchday == "matchdayTOTS") {

                    var topStrikers = playerGameStats.filter(player => ["ST", "FWD"].includes(player.position) && player.minutes > 59).slice(0, 3)
                    var topWingers = playerGameStats.filter(player => ["LW", "RW", "RM", "LM"].includes(player.position) && player.minutes > 59).slice(0, 3)
                    var topMidfielders = playerGameStats.filter(player => ["AM", "CM", "DM", "MID"].includes(player.position) && player.minutes > 59).slice(0, 3)
                    var topFullbacks = playerGameStats.filter(player => ["LWB", "LB", "RWB", "RB"].includes(player.position) && player.minutes > 59).slice(0, 3)
                    var topCenterBacks = playerGameStats.filter(player => ["CB", "DEF"].includes(player.position) && player.minutes > 59).slice(0, 4)
                    var topGoalkeepers = playerGameStats.filter(player => ["GK"].includes(player.position) && player.minutes > 59).slice(0, 1)
                } else {

                    function totwFilterForPosition(allowedPos, playerNum) {
                        return playerGameStats.filter(player => allowedPos.includes(player.position)).slice(0, playerNum).map(player => ({
                            playerId: player.playerId,
                            playerName: playerData[player.playerId].playername,
                            playerName: playerData[player.playerId].playername,
                            matchRating: player.matchRating,
                            teamLogo: leagueData.teams.find(teams => teams.teamname === player.teamName).logo,
                            playerPosition: player.position, // ✅ this line here
                        }))
                    }
                    var topStrikers = totwFilterForPosition(["ST"], 3)
                    var topWingers = totwFilterForPosition(["LW", "RW", "RM", "LM"], 3)
                    var topMidfielders = totwFilterForPosition(["DM", "CM", "AM"], 3)
                    var topFullbacks = totwFilterForPosition(["LWB", "LB", "RWB", "RB"], 3)
                    var topCenterBacks = totwFilterForPosition(["CB"], 4)
                    var topGoalkeepers = totwFilterForPosition(["GK"], 1)
                }

                function findTotsPlayers() {
                    let totsLineup = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    const totsCoords = [
                        [50, 90], [10, 65], [36.6, 70], [63.3, 70], [90, 65], [20, 40], [50, 40], [80, 40],
                        [20, 15], [50, 15], [80, 15]
                    ]
                    totsLineup[0] = topGoalkeepers[0]

                    const isLB = pos => ["LB", "LWB"].includes(pos);
                    const isRB = pos => ["RB", "RWB"].includes(pos);
                    let lb = topFullbacks.find(p => isLB(p.playerPosition));
                    let rb = topFullbacks.find(p => isRB(p.playerPosition));
                    if (!lb) lb = topCenterBacks[2];
                    if (!rb) rb = topCenterBacks[3];
                    totsLineup[1] = lb;
                    totsLineup[4] = rb;

                    totsLineup[2] = topCenterBacks[0]
                    totsLineup[3] = topCenterBacks[1]

                    totsLineup[5] = topMidfielders[0]
                    totsLineup[6] = topMidfielders[1]
                    totsLineup[7] = topMidfielders[2]

                    const isLW = pos => ["LM", "LW"].includes(pos);
                    const isRW = pos => ["RM", "RW"].includes(pos);
                    let lw = topWingers.find(p => isLW(p.playerPosition));
                    let rw = topWingers.find(p => isRW(p.playerPosition));
                    if (!lw) lw = topStrikers[1];
                    if (!rw) rw = topStrikers[2]
                    totsLineup[8] = lw;
                    totsLineup[10] = rw;

                    totsLineup[9] = topStrikers[0]

                    totsArr.push(totsLineup)

                    for (let player = 0; player < totsLineup.length; player++) {
                        if (totsLineup[player]) {
                            totsLineup[player].coords = {
                                x: totsCoords[player][0],
                                y: totsCoords[player][1],
                            }
                        }
                    }
                }
                findTotsPlayers()
            }

            const totsArr = []
            for (let matchDay = 1; matchDay < leagueDetails.currentMatchday; matchDay++) {
                tots(matchDay, totsArr)
            }

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
                totw: totsArr
            };

        }

        function getSingings(signingsData) {
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
            const signings = []
            for (let singingMade = 0; singingMade < signingsData.length; singingMade++) {
                const singing = {}
                const signingsPlayerInfo = signingsData[singingMade]
                const singingsPlayerBio = playerData.find(players => players.playerId === signingsPlayerInfo.playerId)
                singing.playerName = singingsPlayerBio.playername
                const positions = allPlayerPosData.find(p => p.playerId === signingsPlayerInfo.playerId);
                const currentTeam = leagueData.teams.find(teams => teams.teamId == signingsPlayerInfo.to)
                const formerTeam = leagueData.teams.find(teams => teams.teamId == signingsPlayerInfo.from)
                const signingsPlayerNation = singingsPlayerBio.nation
                singing.to = signingsPlayerInfo.to
                singing.from = signingsPlayerInfo.from
                singing.currentTeamName = currentTeam.teamname
                singing.currentTeamLogo = currentTeam.logo
                singing.formerTeamName = formerTeam.teamname
                singing.formerTeamLogo = formerTeam.logo
                singing.nationLogo = nationsData[signingsPlayerNation].flag
                singing.date = formatMatchTimestamp(signingsPlayerInfo.timestamp).matchDate
                singing.pageUrl = `/players/${signingsPlayerInfo.playerId}`
                signings.push(singing)
                if (positions) {
                    const mainPosObj = positions.positions.find(pos => pos.isMainsPos) || {};
                    singing.signingsPosition = mainPosObj.id || "Unknown";
                } else {
                    console.warn(`No API data for playerId ${playerId}`);
                }
            }
            return signings
        }

        const fixtures = leagueFixtures()
        const leagueTable = leagueTables()
        const topPlayerStats = playerStats()
        const signings = getSingings(signingsData)

        return {
            leagueDetails: leagueDetails,
            fixtures: fixtures,
            table: leagueTable,
            signings: signings,
            topPlayerStats: topPlayerStats
        }

    } catch (error) {
        console.error(error);
        return { error: 'Server error' };
    }
}

module.exports = {
    getLeagueData
};