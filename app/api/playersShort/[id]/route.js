
import { NextResponse } from 'next/server';
import rsm11LeagueS1 from '/data/rsmls1.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';
import exanonData from '/data/exanon.json';
import playersStorage from '/data/playersStorage.json';
import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';
import basicPlayerData from '/lib/basicPlayerData';
import nationsJSON from '/data/nations.json';

export async function GET(req, { params }) {
    try {

        const playerId = Number(params.id)
        const playerData = playersStorage.find(p => p.playerId === playerId)

        const acceptedLeagues = [...exanonLeagueS3?.games, ...exanonCopaS3?.games, ...rsm11LeagueS1?.games]
        const stats = await getPlayerStats(acceptedLeagues)
        const positionData = await getPlayerPositions(stats, playersStorage)
        
        const response = await basicPlayerData(positionData, playerData, nationsJSON, playerId, exanonData.teams)
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}