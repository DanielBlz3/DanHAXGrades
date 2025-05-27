import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

import playersStorage from '/data/playersStorage.json';
import exanonData from '/data/exanon.json';
import nationsJSON from '/data/nations.json';
import transfersJSON from '/data/transfers.json';
import exanonPreTempS3 from '/data/exanonpts3.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';

import getTransfers from '/lib/getTransfers.js';
import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';
import getLeagueTable from '/lib/getLeagueTable.js';
import getLeagueFixtures from '/lib/getLeagueFixtures.js';
import getPlayerStatsPerId from '/lib/getPlayerStatsPerId.js';
import getLeagueDetails from '/lib/getLeagueDetails.js';
import leagueMap from '/data/leagueMap.json'


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

        const combinedLeagues = [...exanonPreTempS3?.games, ...exanonLeagueS3?.games, ...exanonCopaS3?.games]

        const acceptedStats = await getPlayerStats(combinedLeagues)
        const activeStats = await getPlayerStats(data?.games)

        const positions = await getPlayerPositions(acceptedStats, playersStorage)

        const playerStatsPerId = await getPlayerStatsPerId(playersStorage, exanonData, activeStats, positions);
        const transfersData = await getTransfers(exanonData, transfersJSON, playersStorage, nationsJSON, positions)

        const leagueFixtures = await getLeagueFixtures(exanonData, leagueId, data)
        const leagueTable = await getLeagueTable(exanonData, leagueId, leagueFixtures)

        const response = await getLeagueDetails(leagueId, exanonData, playersStorage, leagueFixtures, leagueTable, activeStats, playerStatsPerId, transfersData)
        return NextResponse.json(response);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}