import { NextResponse } from 'next/server';
import playersStorage from '/data/playersStorage.json';
import exanonData from '/data/exanon.json';
import exanonPreTempS3 from '/data/exanonpts3.json';
import exanonLeagueS3 from '/data/exanonls3.json';
import exanonCopaS3 from '/data/exanoncs3.json';
import nationsJSON from '/data/nations.json';
import getPlayerInfo from '/lib/getPlayerInfo.js';
import getPlayerStats from '/lib/getPlayerStats.js';
import getPlayerPositions from '/lib/getPlayerPositions.js';
import getPlayerStatsPerId from '/lib/getPlayerStatsPerId.js';

export async function GET(req, { params }) {
	try {
		const res = await fetch('http://140.84.180.81:3000/api/teams/full'); //RUDIGER'S API
		const rsmData = await res.json();

		const playerId = Number(params.id);
		const player = playersStorage.find(p => p.playerId === playerId);
		if (!player) {
			return NextResponse.json({ error: 'Player not found' }, { status: 404 });
		}

		exanonLeagueS3.games.forEach(game => game.leagueId = 2);
		exanonCopaS3.games.forEach(game => game.leagueId = 3);

		const activeLeagues = [...exanonLeagueS3?.games, ...exanonCopaS3?.games];
		const acceptedLeagues = [...exanonPreTempS3?.games, ...exanonLeagueS3?.games, ...exanonCopaS3?.games];

		const activeStats = await getPlayerStats(activeLeagues);
		const acceptedStats = await getPlayerStats(acceptedLeagues);

		const playerPositions = await getPlayerPositions(acceptedStats, playersStorage);
		const playerStatsPerId = await getPlayerStatsPerId(playersStorage, exanonData, activeStats, playerPositions);

		// 👇 Pass rsmData to getPlayerInfo
		const playerInfo = await getPlayerInfo(
			playerId,
			player,
			nationsJSON,
			exanonData,
			playerPositions,
			playerStatsPerId,
			activeStats,
			rsmData
		);

		return NextResponse.json(playerInfo);

	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}