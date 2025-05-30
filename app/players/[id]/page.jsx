// app/players/[id]/page.jsx
import PlayerPageClient from './PlayerPageClient';
import { translationsMap } from '/lib/translations.js';


export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/players/${params.id}`);
  const player = await res.json();
  const storedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : 'es';
  return {
    title: `${player.playername} - ${translationsMap?.["statsRatingsCareerAndMore"]?.[storedLang]}`,
    description: `View all stats for ${player.playername}.`,
  };
}

async function getPlayerData(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/players/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch player');
  return res.json();
}

export default async function PlayerPage({ params }) {
  const player = await getPlayerData(params.id);
  return <PlayerPageClient player={player} />;
}