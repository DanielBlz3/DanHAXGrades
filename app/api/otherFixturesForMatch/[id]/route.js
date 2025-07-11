// app/api/otherFixturesForMatch/[id]/route.js
import { NextResponse } from 'next/server';
import exanonData from '/data/exanon.json';
import getLeagueFixtures from '/lib/getLeagueFixtures.js';
import findLeagueFile from '/lib/findLeagueFile.js';
import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
    try {
        const matchId = Number(params.id);
        const [filePath, leagueId] = findLeagueFile(matchId)
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
