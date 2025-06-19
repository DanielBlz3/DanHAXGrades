// app/api/otherFixturesForMatch/[id]/route.js
import { NextResponse } from 'next/server';
import exanonData from '/data/exanon.json';
import getLeagueFixtures from '/lib/getLeagueFixtures.js';
import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
    try {
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
        const match = data.games.find((m) => m.gameId == matchId);
        const leagueRound = match.leagueRound
        const leagueFixtures = await getLeagueFixtures(exanonData, leagueId, data)
        const response = leagueFixtures.filter(m => m.leagueRound == leagueRound)

        return NextResponse.json(response);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
