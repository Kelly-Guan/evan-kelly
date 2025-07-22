import { useStats } from "../../hooks/useStats";

export interface GameResult {
  id: string;
  date: string;
  winner: boolean;
  duration: number;
}

export interface PlayerStats {
  name: string;
  wins: number;
  losses: number;
  totalGames: number;
  fastestTime: number;
  gameHistory: GameResult[]; // Fixed: should be array, not single GameResult
}

export default function ScoreBoard() {
  const { stats } = useStats();

  const formatTime = (seconds: number) => {
    if (seconds === Infinity) return "N/A";
    return `${seconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6 font-mono text-purple-900">
      <h2 className="text-2xl mb-4 text-center">🏆 Leaderboard</h2>

      {/* Overall Stats Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-purple-100">
              <th className="border border-gray-300 p-2 text-left">Player</th>
              <th className="border border-gray-300 p-2 text-center">Wins</th>
              <th className="border border-gray-300 p-2 text-center">Losses</th>
              <th className="border border-gray-300 p-2 text-center">
                Win Rate
              </th>
              <th className="border border-gray-300 p-2 text-center">
                Total Games
              </th>
              <th className="border border-gray-300 p-2 text-center">
                Best Time
              </th>
            </tr>
          </thead>
          <tbody>
            {stats
              .sort((a, b) => {
                // Sort by win rate, then by total wins
                const aWinRate = a.totalGames > 0 ? a.wins / a.totalGames : 0;
                const bWinRate = b.totalGames > 0 ? b.wins / b.totalGames : 0;
                if (bWinRate !== aWinRate) return bWinRate - aWinRate;
                return b.wins - a.wins;
              })
              .map((player, index) => {
                const winRate =
                  player.totalGames > 0
                    ? ((player.wins / player.totalGames) * 100).toFixed(1)
                    : "0.0";

                return (
                  <tr
                    key={player.name}
                    className={index === 0 ? "bg-yellow-50" : ""}
                  >
                    <td className="border border-gray-300 p-2 font-bold">
                      {index === 0 ? "👑 " : ""}
                      {player.name}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-green-600">
                      {player.wins}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-red-600">
                      {player.losses}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {winRate}%
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {player.totalGames}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {formatTime(player.fastestTime)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Recent Games History */}
      <div>
        <h3 className="text-xl mb-3">Recent Games</h3>
        <div className="max-h-60 overflow-y-auto">
          {stats.length > 0 && stats.some((p) => p.gameHistory.length > 0) ? (
            <div className="space-y-2">
              {stats
                .flatMap((player) =>
                  player.gameHistory.map((game) => ({
                    ...game,
                    playerName: player.name,
                  }))
                )
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .slice(0, 10) // Show last 10 games
                .map((game) => (
                  <div
                    key={game.id}
                    className={`p-2 rounded border ${
                      game.winner
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">
                        {game.winner ? "🎉" : "💥"} {game.playerName}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(game.date)}
                      </span>
                    </div>
                    <div className="text-sm">
                      {game.winner
                        ? `Won in ${game.duration}s`
                        : `Lost after ${game.duration}s`}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No games played yet. Start playing to build your history!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
