// app/matches/[id]/page.jsx
import MatchForecastPageClient from './MatchForecastPageClient.jsx';
import { translationsMap } from '/lib/translations.js';

async function getMatchData(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matchDetails/${id}`, {
    cache: 'no-store',
  });

if (!res.ok) throw new Error('Failed to fetch match Data');
return res.json();
}

async function getTeamStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teamStats`, {
    cache: 'no-store',
  });
  
if (!res.ok) throw new Error('Failed to fetch teamStats');
return res.json();
}

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matchDetails/${params.id}`);
  const match = await res.json();
  const storedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : 'es';
  return {
    title: `${match.general.matchName} - ${translationsMap?.["liveStatsRatingsLineups"]?.[storedLang]}`,
    description: `${translationsMap?.["matchForecastFor"]?.[storedLang]} ${match.general.matchName}.`,
  };
}

export default async function MatchPage({ params }) {
  const match = await getMatchData(params.id);
  const teamStats = await getTeamStats();
  return <MatchForecastPageClient match={match} teamStats={teamStats}/>;
}