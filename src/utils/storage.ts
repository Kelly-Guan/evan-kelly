import type {
  PlayerStats,
  GameResult,
} from "../components/evansweeper/scoreboard";

const STATS_KEY = "evansweeper-stats";
const HISTORY_KEY = "evansweeper-history";

// Safely parse with type assertion
export const getStats = (): PlayerStats[] => {
  const data = localStorage.getItem(STATS_KEY);
  try {
    const parsed = data ? (JSON.parse(data) as any[]) : [];
    // Convert back from serializable format
    return parsed.map((player) => ({
      ...player,
      fastestTime:
        player.fastestTime === "INFINITY" || player.fastestTime === null
          ? Infinity
          : player.fastestTime,
    }));
  } catch {
    return [];
  }
};

export const setStats = (stats: PlayerStats[]) => {
  // Replace Infinity with a special string before serializing
  const serializable = stats.map((player) => ({
    ...player,
    fastestTime:
      player.fastestTime === Infinity ? "INFINITY" : player.fastestTime,
  }));
  localStorage.setItem(STATS_KEY, JSON.stringify(serializable));
};

export const clearStats = () => {
  localStorage.removeItem(STATS_KEY);
};

export const saveStats = (stats: PlayerStats[]) => {
  const existingStats = getStats();
  const updatedStats = [...existingStats, ...stats];
  setStats(updatedStats);
};

export const updateStats = (newStats: PlayerStats) => {
  const existingStats = getStats();
  const updatedStats = existingStats.map((stat) =>
    stat.name === newStats.name ? { ...stat, ...newStats } : stat
  );
  setStats(updatedStats);
};

export const getHistory = (): GameResult[] => {
  const data = localStorage.getItem(HISTORY_KEY);
  try {
    return data ? (JSON.parse(data) as GameResult[]) : [];
  } catch {
    return [];
  }
};

export const saveHistory = (newResult: GameResult) => {
  const history = getHistory();
  const updated = [newResult, ...history];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};
