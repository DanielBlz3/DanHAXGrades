import MatchLayoutServer from '/components/match/MatchLayoutServer';

export default function Layout({ children, params }) {
  return <MatchLayoutServer params={params}>{children}</MatchLayoutServer>;
}