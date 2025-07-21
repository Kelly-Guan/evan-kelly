import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  flags: boolean[][];
  totalMines: number;
  firstClick: boolean;
  gameOver: boolean;
}

export default function Header({ flags, totalMines, firstClick, gameOver }: HeaderProps) {
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
        setElapsed(performance.now() - (startTimeRef.current || 0));
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

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 6000);
    const seconds = Math.floor((ms % 6000) / 100);
    const milliseconds = Math.floor(ms % 100);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="text-purple-900 p-2 mb-4 bg-gray-100 rounded shadow font-mono w-[100px] sm:w-[150px] ">🫶 {totalMines - flagCount}</div>
      <div className="text-purple-900 p-2 mb-4 bg-gray-100 rounded shadow font-mono w-[100px] sm:w-[150px]">⌛ {formatTime(elapsed)}</div>
    </div>
  );
}
