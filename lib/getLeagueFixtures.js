import getMatchStatus from '/lib/getMatchStatus.js';

const roundMap = {
    "1/1": "Finals",
    "1/2": "Semi_Finals",
    "1/4": "Quarter_Finals",
    "1/8": "Round_Of_16",
    "1/16": "Round_Of_32"
}

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


    const matchesFormatted = leagueMatchesData.games.map(match => {
        const status = getMatchStatus(match)

        const score = match.scoreline;
        var homeScore = 0
        var awayScore = 0
        if (match.scoreline) {
            var parts = score.split("-");
            homeScore = parseInt(parts[0], 10);
            awayScore = parseInt(parts[1], 10);
        }

        const homeTeamId = match?.teamIds[0] || -1;
        const awayTeamId = match?.teamIds[1] || -1

        const homeTeamData = exanonData.teams.find(team => team.teamId === homeTeamId);
        const awayTeamData = exanonData.teams.find(team => team.teamId === awayTeamId);

        const homeTeamName = homeTeamData?.teamname || "N/A";
        const awayTeamName = awayTeamData?.teamname || "N/A";

        const homeTeamLogo = homeTeamData?.logo || "";
        const awayTeamLogo = awayTeamData?.logo || "";

        const homeTeamNameShort = homeTeamData?.teamNameShort || "N/A";
        const awayTeamNameShort = awayTeamData?.teamNameShort || "N/A";

        return {
            id: match.gameId,
            pageUrl: "/matches/" + match.gameId + "/overview",
            hasStarted: match.started,
            timestamp: match.timestamp || "",
            leagueRound: match.leagueRound,
            roundNumber: match.roundNumber,
            roundName: roundMap[match.leagueRound] || String(match.leagueRound),
            status: status,
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

    return matchesFormatted || [];
}
export default getLeagueFixtures