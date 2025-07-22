import Boards from "../components/evansweeper/boards";
import ScoreBoard from "../components/evansweeper/scoreboard";
import { StatsProvider } from "../contexts/StatsContext";

export default function EvanSweeper() {
  return (
    <StatsProvider>
      <div className="flex flex-col items-center justify-center bg-purple-200">
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
          <Boards />
        </div>
        <ScoreBoard />
      </div>
    </StatsProvider>
  );
}
