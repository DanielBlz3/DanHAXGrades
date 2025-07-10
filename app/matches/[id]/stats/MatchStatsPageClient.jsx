'use client';
import MatchStats from '/components/match/MatchStats.jsx';
import PlayersStats from '/components/match/PlayersStats.jsx';
export default function MatchStatsPageClient({ match }) {
const players = [...Object.entries(match.lineup.home.players), ...Object.entries(match.lineup.away.players)]
    return (
        <div>
            <MatchStats match={match} visible={match.matchStatus.started}  acceptedStats={['possession', 'shots', 'bcm', 'passesC', 'touches', 'keyPasses', 'defensiveActions', 'bigErrors', 'duelsWon', 'duelsP', 'passingA']}/>
            <PlayersStats players={players}/>
        </div>
    );
}