import { NextResponse } from 'next/server';
import playersStorage from '/data/playersStorage.json';
import exanonData from '/data/exanon.json';
import nationsJSON from '/data/nations.json';
import transfersJSON from '/data/transfers.json';
import exanonPreTempS3 from '/data/exanonpts3.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';
import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';
import getTransfers from '/lib/getTransfers.js';

export async function GET(req, { params }) {
  try {
    const combinedLeagues = [...exanonPreTempS3?.games, ...exanonLeagueS3?.games, ...exanonCopaS3?.games]
    const stats = await getPlayerStats(combinedLeagues)
    const positions = await getPlayerPositions(stats, playersStorage)
    const response = await getTransfers(exanonData, transfersJSON, playersStorage, nationsJSON, positions)
    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}