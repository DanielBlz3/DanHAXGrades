import { NextResponse } from 'next/server';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';
import exanonData from '/data/exanon.json';
import playersStorage from '/data/playersStorage.json';
import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';
import getPlayerStatsPerId from '/lib/getPlayerStatsPerId.js';

export async function GET(req) {
    try {
        const combinedLeagues = [...exanonLeagueS3?.games, ...exanonCopaS3?.games]
        const stats = await getPlayerStats(combinedLeagues)
        const playerPositions = await getPlayerPositions(stats, playersStorage)
        const response = await getPlayerStatsPerId(playersStorage, exanonData, stats, playerPositions);
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
