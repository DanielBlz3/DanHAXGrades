import { NextResponse } from 'next/server';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';
import getPlayerStats from '/lib/getPlayerStats.js';


export async function GET(req) {
    try {
        exanonLeagueS3.games.forEach(game => { game.leagueId = 2 }); exanonCopaS3.games.forEach(game => { game.leagueId = 3 });
        const individualPlayerData = [...exanonLeagueS3.games, ...exanonCopaS3.games]    
        const stats = await getPlayerStats(individualPlayerData)      
          
        return NextResponse.json(stats);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}