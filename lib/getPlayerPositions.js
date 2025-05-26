import positions from '/lib/positions.json';
async function getPlayerPositions(rawPlayersGameStats, playersStorage) {

    const allPlayerPositions = []
    function getAllPlayerPos(matches, playerId) {
        function findMainPos() {
            let positionCounts = {};

            for (const match of matches) {
                if (match.position) {
                    let pos = match.position;
                    if (!positionCounts[pos]) {
                        positionCounts[pos] = 0;
                    }
                    positionCounts[pos]++;
                }
            }

            let maxCount = Math.max(...Object.values(positionCounts));
            let tiedPositions = Object.keys(positionCounts).filter(pos => positionCounts[pos] === maxCount);

            if (tiedPositions.includes("false") && tiedPositions.length > 1) {
                tiedPositions = tiedPositions.filter(pos => pos !== "false");
            }
            let mainPosition = tiedPositions[tiedPositions.length - 1];
            return mainPosition
        }

        const mainPosition = findMainPos()
        const playerPositionsArr = []
        for (let i = 0; i < positions.length; i++) {
            const posId = positions[i]; // e.g. "CM", "LB"
            const matchesForPosition = matches.filter(player => player.position === posId);

            if (matchesForPosition.length > 0) {
                const playerPositionItem = {
                    id: posId,
                    occurences: matchesForPosition.length,
                    isMainPos: posId === mainPosition,
                };
                if (posId !== mainPosition) {
                    playerPositionItem.ratio = matchesForPosition.length / matches.length;
                }
                playerPositionsArr.push(playerPositionItem);
            }
        }

        const positionObj = {
            playerId: playerId,
            positions: playerPositionsArr
        }
        allPlayerPositions.push(positionObj)
    }


   for (let i = 1; i < playersStorage.length; i++) {
    const playerId = playersStorage[i].playerId;
    const matches = rawPlayersGameStats.filter(p => p.playerId === playerId);
    getAllPlayerPos(matches, playerId);
}

    return allPlayerPositions
}

export default getPlayerPositions