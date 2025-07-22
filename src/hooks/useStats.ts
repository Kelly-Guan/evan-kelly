import { useContext } from "react";
import { StatsContext } from "../contexts/StatsContextDefinition";

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
};
