async function basicPlayerData(positionData, playerData, nationsJSON, playerId, teamData, rsmData) {
    const nation = nationsJSON[playerData.nation]
    const playerTeam = teamData.find(t => t.teamId === playerData.team)
    const teamName = playerTeam?.teamname || "N/A"
    const nationName = nation?.name || "N/A"
    const teamLogo = playerTeam?.logo || "/images/teamLogos/0.png"
    const nationFlag = nation?.flag || "/images/teamLogos/0.png"
    let rsmTeam = rsmData?.find(t => t.id === playerTeam.rsmId)
    let avatar
    if (rsmTeam) {
        let rsmPlayerData = rsmTeam.players.find(p => p.id == playerData.rsmId)
        avatar = rsmPlayerData?.avatarURL || "/images/defaulticon.png";
    } else {
        avatar = "/images/defaulticon.png"
    }
    const positions = positionData.find(p => p.playerId === playerId)
    const mainPositions = positions ? positions.positions?.find(pos => pos.isMainPos === true)?.id : "N/A"
    return {
        id: playerId,
        name: playerData.playername,
        teamName: teamName,
        nationCode: playerData.nation,
        nationName: nationName,
        teamLogo: teamLogo,
        nationFlag: nationFlag,
        position: mainPositions,
        avatar: avatar,
    }
}

export default basicPlayerData