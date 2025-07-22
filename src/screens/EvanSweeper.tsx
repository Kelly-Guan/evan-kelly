import Boards from "../components/evansweeper/boards";
import ScoreBoard from "../components/evansweeper/scoreboard";

export default function EvanSweeper() {
  return (
    <div className="flex flex-col items-center justify-center bg-purple-200">
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <h1 className="text-4xl mb-5 text-purple-900 font-mono">
          evan sweeps 🧹
        </h1>
        <Boards />
      </div>
      <ScoreBoard />
    </div>
  );
}
