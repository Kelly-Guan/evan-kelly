import { createContext } from "react";
import type { PlayerStats } from "../components/evansweeper/scoreboard";

interface StatsContextType {
  stats: PlayerStats[];
  updateGameStats: (winnerName: string, duration: number) => void;
  updatePlayerGame: (
    playerName: string,
    won: boolean,
    durationMs: number,
    difficulty: "easy" | "medium" | "hard"
  ) => void;
  refreshStats: () => void;
  initializeStats: () => void;
}

export type { StatsContextType };
export const StatsContext = createContext<StatsContextType | undefined>(
  undefined
);
