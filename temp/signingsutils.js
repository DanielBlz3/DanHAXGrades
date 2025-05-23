const fetch = require('node-fetch');

async function getTransfers(leagueData, singingData, playerData, nationData) {
    const playerPosUrl = 'http://danhaxgrades.glitch.me/api/allPlayerPos';
    const resPlayerPos = await fetch(playerPosUrl);
    if (!resPlayerPos.ok) {
        const errorText = await resPlayerPos.text();
        console.error(`Error fetching league table: ${resPlayerPos.status} - ${errorText}`);
        throw new Error(`HTTP error (table)! status: ${resPlayerPos.status}`);
    }
    const allPlayerPosData = await resPlayerPos.json();

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
    for (let singingMade = 0; singingMade < singingData.length; singingMade++) {
        const singing = {}
        const signingsPlayerInfo = singingData[singingMade]
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
        singing.nationLogo = nationData[signingsPlayerNation].flag
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

module.exports = {
    getTransfers
};
