async function getLeagueFixtures(exanonData, leagueId, leagueMatchesData) {
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
        const gamesFormatted = leagueMatchesData.games.map(game => {

            const score = game.scoreline;
            var homeScore = 0
            var awayScore = 0
            if (game.scoreline) {
                var parts = score.split("-");
                homeScore = parseInt(parts[0], 10);
                awayScore = parseInt(parts[1], 10);
            }

            const homeTeamId = game?.teamIds[0] || -1;
            const awayTeamId = game?.teamIds[1] || -1

            const homeTeamData = exanonData.teams.find(team => team.teamId === homeTeamId);
            const awayTeamData = exanonData.teams.find(team => team.teamId === awayTeamId);

            const homeTeamName = homeTeamData?.teamname || "N/A";
            const awayTeamName = awayTeamData?.teamname || "N/A";

            const homeTeamLogo = homeTeamData?.logo || "";
            const awayTeamLogo = awayTeamData?.logo || "";
            
            const homeTeamNameShort = homeTeamData?.teamNameShort || "N/A";
            const awayTeamNameShort = awayTeamData?.teamNameShort || "N/A";

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
                    teamNameShort: homeTeamNameShort,
                    id: homeTeamId,
                    logo: homeTeamLogo,
                    score: homeScore,
                },
                away: {
                    teamName: awayTeamName,
                    teamNameShort: awayTeamNameShort,
                    id: awayTeamId,
                    logo: awayTeamLogo,
                    score: awayScore,
                }
            };
        });

        return gamesFormatted || [];
}
export default getLeagueFixtures