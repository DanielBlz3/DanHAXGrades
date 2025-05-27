// app/api/matchdetails/[id]/route.js
import { NextResponse } from 'next/server';
import exanonData from '/data/exanon.json';
import getLeagueFixtures from '/lib/getLeagueFixtures.js';
import leagueMap from '/lib/leagueMap.json';
import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
    try {
        const leagueId = Number(params.id);

        const filePath = leagueMap[leagueId]
        const fullPath = path.join(process.cwd(), 'data', filePath);
        const file = fs.readFileSync(fullPath, 'utf-8');
        const data = JSON.parse(file);

        const response = await getLeagueFixtures(exanonData, leagueId, data)
        return NextResponse.json(response);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}