import MatchLayoutClient from './MatchLayoutClient';
import MatchOtherMatchesLayoutClient from './MatchOtherMatchesLayoutClient';
import '/styles/global.css';

async function getMatchData(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matchDetails/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch match');
    return res.json();
}

async function getOtherFixturesData(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/otherFixturesForMatch/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Failed to fetch other fixtures for match ${id} ${`${process.env.NEXT_PUBLIC_BASE_URL}/api/otherFixturesForMatch/${id}`}`);
    return res.json();
}

export default async function MatchLayoutServer({ children, params }) {
    const match = await getMatchData(params.id);
    const otherFixtures = await getOtherFixturesData(params.id);
    return (
        <div className='global-content-wrapper'>
            <MatchLayoutClient match={match}>{children}</MatchLayoutClient>
            <MatchOtherMatchesLayoutClient otherFixtures={otherFixtures} match={match}>{children}</MatchOtherMatchesLayoutClient>
        </div>
    )
}
