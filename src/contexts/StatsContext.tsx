import React, { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { getStats, setStats } from "../utils/storage";
import type {
  GameResult,
  PlayerStats,
} from "../components/evansweeper/scoreboard";
import { StatsContext, type StatsContextType } from "./StatsContextDefinition";

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const [stats, setStatsState] = useState<PlayerStats[]>([]);

  const initializeStats = () => {
    const currentStats = getStats();
    if (currentStats.length === 0) {
      // Initialize with default players if no stats exist
      const defaultStats: PlayerStats[] = [
        {
          name: "Kelly",
          wins: 0,
          losses: 0,
          totalGames: 0,
          fastestTime: Infinity,
          gameHistory: [],
        },
        {
          name: "Evan",
          wins: 0,
          losses: 0,
          totalGames: 0,
          fastestTime: Infinity,
          gameHistory: [],
        },
      ];
      setStats(defaultStats);
      setStatsState(defaultStats);
    } else {
      setStatsState(currentStats);
    }
  };

  const refreshStats = () => {
    const currentStats = getStats();
    setStatsState(currentStats);
  };

  const updateGameStats = (winnerName: string, duration: number) => {
    const currentStats = getStats();
    let players: PlayerStats[] = currentStats;

    // Initialize if empty
    if (players.length === 0) {
      players = [
        {
          name: "Kelly",
          wins: 0,
          losses: 0,
          totalGames: 0,
          fastestTime: Infinity,
          gameHistory: [],
        },
        {
          name: "Evan",
          wins: 0,
          losses: 0,
          totalGames: 0,
          fastestTime: Infinity,
          gameHistory: [],
        },
      ];
    }

    const updated = players.map((player) => {
      const won = player.name === winnerName;
      const gameResult: GameResult = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        winner: won,
        duration,
      };

      return {
        ...player,
        wins: player.wins + (won ? 1 : 0),
        losses: player.losses + (won ? 0 : 1),
        totalGames: player.totalGames + 1,
        fastestTime: won
          ? Math.min(player.fastestTime, duration)
          : player.fastestTime,
        gameHistory: [
          gameResult,
          ...(Array.isArray(player.gameHistory) ? player.gameHistory : []),
        ],
      };
    });

    setStats(updated);
    setStatsState(updated);
  };

  const updatePlayerGame = useCallback(
    (playerName: string, won: boolean, duration: number) => {
      const currentStats = getStats();
      let players: PlayerStats[] = currentStats;

      // Initialize if empty
      if (players.length === 0) {
        players = [
          {
            name: "Kelly",
            wins: 0,
            losses: 0,
            totalGames: 0,
            fastestTime: Infinity,
            gameHistory: [],
          },
          {
            name: "Evan",
            wins: 0,
            losses: 0,
            totalGames: 0,
            fastestTime: Infinity,
            gameHistory: [],
          },
        ];
      }

      const updated = players.map((player) => {
        if (player.name === playerName) {
          const gameResult: GameResult = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            winner: won,
            duration,
          };

          return {
            ...player,
            wins: player.wins + (won ? 1 : 0),
            losses: player.losses + (won ? 0 : 1),
            totalGames: player.totalGames + 1,
            fastestTime: won
              ? Math.min(player.fastestTime, duration)
              : player.fastestTime,
            gameHistory: [
              gameResult,
              ...(Array.isArray(player.gameHistory) ? player.gameHistory : []),
            ],
          };
        }
        return player;
      });

      setStats(updated);
      setStatsState(updated);
    },
    []
  );

  useEffect(() => {
    initializeStats();
  }, []);

  const value: StatsContextType = {
    stats,
    updateGameStats,
    updatePlayerGame,
    refreshStats,
    initializeStats,
  };

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
};
