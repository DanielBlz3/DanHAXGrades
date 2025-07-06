// app/api/matchdetails/[id]/route.js
import { NextResponse } from 'next/server';
import getMatchDetails from '/lib/getMatchDetails.js';
import exanonPreTempS3 from '/data/exanonpts3.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';
import exanonData from '/data/exanon.json';
import playersStorage from '/data/playersStorage.json';
import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';
import basicPlayerData from '/lib/basicPlayerData';
import nations from '/data/nations.json';
import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
    try {
        //GETTING BASIC PLAYER DATA FIRST
        const res = await fetch('http://140.84.180.81:3000/api/teams/full'); //RUDIGER'S API
        const rsmData = await res.json();

        const combinedLeagues = [
            ...exanonPreTempS3?.games || [],
            ...exanonLeagueS3?.games || [],
            ...exanonCopaS3?.games || []
        ];
        const stats = await getPlayerStats(combinedLeagues);
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

        const matchId = Number(params.id);

        let filePath
        let leagueId
        if (matchId >= 1000) {
            filePath = 'friendlies.json';
            leagueId = 8;
        } else if (matchId >= 450) {
            filePath = 'exanonls2.json';
            leagueId = 7;
        } else if (matchId >= 350) {
            filePath = 'exanoncs2.json';
            leagueId = 6;
        } else if (matchId >= 250) {
            filePath = 'exanonls1.json';
            leagueId = 5;
        } else if (matchId >= 200) {
            filePath = 'exanoncs1.json';
            leagueId = 4;
        } else if (matchId >= 100) {
            filePath = 'exanoncs3.json';
            leagueId = 3;
        } else if (matchId >= 35) {
            filePath = 'exanonls3.json';
            leagueId = 2;
        } else {
            filePath = 'exanonpts3.json';
            leagueId = 1;
        }
        const fullPath = path.join(process.cwd(), 'data', filePath);
        const file = fs.readFileSync(fullPath, 'utf-8');
        const data = JSON.parse(file);
        const teamData = exanonData.teams
        const match = data.games.find((m) => m.gameId == matchId);

        const response = await getMatchDetails(matchId, leagueId, teamData, match, allPlayers, nations)
        return NextResponse.json(response);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}