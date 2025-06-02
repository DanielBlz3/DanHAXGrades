import { NextResponse } from 'next/server';
import getTeamStats from '/lib/getTeamStats.js';
import exanonData from '/data/exanon.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';

export async function GET(req) {
    try {
        const activeLeagues = [...exanonLeagueS3.games, ...exanonCopaS3.games]
        const acceptedMatches  = activeLeagues.filter(m => m.started)
        const response = await getTeamStats(acceptedMatches, exanonData.teams)
        return NextResponse.json(response);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}