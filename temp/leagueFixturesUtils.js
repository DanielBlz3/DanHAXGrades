const fetch = require("node-fetch");


async function leagueMatches(exanonData, leagueId) {
    function findLeague(leagueId) {
        for (const key in exanonData) {
            if (
                exanonData[key] &&
                exanonData[key].leagueDesc &&
                exanonData[key].leagueDesc.leagueId === leagueId
            ) {
                return exanonData[key];
            }
        }
        console.error("League not found");
        return null;
    }

    const leagueDetails = findLeague(leagueId);
    if (!leagueDetails || !leagueDetails.leagueDesc) return [];

    const leagueJson = leagueDetails.leagueDesc.leagueJSON;

    try {
        
        const url = `https://raw.githubusercontent.com/DanielBlz3/exanon-data/main/${leagueJson}`
        console.log(`https://raw.githubusercontent.com/DanielBlz3/exanon-data/main/${leagueJson}`)
        const res = await fetch(url);

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Error fetching data: ${res.status} - ${errorText}`);
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json() //WILL BE USED LEATER ON

        function gameStatusTest(match) {
            if (match.awarded === true) {
                match.statusShort = "W.O";
            } else if (match.cancelled === true) {
                match.statusShort = "TBC";
            } else if (match.started === true) {
                if (match.finished === true) {
                    match.statusShort = "FT";
                } else if (match.extraTime === true) {
                    match.statusShort = "AET";
                } else if (match.finished === false) {
                    match.statusShort = "Live";
                } else {
                    match.statusShort = "Unknown";
                }
            } else {
                match.statusShort = "";
            }
        }
        const gamesFormatted = data.games.map(game => {

            const score = game.scoreline;
            var homeScore = 0
            var awayScore = 0
            if (game.scoreline) {
                var parts = score.split("-");
                homeScore = parseInt(parts[0], 10);
                awayScore = parseInt(parts[1], 10);
            }

            const homeTeamName = game.teamnames[0];
            const awayTeamName = game.teamnames[1];

            const homeTeamData = exanonData.teams.find(team => team.teamname === homeTeamName);
            const awayTeamData = exanonData.teams.find(team => team.teamname === awayTeamName);

            const homeTeamId = homeTeamData ? homeTeamData.teamId : null;
            const awayTeamId = awayTeamData ? awayTeamData.teamId : null;

            const homeTeamLogo = homeTeamData && homeTeamData.logo ? homeTeamData.logo : "";
            const awayTeamLogo = awayTeamData && awayTeamData.logo ? awayTeamData.logo : "";

            return {
                id: game.gameId,
                pageUrl: "/games/" + game.gameId,
                hasStarted: game.started,
                timestamp: game.timestamp || "",
                leagueRound: game.leagueRound,
                status: {
                    finished: typeof game.finished === 'boolean' ? game.finished : false,
                    started: typeof game.started === 'boolean' ? game.started : false,
                    cancelled: game.cancelled || false,
                    awarded: game.awarded || false,
                    statusShort: gameStatusTest(game),
                },
                home: {
                    teamName: homeTeamName,
                    id: homeTeamId,
                    logo: homeTeamLogo,
                    score: homeScore,
                },
                away: {
                    teamName: awayTeamName,
                    id: awayTeamId,
                    logo: awayTeamLogo,
                    score: awayScore,
                }
            };
        });

        return gamesFormatted || [];
    } catch (err) {
        console.error("Fetch error:", err);
        return [];
    }
}

module.exports = {
    leagueMatches
};
