import { NextResponse } from 'next/server';
import playersStorage from '/data/playersStorage.json';
import exanonData from '/data/exanon.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';
import nationsJSON from '/data/nations.json';
import getPlayerInfo from '/lib/getPlayerInfo.js';
import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';
import getPlayerStatsPerId from '/lib/getPlayerStatsPerId.js';

export async function GET(req, { params }) {
  try {
    const playerId = Number(params.id);
    const player = playersStorage.find(p => p.playerId === playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    };
    exanonLeagueS3.games.forEach(game => { game.leagueId = 2 }); exanonCopaS3.games.forEach(game => { game.leagueId = 3 });
    const combinedLeagues = [...exanonLeagueS3?.games, ...exanonCopaS3?.games]
    const stats = await getPlayerStats(combinedLeagues)
    const playerPositions = await getPlayerPositions(stats, playersStorage)
    const playerStatsPerId = await getPlayerStatsPerId(playersStorage, exanonData, stats, playerPositions);

    const playerInfo = await getPlayerInfo(playerId, player, nationsJSON, exanonData, playerPositions, playerStatsPerId, stats);
    return NextResponse.json(playerInfo);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}