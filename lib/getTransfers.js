async function getTransfers(leagueData, transfersData, playerData, nationData, positionData) {

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
    const transfers = transfersData.map((transfersPlayerInfo) => { //THE ARRAY CONTIANER EVERY TRANSFER
        const transfersPlayerBio = playerData.find(p => p.playerId === transfersPlayerInfo.playerId);
        const positions = positionData.find(p => p.playerId === transfersPlayerInfo.playerId);
        const currentTeam = leagueData.teams.find(t => t.teamId == transfersPlayerInfo.to);
        const formerTeam = leagueData.teams.find(t => t.teamId == transfersPlayerInfo.from);
        const transfersPlayerNation = transfersPlayerBio.nation;

        const transfer = {
            playerName: transfersPlayerBio.playername,
            to: transfersPlayerInfo.to,
            from: transfersPlayerInfo.from,
            currentTeamName: currentTeam?.teamname || "Unknown",
            currentTeamLogo: currentTeam?.logo || "",
            formerTeamName: formerTeam?.teamname || "Unknown",
            formerTeamLogo: formerTeam?.logo || "",
            nationLogo: nationData[transfersPlayerNation]?.flag || "",
            date: formatMatchTimestamp(transfersPlayerInfo.timestamp).matchDate,
            pageUrl: `/players/${transfersPlayerInfo.playerId}`,
            position: positions?.positions.find(pos => pos.isMainPos)?.id || "Unknown",
        };

        if (!positions) {
            console.warn(`No API data for playerId ${transfersPlayerInfo.playerId}`);
        }

        return transfer;
    });
    return transfers //THE ARRAY CONTIANER EVERY TRANSFER
}

export default getTransfers
