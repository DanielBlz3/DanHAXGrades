import { NextResponse } from 'next/server';
import getTeamStats from '/lib/getTeamStats.js';
import exanonData from '/data/exanon.json';
import rsm11LeagueS1 from '/data/rsmls1.json';

export async function GET(req) {
    try {
        const activeLeagues = [...rsm11LeagueS1?.games]
        const acceptedMatches  = activeLeagues.filter(m => m.started)
        const response = await getTeamStats(acceptedMatches, exanonData.teams)
        return NextResponse.json(response);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}