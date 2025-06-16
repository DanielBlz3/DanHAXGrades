// app/api/matchdetails/[id]/route.js
import { NextResponse } from 'next/server';
import getMatchDetails from '/lib/getMatchDetails.js';
import exanonData from '/data/exanon.json';
import playersStorage from '/data/playersStorage.json';
import nations from '/data/nations.json';
import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
    try {
        const matchId = Number(params.id);

        const [filePath, leagueId] = matchId >= 350
            ? ['exanonls2.json', 7]
            : matchId >= 300
                ? ['exanoncs2.json', 6]
                : matchId >= 250
                    ? ['exanonls1.json', 5]
                    : matchId >= 200
                        ? ['exanoncs1.json', 4]
                        : matchId >= 100
                            ? ['exanoncs3.json', 3]
                            : matchId >= 35
                                ? ['exanonls3.json', 2]
                                : ['exanonpts3.json', 1];

        const fullPath = path.join(process.cwd(), 'data', filePath);
        const file = fs.readFileSync(fullPath, 'utf-8');
        const data = JSON.parse(file);
        const teamData = exanonData.teams
        const match = data.games.find((m) => m.gameId == matchId);

        const response = await getMatchDetails(matchId, leagueId, teamData, match, playersStorage, nations)
        return NextResponse.json(response);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}