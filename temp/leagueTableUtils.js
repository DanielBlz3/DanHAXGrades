const fetch = require('node-fetch');

async function getLeagueTable(exanonData, leagueId) {
    const url = `https://danhaxgrades.glitch.me/api/leagueFixtures/${leagueId}`;
    try {
        const res = await fetch(url);

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Error fetching data: ${res.status} - ${errorText}`);
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const fixturesData = await res.json() //WILL BE USED LEATER ON

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
        const participants = leagueDetails.leagueDesc.participants
        const tableLegend = leagueDetails.leagueDesc.legend
        console.log(participants)

        const leagueInfo = {
            leagueName: leagueDetails.leagueDesc.leaguename,
            leagueNameShort: leagueDetails.leagueDesc.leagueabbr,
            leagueId: leagueDetails.leagueDesc.leagueId,
            leagueURL: `/leagues/${leagueDetails.leagueDesc.leagueId}`,
            tableLegend: tableLegend,
            tableLength: participants.length
        }
        const table = []
        function leagueTable(groupNum) {
            const group = []
            for (const team of participants[groupNum]) {
                class teamTable {
                    constructor(team) {
                        this.matchesPlayed = 0
                        this.wins = 0
                        this.draws = 0
                        this.losses = 0
                        this.goalsFor = 0
                        this.goalsAllowed = 0
                        this.gdStr = "0-0"
                        this.gd = 0
                        this.pts = 0
                        const teamMatches = fixturesData.filter(match => [match.home.teamName, match.away.teamName].includes(team) && match.status.finished === true)
                        for (let match = 0; match < teamMatches.length; match++) {
                            const isHome = teamMatches[match].home.teamName === team;
                            const teamSide = isHome ? "home" : "away";
                            const opponentSide = isHome ? "away" : "home";
                            const teamScore = teamMatches[match][teamSide].score;
                            const opponentScore = teamMatches[match][opponentSide].score;
                            if (teamScore > opponentScore) {
                                this.wins += 1;
                            } else if (teamScore === opponentScore) {
                                this.draws += 1;
                            } else {
                                this.losses += 1;
                            }
                            this.goalsFor += teamScore;
                            this.goalsAllowed += opponentScore;
                            this.gdStr = (this.goalsFor + '-' + this.goalsAllowed)
                            this.gd = this.goalsFor - this.goalsAllowed
                            this.pts = ((this.wins * 3) + this.draws)
                        }

                        const teamId = exanonData.teams.find(teams => teams.teamname === team).teamId
                        if (!teamId) console.error("PARTICIPANT COULD NOT BE FONUD - GETTING LEAGUE TBALE")
                        const teamLogo = exanonData.teams.find(teams => teams.teamId === teamId).logo

                        this.teamName = team
                        this.teamId = teamId
                        this.teamLogo = teamLogo
                        this.teamURL = `/teams/${teamId}`
                        this.matchesPlayed = teamMatches.length
                    }
                }
                const teamTableObJ = new teamTable(team)
                group.push(teamTableObJ)
            }
            group.sort((a, b) => {
                if (b.pts !== a.pts) return b.pts - a.pts;
                const goalDiffA = a.goalsFor - a.goalsAllowed;
                const goalDiffB = b.goalsFor - b.goalsAllowed;
                if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
                return b.goalsFor - a.goalsFor;
            });

            group.forEach((team, index) => {
                const li = tableLegend.find(li => li.indices.includes(index + 1));
                team.idx = index + 1;
                if (li) {
                    team.color = li.color;
                } else {
                    team.color = null;
                }
            });
            
            return group
        }

        for (let index = 0; index < leagueDetails.leagueDesc.participants.length; index++) {
            table.push(leagueTable(index))
        }

        return {
            data: leagueInfo,
            table: table

        }

    } catch (error) {
        console.error(error);
        return { error: 'Server error' };
    }

}

module.exports = {
    getLeagueTable
};