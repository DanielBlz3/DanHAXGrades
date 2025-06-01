// app/matches/[id]/page.jsx
import MatchLineupPageClient from './MatchLineupPageClient.jsx';
async function getMatchData(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matchDetails/${id}`, {
    cache: 'no-store',
  });

if (!res.ok) throw new Error('Failed to fetch player');
return res.json();
}

export default async function MatchPage({ params }) {
  const match = await getMatchData(params.id);
  return <MatchLineupPageClient match={match} />;
}