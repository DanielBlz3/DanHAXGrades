async function basicPlayerData(positionData, playerData, nationsJSON, playerId) {  
    const nation = nationsJSON[playerData.nation]
    const nationName = nation?.name || "N/A"
    const nationFlag = nation?.flag || "/images/teamLogos/12.png"
    const positions = positionData.find(p => p.playerId === playerId)
    const mainPositions = positions ? positions.positions?.find(pos => pos.isMainPos === true)?.id : "N/A"
    return {
        id: playerId,
        name: playerData.playername,
        nationName: nationName,
        nationFlag: nationFlag,
        position: mainPositions,
    }
 
}

export default basicPlayerData