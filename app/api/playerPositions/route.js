
import { NextResponse } from 'next/server';
import rsm11LeagueS1 from '/data/rsmls1.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';
import playersStorage from '/data/playersStorage.json';
import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';


export async function GET(req) {
    try {
        const acceptedLeagues = [...exanonLeagueS3?.games, ...exanonCopaS3?.games, ... rsm11LeagueS1?.games]
        const stats = await getPlayerStats(acceptedLeagues)
        const response = await getPlayerPositions(stats, playersStorage)
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}