'use client';
import MatchStats from '/components/match/MatchStats.jsx';
export default function MatchStatsPageClient({ match }) {

    return (
        <div>
            <MatchStats match={match} visible={match.matchStatus.started}  acceptedStats={['possession', 'shots', 'bcm', 'passesC', 'touches', 'keyPasses', 'defensiveActions', 'bigErrors', 'duelsWon', 'duelsP', 'passingA']}/>
        </div>
    );
}