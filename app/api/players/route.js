
import { NextResponse } from 'next/server';
import exanonPreTempS3 from '/data/exanonpts3.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';
import exanonData from '/data/exanon.json';
import playersStorage from '/data/playersStorage.json';
import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';
import basicPlayerData from '/lib/basicPlayerData';
import nations from '/data/nations.json';

export async function GET(req) {
    try {
        const res = await fetch('http://140.84.180.81:3000/api/teams/full'); //RUDIGER'S API
		const rsmData = await res.json();

        const combinedLeagues = [
            ...exanonPreTempS3?.games || [],
            ...exanonLeagueS3?.games || [],
            ...exanonCopaS3?.games || []
        ];
        const stats = await getPlayerStats(combinedLeagues); // you may need to pass ID

        const validPlayers = playersStorage.filter(
            (player) => player && player.playerId && player.playerId !== 0
        );
        const allPlayers = await Promise.all(
            validPlayers.map(async (player) => {
                if (player) {
                    if (player.playerId) {
                        const positionData = await getPlayerPositions(stats, playersStorage);
                        const response = await basicPlayerData(positionData, player, nations, player.playerId, exanonData.teams, rsmData);
                        return response
                    }
                } else {
                    return null
                }
            })
        );

        return NextResponse.json(allPlayers);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}