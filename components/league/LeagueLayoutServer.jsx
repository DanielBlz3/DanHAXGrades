import LeagueLayoutClient from './LeagueLayoutClient';
import '/styles/global.css';

async function getLeagueData(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leagues/${id}`, {
    cache: 'no-store',
  });

if (!res.ok) throw new Error('Failed to fetch league');
return res.json();
}


export default async function LeagueLayoutServer({ children, params }) {
    const league = await getLeagueData(params.id);
    return (
        <div className='league-wrapper'>
            <LeagueLayoutClient league={league}>{children}</LeagueLayoutClient>
        </div>
    )
}


