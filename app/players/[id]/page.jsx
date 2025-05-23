 async function getPlayer(id) {
  const res = await fetch(`https://danhaxgrades.glitch.me/api/players/${id}`);
  if (!res.ok) throw new Error("Failed to fetch player");
  return res.json();
}

export default async function PlayerPage({ params }) {
  const player = await getPlayer(params.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{player.playername}</h1>
      <p>shirtNum: {player.shirtNum}</p>
      <p>Nation: {player.nation}</p>
      <p>League: {player.league}</p>
    </div>
  );
}
