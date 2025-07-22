import { createContext } from "react";
import type { PlayerStats } from "../components/evansweeper/scoreboard";

interface StatsContextType {
  stats: PlayerStats[];
  updateGameStats: (winnerName: string, duration: number) => void;
  updatePlayerGame: (
    playerName: string,
    won: boolean,
    duration: number
  ) => void;
  refreshStats: () => void;
  initializeStats: () => void;
}

export type { StatsContextType };
export const StatsContext = createContext<StatsContextType | undefined>(
  undefined
);
