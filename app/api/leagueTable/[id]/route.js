// app/api/matchdetails/[id]/route.js
import { NextResponse } from 'next/server';
import exanonData from '/data/exanon.json';
import getLeagueTable from '/lib/getLeagueTable.js';
import getLeagueFixtures from '/lib/getLeagueFixtures.js';
import leagueMap from '/data/leagueMap.json';
import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
    try {
        const leagueId = Number(params.id);
        const filePath = leagueMap[leagueId]
        if (!filePath) {
            return NextResponse.json({ error: 'Invalid league ID' }, { status: 400 });
        }
        const fullPath = path.join(process.cwd(), 'data', filePath);
        const file = fs.readFileSync(fullPath, 'utf-8');
        const data = JSON.parse(file);
        const leagueFixtures = await getLeagueFixtures(exanonData, leagueId, data)
        const response = await getLeagueTable(exanonData, leagueId, leagueFixtures)
        return NextResponse.json(response);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}