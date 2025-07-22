import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  flags: boolean[][];
  totalMines: number;
  firstClick: boolean;
  gameOver: boolean;
  onTimeUpdate?: (timeInMilliseconds: number) => void;
}

export default function Header({
  flags,
  totalMines,
  firstClick,
  gameOver,
  onTimeUpdate,
}: HeaderProps) {
  const [elapsed, setElapsed] = useState(0);
  const rafId = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const flagCount = flags.reduce(
    (sum, row) => sum + row.filter(Boolean).length,
    0
  );

  useEffect(() => {
    if (!firstClick && !gameOver) {
      startTimeRef.current = performance.now() - elapsed;
      const update = () => {
        const newElapsed = performance.now() - (startTimeRef.current || 0);
        setElapsed(newElapsed);
        rafId.current = requestAnimationFrame(update);
      };
      rafId.current = requestAnimationFrame(update);
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [firstClick, gameOver]);

  useEffect(() => {
    if (firstClick) {
      setElapsed(0);
      startTimeRef.current = null;
    }
  }, [firstClick]);

  // Send the final time when game ends
  useEffect(() => {
    if (gameOver && !firstClick && onTimeUpdate) {
      onTimeUpdate(elapsed);
    }
  }, [gameOver, firstClick, elapsed, onTimeUpdate]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="text-purple-900 p-2 mb-4 bg-gray-100 rounded shadow font-mono w-[100px] sm:w-[150px]">
        🫶 {totalMines - flagCount}
      </div>
      <div className="text-purple-900 p-2 mb-4 bg-gray-100 rounded shadow font-mono w-[100px] sm:w-[150px]">
        ⌛ {formatTime(elapsed)}
      </div>
    </div>
  );
}
