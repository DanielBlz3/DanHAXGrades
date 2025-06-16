import LeagueLayoutServer from '/components/league/LeagueLayoutServer';

export default function Layout({ children, params }) {
  return <LeagueLayoutServer params={params}>{children}</LeagueLayoutServer>;
}