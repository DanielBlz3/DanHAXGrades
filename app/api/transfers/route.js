import { NextResponse } from 'next/server';
import playersStorage from '/data/playersStorage.json';
import exanonData from '/data/exanon.json';
import nations from '/data/nations.json';
import transfersJSON from '/data/transfers.json';
import exanonPreTempS3 from '/data/exanonpts3.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';

import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';
import getTransfers from '/lib/getTransfers.js';
import basicPlayerData from '/lib/basicPlayerData';


export async function GET(req, { params }) {
  try {
    const res = await fetch('http://140.84.180.81:3000/api/teams/full'); //RUDIGER'S API
    const rsmData = await res.json();
    const combinedLeagues = [...exanonPreTempS3?.games, ...exanonLeagueS3?.games, ...exanonCopaS3?.games]
    const stats = await getPlayerStats(combinedLeagues)
    const positions = await getPlayerPositions(stats, playersStorage)
    const validPlayers = playersStorage.filter(
      (player) => player && player.playerId && player.playerId !== 0
    );
    const allPlayers = await Promise.all(
      validPlayers.map(async (player) => {
        if (player) {
          if (player.playerId) {
            const response = await basicPlayerData(positions, player, nations, player.playerId, exanonData.teams, rsmData);
            return response
          }
        } else {
          return null
        }
      })
    );
    const response = await getTransfers(exanonData, transfersJSON, allPlayers, positions)
    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}