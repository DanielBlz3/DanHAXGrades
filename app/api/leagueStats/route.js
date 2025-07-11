import { NextResponse } from 'next/server';
import rsm11LeagueS1 from '/data/rsmls1.json';
import getPlayerStats from '/lib/getPlayerStats.js';


export async function GET(req) {
    try {
        rsm11LeagueS1.games.forEach(game => { game.leagueId = 9 });
        const activeLeagues = [...rsm11LeagueS1.games]    
        const stats = await getPlayerStats(activeLeagues)      
          
        return NextResponse.json(stats);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}