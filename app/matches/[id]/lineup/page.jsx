// app/matches/[id]/page.jsx
import MatchLineupPageClient from './MatchLineupPageClient.jsx';
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
    title: `${match.generateMetadata.matchName} - ${translationsMap?.["liveStatsRatingsLineups"]?.[storedLang]}`,
    description: `${translationsMap?.["viewMatchLineupsFor"]?.[storedLang]} ${match.generateMetadata.matchName}.`,
  };
}

export default async function MatchPage({ params }) {
  const match = await getMatchData(params.id);
  return <MatchLineupPageClient match={match} />;
}