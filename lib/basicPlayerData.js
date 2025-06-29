async function basicPlayerData(positionData, playerData, nationsJSON, playerId, teamData) {  
    const nation = nationsJSON[playerData.nation]
    const playerTeam = teamData.find(t => t.teamId === playerData.team)
    const teamName = playerTeam?.teamname || "N/A"
    const nationName = nation?.name || "N/A"
    const teamLogo = playerTeam?.logo || "/images/teamLogos/0.png"
    const nationFlag = nation?.flag || "/images/teamLogos/0.png"
    const positions = positionData.find(p => p.playerId === playerId)
    const mainPositions = positions ? positions.positions?.find(pos => pos.isMainPos === true)?.id : "N/A"
    return {
        id: playerId,
        name: playerData.playername,
        teamName: teamName,
        nationName: nationName,
        teamLogo: teamLogo,
        nationFlag: nationFlag,
        position: mainPositions,
    }
 
}

export default basicPlayerData