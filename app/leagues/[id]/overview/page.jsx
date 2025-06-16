// app/leagues/[id]/overview/page.jsx
import LeagueOverviewPageClient from './LeagueOverviewPageClient.jsx';
import { translationsMap } from '/lib/translations.js';

async function getLeagueData(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leagues/${id}`, {
    cache: 'no-store',
  });

if (!res.ok) throw new Error('Failed to fetch league');
return res.json();
}

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leagues/${params.id}`);
  const league = await res.json();
  const storedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : 'es';
  return {
    title: `${league.leagueDetails.name} - ${translationsMap?.["liveStatsRatingsLineups"]?.[storedLang]}`,
    description: ``
  };
}

export default async function MatchPage({ params }) {
  const league = await getLeagueData(params.id);
  return <LeagueOverviewPageClient league={league}/>;
}