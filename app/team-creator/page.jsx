// app/team-creator/page.jsx
import TeamCreatorPageClient from './TeamCreatorPageClient.jsx';
import { translationsMap } from '/lib/translations.js';

async function getPlayersData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/players/`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch league');
  return res.json();
}

export async function generateMetadata({ params }) {
  const storedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : 'es';
  return {
    title: `${translationsMap?.["teamCreator"]?.[storedLang]} - ${translationsMap?.["createYourDreamTeam"]?.[storedLang]}`,
    description: `${translationsMap?.["teamCreatorPara1"]?.[storedLang]}`
  };
}

export default async function MatchPage({ params }) {
  const players = await getPlayersData();
  return <TeamCreatorPageClient players={players} />;
}