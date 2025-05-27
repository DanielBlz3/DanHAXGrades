// app/players/[id]/page.jsx
import MatchPageClient from './MatchPageClient';
async function getMatchDetails(id) {
  const res = await fetch(`http://localhost:3003/api/players/${id}`, {
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('Failed to fetch player');
  return res.json();
}

export default async function matchPage({ params }) {
  const player = await getMatchDetails(params.id);
  return <PlayerPageClient player={player} />;
}