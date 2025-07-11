export default function findLeagueFile(matchId) {
    let filePath
    let leagueId
    if (matchId >= 1000) {
        filePath = 'friendlies.json';
        leagueId = 8;
    } else if (matchId >= 550) {
        filePath = 'rsmls1.json';
        leagueId = 9
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
    return [filePath, leagueId]
}