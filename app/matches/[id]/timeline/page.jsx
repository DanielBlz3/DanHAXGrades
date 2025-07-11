// app/matches/[id]/page.jsx
import MatchTimelinePageClient from './MatchTimelinePageClient.jsx';
import { translationsMap } from '/lib/translations.js';

async function getMatchData(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matchDetails/${id}`, {
    cache: 'no-store',
  });

if (!res.ok) throw new Error('Failed to fetch player');
return res.json();
}

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matchDetails/${params.id}`);
  const match = await res.json();
  const storedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : 'es';
  return {
    title: `${match.general.matchName} - ${translationsMap?.["liveStatsRatingsLineups"]?.[storedLang]}`,
    description: `${translationsMap?.["viewTimelineFor"]?.[storedLang]} ${match.general.matchName}.`,
  };
}

export default async function MatchPage({ params }) {
  const match = await getMatchData(params.id);
  return <MatchTimelinePageClient match={match} />;
}