const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs').promises; // <-- use the PROMISE version of fs
const exanonDataLeagueS3 = 'https://raw.githubusercontent.com/DanielBlz3/exanon-data/refs/heads/main/exanonls3.json';
const exanonDataCopaS3 = 'https://raw.githubusercontent.com/DanielBlz3/exanon-data/refs/heads/main/exanoncs3.json';
const exanonDataPreSeasonS3 = 'https://raw.githubusercontent.com/DanielBlz3/exanon-data/refs/heads/main/exanonpts3.json';

const { getPlayerInfo } = require('./playerStatsUtils');
const { getLeagueStats } = require('./leagueStatsUtils');
const { getPlayerStatsPerId } = require('./playerStatsPerId');
const { generalMatchData, matchStatus, matchPlayersStats, getMatchStats } = require('./gameDetailsUtils');
const { leagueMatches } = require('./leagueFixturesUtils');
const { getPlayerPool, getAllPlayerPos } = require('./playerPositionsUtils');
const { getLeagueTable } = require('./leagueTableUtils');
const { getLeagueData } = require('./leagueUtils');
const { getTeamData } = require('./teamUtils');
const { getTransfers } = require('./transfersUtils');
const { connect } = require('http2');

app.use(express.static('public'));

app.get('/games/:id/:slug?', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'games.html'));
});
app.get('/leagues/:id/:slug?', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'leagues.html'));
});
app.get('/players/:id/:slug?', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'players.html'));
});
app.get('/teams/:id/:slug?', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'teams.html'));
});

app.get('/api/matchDetails/:id/:slug?', async (req, res) => {
    const matchId = Number(req.params.id);
    const [compReq, leagueId] = matchId >= 100
        ? ['https://raw.githubusercontent.com/DanielBlz3/exanon-data/refs/heads/main/exanoncs3.json', 3]
        : matchId >= 35
            ? ['https://raw.githubusercontent.com/DanielBlz3/exanon-data/refs/heads/main/exanonls3.json', 2]
            : ['https://raw.githubusercontent.com/DanielBlz3/exanon-data/refs/heads/main/exanonpts3.json', 1];
    try {
        const [leagueData, compData, players, nations] = await Promise.all([
            fs.readFile(__dirname + '/public/exanonLeagues.json', 'utf8'),
            fetch(compReq).then(res => res.json()),
            fs.readFile(__dirname + '/public/playersStorage.json', 'utf8'),
            fs.readFile(__dirname + '/public/nations.json', 'utf8'),
        ]);
        function getLeagueByGameId(data, gameId) {
            for (const leagueKey in data) {
                const league = data[leagueKey];
                for (const matchdayKey in league) {
                    if (matchdayKey === "leagueDesc") continue;
                    const matchday = league[matchdayKey];

                    for (const gameKey in matchday) {
                        if (matchday[gameKey].id === gameId) {
                            return league; // 🔥 return the full league object
                        }
                    }
                }
            }
            return null;
        }
        const leagueDataParsed = JSON.parse(leagueData)
        const playerData = JSON.parse(players)
        const nationsData = JSON.parse(nations)
        const teamData = leagueDataParsed.teams
        const matchData = compData.games.find(games => games.gameId == matchId);
        const matchleagueData = getLeagueByGameId(leagueDataParsed, matchId)
        const generalMatchDetails = generalMatchData(matchId, matchleagueData, leagueId, teamData, matchData)
        const matchStatusDetails = matchStatus(matchData)
        const playerStatsData = matchPlayersStats(matchData, playerData, teamData, nationsData)
        const matchStats = getMatchStats(Object.entries(playerStatsData.home.players), Object.entries(playerStatsData.away.players))
        const response = {
            general: generalMatchDetails,
            matchStatus: matchStatusDetails,
            lineup: playerStatsData,
            topStats: matchStats,
        }
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/api/leagueStats', async (req, res) => {
    try {
        const [exanonLeagueData, exanonCupData] = await Promise.all([
            fetch(exanonDataLeagueS3).then(res => res.json()),
            fetch(exanonDataCopaS3).then(res => res.json()),
        ]);

        if (!exanonLeagueData || !exanonCupData) {
            return res.status(404).send('API not found.');
        }

        exanonLeagueData.games.forEach(game => {
            game.leagueId = 2
        });
        exanonCupData.games.forEach(game => {
            game.leagueId = 3
        });

        const leagueStats = await getLeagueStats(exanonLeagueData, exanonCupData);

        res.json(leagueStats);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/playerStatsPerId', async (req, res) => {
    try {
        const [playerData, exanonData] = await Promise.all([
            fs.readFile(__dirname + '/public/playersStorage.json', 'utf8'),
            fs.readFile(__dirname + '/public/exanonLeagues.json', 'utf8'),
        ]);
        const playerDataParsed = JSON.parse(playerData)
        const exanonDataParsed = JSON.parse(exanonData)

  
        const playersStatsPerId = await getPlayerStatsPerId(playerDataParsed.player, exanonDataParsed);

        res.json(playersStatsPerId);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

const leagueStatsData = "https://danhaxgrades.glitch.me/api/leagueStats"

app.get('/api/allPlayerPos', async (req, res) => {
    try {
        const [leagueData, compData, preseasonData, playerData] = await Promise.all([
            fetch(exanonDataLeagueS3).then(res => res.json()),
            fetch(exanonDataCopaS3).then(res => res.json()),
            fetch(exanonDataPreSeasonS3).then(res => res.json()),            
            fs.readFile(__dirname + '/public/playersStorage.json', 'utf8'),
        ]);

         const individualPlayerData = [...leagueData.games, ...compData.games, ...preseasonData.games]
        const playerDataParsed = JSON.parse(playerData).player
        const playerDataLength = playerDataParsed.length + 1
        let rawPlayersGameStats = []

        for (let match = 0; match < individualPlayerData.length; match++) {
            getPlayerPool("homeplayers", match, individualPlayerData, rawPlayersGameStats);
            getPlayerPool("awayplayers", match, individualPlayerData, rawPlayersGameStats);
        }
        
        const allPlayerPositions = []

        for (let playerId = 1; playerId < playerDataLength; playerId++) {
            getAllPlayerPos(rawPlayersGameStats.filter(players => players.playerId === playerId), allPlayerPositions, playerId)
        }
        const response = allPlayerPositions
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.get('/api/leagueFixtures/:id/:slug?', async (req, res) => {
    try {
        const [exanonData] = await Promise.all([
            fs.readFile(__dirname + '/public/exanonLeagues.json', 'utf8'),
        ])
        const exanonDataParsed = JSON.parse(exanonData);
        const leagueId = Number(req.params.id);
        const response = await leagueMatches(exanonDataParsed, leagueId)
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

})

app.get('/api/leagueTable/:id/:slug?', async (req, res) => {
    try {
        const [exanonData] = await Promise.all([
            fs.readFile(__dirname + '/public/exanonLeagues.json', 'utf8'),
        ])
        const exanonDataParsed = JSON.parse(exanonData);
        const leagueId = Number(req.params.id);
        const response = await getLeagueTable(exanonDataParsed, leagueId)
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

})

app.get('/api/exanontransfers', async (req, res) => {
    try {
        const [exanonDataJson, singingsJson, playersJson, nationsJson] = await Promise.all([
            fs.readFile(__dirname + '/public/exanonLeagues.json', 'utf8'),
            fs.readFile(__dirname + '/public/signings.json', 'utf8'),
            fs.readFile(__dirname + '/public/playersStorage.json', 'utf8'),
            fs.readFile(__dirname + '/public/nations.json', 'utf8'),
        ]);
        
        const exanonData = JSON.parse(exanonDataJson);
        const singingData = JSON.parse(singingsJson);
        const playerData = JSON.parse(playersJson);
        const nationData = JSON.parse(nationsJson);

        const response = await getTransfers(exanonData, singingData, playerData.player, nationData)
        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/players/:id/:slug?', async (req, res) => {
    try {
        const [playersRawData, leagueData, cupData, teamData, nationData] = await Promise.all([
            fs.readFile(__dirname + '/public/playersStorage.json', 'utf8'),
            fetch(exanonDataLeagueS3).then(res => res.json()),
            fetch(exanonDataCopaS3).then(res => res.json()),
            fs.readFile(__dirname + '/public/exanonLeagues.json', 'utf8'),
            fs.readFile(__dirname + '/public/nations.json', 'utf8'),
        ]);

        const playerData = JSON.parse(playersRawData);
        const playerId = Number(req.params.id);
        const player = playerData.player[playerId];
        const nations = JSON.parse(nationData);
        const teamObj = JSON.parse(teamData);

        const playerInfo = await getPlayerInfo(playerData, playerId, player, leagueData, cupData, nations, teamObj);

        res.json(playerInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/leagues/:id/:slug?', async (req, res) => {
    try {
        const [leagueJson, signingsData, playersJson, nationsJson] = await Promise.all([
            fs.readFile(__dirname + '/public/exanonLeagues.json', 'utf8'),
            fs.readFile(__dirname + '/public/signings.json', 'utf8'),
            fs.readFile(__dirname + '/public/playersStorage.json', 'utf8'),
            fs.readFile(__dirname + '/public/nations.json', 'utf8'),
        ]);

        const signingsDataParsed = JSON.parse(signingsData);
        const leagueData = JSON.parse(leagueJson);
        const playerData = JSON.parse(playersJson);
        const nationsData = JSON.parse(nationsJson);
        const leagueId = Number(req.params.id);

        const response = await getLeagueData(Number(leagueId), leagueData, signingsDataParsed, playerData.player, nationsData)
        console.log(response)
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.get('/api/teams/:id/:slug?', async (req, res) => {
    try {
        const [leagueJson, signingsData, playersJson, nationsJson] = await Promise.all([
            fs.readFile(__dirname + '/public/exanonLeagues.json', 'utf8'),
            fs.readFile(__dirname + '/public/signings.json', 'utf8'),
            fs.readFile(__dirname + '/public/playersStorage.json', 'utf8'),
            fs.readFile(__dirname + '/public/nations.json', 'utf8'),
        ]);

        const signingsDataParsed = JSON.parse(signingsData);
        const leagueData = JSON.parse(leagueJson);
        const playerData = JSON.parse(playersJson);
        const nationsData = JSON.parse(nationsJson);
        const teamId = Number(req.params.id);

        const response = await getTeamData(Number(teamId), leagueData, signingsDataParsed, playerData.player, nationsData)
        console.log(response)
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying another port...`);
        app.listen(0);
    } else {
        console.error(err);
    }
});