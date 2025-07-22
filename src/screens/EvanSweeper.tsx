import { useState } from "react";
import Boards from "../components/evansweeper/boards";
import ScoreBoard from "../components/evansweeper/scoreboard";
import { StatsProvider } from "../contexts/StatsContext";

export default function EvanSweeper() {
  const [currentDifficulty, setCurrentDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("easy");

  return (
    <StatsProvider>
      <div className="flex flex-col items-center justify-center bg-purple-200">
        <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center">
          <Boards onDifficultyChange={setCurrentDifficulty} />
        </div>
        <ScoreBoard currentDifficulty={currentDifficulty} />
      </div>
    </StatsProvider>
  );
}
