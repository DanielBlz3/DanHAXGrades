// app/players/[id]/page.jsx
import PlayerPageClient from './PlayerPageClient';
async function getPlayerData(id) {
  const res = await fetch(`http://localhost:3000/api/players/${id}`, {
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('Failed to fetch player');
  return res.json();
}

export default async function PlayerPage({ params }) {
  const player = await getPlayerData(params.id);
  return <PlayerPageClient player={player} />;
}