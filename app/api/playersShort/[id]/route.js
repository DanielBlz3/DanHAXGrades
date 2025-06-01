
import { NextResponse } from 'next/server';
import exanonPreTempS3 from '/data/exanonpts3.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';
import playersStorage from '/data/playersStorage.json';
import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';
import basicPlayerData from '/lib/basicPlayerData';
import nationsJSON from '/data/nations.json';

export async function GET(req, { params }) {
    try {

        const playerId = Number(params.id)
        const playerData = playersStorage.find(p => p.playerId === playerId)

        const combinedLeagues = [...exanonPreTempS3?.games, ...exanonLeagueS3?.games, ...exanonCopaS3?.games]
        const stats = await getPlayerStats(combinedLeagues)
        const positionData = await getPlayerPositions(stats, playersStorage)
        
        const response = await basicPlayerData(positionData, playerData, nationsJSON, playerId)
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}