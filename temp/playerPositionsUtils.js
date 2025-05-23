const formationsPositions = {
    "fourthreethree": ["GK", "LB", "CB", "CB", "RB", "CM", "DM", "CM", "LW", "ST", "RW"],
    "fourtwothreeone": ["GK", "LB", "CB", "CB", "RB", "DM", "AM", "DM", "LW", "ST", "RW"],
    "fourfourtwo": ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "CM", "RM", "ST", "ST"],
    "fouronefourone": ["GK", "LB", "CB", "CB", "RB", "DM", "LM", "AM", "AM", "RM", "ST"],
    "threefourthree": ["GK", "CB", "CB", "CB", "LM", "CM", "CM", "RM", "LW", "ST", "RW"],
    "threetwothreetwo": ["GK", "CB", "CB", "CB", "DM", "DM", "LM", "CAM", "RM", "ST", "ST"],
    "fourthreetwoone": ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "AM", "AM", "ST"],
    "fourtwofour": ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "LW", "ST", "ST", "RW"],
    "fivefourone": ["GK", "LWB", "CB", "CB", "CB", "RWB", "LM", "CM", "CM", "RM", "ST"],
    "threetwotwothree": ["GK", "CB", "CB", "CB", "DM", "DM", "AM", "AM", "LW", "ST", "RW"],
    "fouronetwoonetwo": ["GK", "LB", "CB", "CB", "RB", "DM", "CM", "CM", "AM", "ST", "ST"],
    "threefivetwo": ["GK", "CB", "CB", "CB", "LM", "CM", "CM", "CM", "RM", "ST", "ST"],
}

const allowedPositionsForEachPosition = {
    "ST": ["ST", "FWD"],
    "LW": ["LW", "RW", "AM"],
    "RW": ["LW", "RW", "AM"],
    "AM": ["LW", "RW", "AM"],
    "LM": ["CM", "DM", "LM", "RM", "MID"],
    "RM": ["CM", "DM", "LM", "RM", "MID"],
    "CM": ["CM", "DM", "LM", "RM", "MID"],
    "LWB": ["LB", "RB", "LWB", "RWB"],
    "RWB": ["LB", "RB", "LWB", "RWB"],
    "DM": ["CM", "DM", "LM", "RM", "MID"],
    "LB": ["LB", "RB", "LWB", "RWB"],
    "RB": ["LB", "RB", "LWB", "RWB"],
    "CB": ["CB", "DEF"],
    "GK": ["GK"]
};

function getPlayerPositionFromGame(formation, playerIndex) {
    if (formationsPositions[formation]) {
        return formationsPositions[formation][playerIndex] || false
    } else {
        return ""
    }
}

function getPlayerPool(team, match, individualPlayerData, rawPlayersGameStats) {
    var teamSide = team === "homeplayers" ? 0 : 1
    let game = individualPlayerData[match];
    if (game) {
        game.playerslist[team].forEach((clonedPlayer, playerIndex) => {
            const player = {
                playerId: clonedPlayer.playerId,
                playerIndex: playerIndex,
                position: getPlayerPositionFromGame(game.formation[teamSide], playerIndex)
            }
            rawPlayersGameStats.push(player);
        });
    }
}

function getAllPlayerPos(matches, allPlayerPositions, playerId) {
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
    for (const position in allowedPositionsForEachPosition) {
        const matchesLength = matches.length
        let matchesForPosition = matches.filter(player => player.position === position)

        if (matchesForPosition.length > 0) {
            let playerPositionItem = {}
            playerPositionItem.id = position
            playerPositionItem.occurences = matchesForPosition.length
            if (position !== mainPosition) playerPositionItem.ratio = playerPositionItem.occurences / matchesLength;
            playerPositionItem.isMainsPos = position === mainPosition ? true : false
            playerPositionsArr.push(playerPositionItem)
        }
    }

    const positionObj = {
        playerId: playerId,
        positions: playerPositionsArr
    }

    allPlayerPositions.push(positionObj)
}

module.exports = {
    getPlayerPositionFromGame,
    getPlayerPool,
    getAllPlayerPos,
}