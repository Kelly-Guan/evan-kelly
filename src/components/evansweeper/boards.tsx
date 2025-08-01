import { useState, useEffect } from "react";
import Cells from "./cells";
import { mineLocations } from "../../utils/mineLocations";
import { revealCells } from "../../utils/revealCells";
import { isLogicallySolvable } from "../../utils/logicSolver";
import Header from "./header";
import USuck from "../../assets/usuck.png";
import { getCurrentPlayer, setCurrentPlayer } from "../../utils/playerContext";
import { useStats } from "../../hooks/useStats";

interface BoardsProps {
  onDifficultyChange?: (difficulty: "easy" | "medium" | "hard") => void;
}

export default function Boards({ onDifficultyChange }: BoardsProps = {}) {
  const easy = { rows: 8, cols: 8, mines: 10 };
  const medium = { rows: 16, cols: 16, mines: 40 };
  const hard = { rows: 16, cols: 25, mines: 60 };

  const { updatePlayerGame } = useStats();
  const [player, setPlayer] = useState<"Kelly" | "Evan" | null>(null);
  const [config, setConfig] = useState(easy);
  const [board, setBoard] = useState<(number | "M")[][]>([]);
  const [revealed, setRevealed] = useState<boolean[][]>([]);
  const [flags, setFlags] = useState<boolean[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [startCell, setStartCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameTime, setGameTime] = useState<number>(0);

  useEffect(() => {
    const savedPlayer = getCurrentPlayer();
    if (savedPlayer) setPlayer(savedPlayer);
  }, []);

  useEffect(() => {
    if (!player) return;
    let cancelled = false;
    setLoading(true);

    // Notify parent of current difficulty
    const difficulty =
      config.cols === 8 ? "easy" : config.cols === 16 ? "medium" : "hard";
    onDifficultyChange?.(difficulty);

    setTimeout(() => {
      let newBoard: (number | "M")[][] = [];
      let start: { row: number; col: number } | null = null;
      let attempts = 0;

      while (true) {
        const mines = mineLocations(config);
        newBoard = Array.from({ length: config.rows }, (_, r) =>
          Array.from({ length: config.cols }, (_, c) =>
            mines.has(`${r},${c}`) ? "M" : 0
          )
        );

        for (let r = 0; r < config.rows; r++) {
          for (let c = 0; c < config.cols; c++) {
            if (newBoard[r][c] === "M") continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr,
                  nc = c + dc;
                if (
                  nr >= 0 &&
                  nr < config.rows &&
                  nc >= 0 &&
                  nc < config.cols &&
                  newBoard[nr][nc] === "M"
                ) {
                  count++;
                }
              }
            }
            newBoard[r][c] = count;
          }
        }

        const safeCells: { row: number; col: number }[] = [];
        for (let r = 0; r < config.rows; r++) {
          for (let c = 0; c < config.cols; c++) {
            if (newBoard[r][c] !== "M") safeCells.push({ row: r, col: c });
          }
        }

        start = safeCells[Math.floor(Math.random() * safeCells.length)];
        if (isLogicallySolvable(newBoard, start)) break;
        if (++attempts > 400000)
          throw new Error("Failed to generate a no-guess board");
      }

      if (!cancelled) {
        setBoard(newBoard);
        setRevealed(
          Array.from({ length: config.rows }, () =>
            Array(config.cols).fill(false)
          )
        );
        setFlags(
          Array.from({ length: config.rows }, () =>
            Array(config.cols).fill(false)
          )
        );
        setGameOver(false);
        setFirstClick(true);
        setStartCell(start);
        setLoading(false);
        setGameTime(0);
      }
    }, 100);

    return () => {
      cancelled = true;
    };
  }, [config, player]);

  useEffect(() => {
    if (gameOver && player && gameTime > 0) {
      const won = checkWin(flags, board);
      const difficulty =
        config.cols === 8 ? "easy" : config.cols === 16 ? "medium" : "hard";
      updatePlayerGame(player, won, gameTime, difficulty);
    }
  }, [gameOver, player, gameTime, updatePlayerGame, config.cols]);

  const switchPlayer = () => {
    const newPlayer = player === "Kelly" ? "Evan" : "Kelly";
    setPlayer(newPlayer);
    setCurrentPlayer(newPlayer);
  };

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 font-mono text-purple-900">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setPlayer("Kelly");
              setCurrentPlayer("Kelly");
            }}
            className="bg-purple-300 px-4 py-2 rounded hover:bg-purple-400"
          >
            Kelly
          </button>
          <button
            onClick={() => {
              setPlayer("Evan");
              setCurrentPlayer("Evan");
            }}
            className="bg-purple-300 px-4 py-2 rounded hover:bg-purple-400"
          >
            Evan
          </button>
        </div>
      </div>
    );
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || revealed[row][col] || flags[row][col]) return;

    if (firstClick) {
      if (!startCell || row !== startCell.row || col !== startCell.col) return;
      setFirstClick(false);
      const newRevealed = revealCells(
        board,
        revealed.map((r) => [...r]),
        row,
        col
      );
      setRevealed(newRevealed);
      return;
    }

    if (board[row][col] === "M") {
      const newRevealed = revealed.map((rowArr, r) =>
        rowArr.map((cell, c) => (board[r][c] === "M" ? true : cell))
      );
      setRevealed(newRevealed);
      setGameOver(true);
    } else {
      const newRevealed = revealCells(
        board,
        revealed.map((r) => [...r]),
        row,
        col
      );
      setRevealed(newRevealed);
    }
  };

  const handleCellFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (revealed[row][col] || gameOver) return;

    setFlags((prev) => {
      const newFlags = prev.map((rowArr, r) =>
        rowArr.map((cell, c) => (r === row && c === col ? !cell : cell))
      );

      if (checkWin(newFlags, board)) {
        setGameOver(true);
      }

      return newFlags;
    });
  };

  const handleCellChord = (row: number, col: number) => {
    if (
      !revealed[row][col] ||
      typeof board[row][col] !== "number" ||
      board[row][col] === 0
    )
      return;

    let flagCount = 0;
    const neighbors: { r: number; c: number }[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr,
          nc = col + dc;
        if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
          neighbors.push({ r: nr, c: nc });
          if (flags[nr][nc]) flagCount++;
        }
      }
    }

    if (flagCount !== board[row][col]) return;

    let hitMine = false;
    const newRevealed = revealed.map((r) => [...r]);
    for (const { r, c } of neighbors) {
      if (!flags[r][c] && !revealed[r][c]) {
        if (board[r][c] === "M") hitMine = true;
        else revealCells(board, newRevealed, r, c);
        newRevealed[r][c] = true;
      }
    }

    setRevealed(newRevealed);

    if (hitMine) {
      setGameOver(true);
      const revealAll = revealed.map((rowArr, r) =>
        rowArr.map((cell, c) => (board[r][c] === "M" ? true : cell))
      );
      setRevealed(revealAll);
    }
  };

  function checkWin(flags: boolean[][], board: (number | "M")[][]) {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        const isMine = board[r][c] === "M";
        const isFlagged = flags[r][c];
        if (isMine && !isFlagged) return false;
        if (!isMine && isFlagged) return false;
      }
    }
    return true;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 text-purple-900 font-mono">
        evan sweeps 🧹
      </h1>
      <Header
        flags={flags}
        totalMines={config.mines}
        firstClick={firstClick}
        gameOver={gameOver}
        onTimeUpdate={setGameTime}
      />

      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-sm transition-colors duration-150 text-purple-900
                ${config.cols === 8 ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"} cursor-pointer font-mono`}
          onClick={() => {
            setConfig(easy);
            onDifficultyChange?.("easy");
          }}
        >
          easy
        </button>
        <button
          className={`px-4 py-2 rounded-sm transition-colors duration-150 text-purple-900
                ${config.cols === 16 ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"} cursor-pointer font-mono`}
          onClick={() => {
            setConfig(medium);
            onDifficultyChange?.("medium");
          }}
        >
          medium
        </button>
        <button
          className={`px-4 py-2 rounded-sm transition-colors duration-150 text-purple-900
                ${config.cols === 25 ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"} cursor-pointer font-mono`}
          onClick={() => {
            setConfig(hard);
            onDifficultyChange?.("hard");
          }}
        >
          hard
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600 animate-pulse font-mono">
            Generating fair board...
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${config.cols}, 35px)`,
            gridTemplateRows: `repeat(${config.rows}, 35px)`,
            gap: 0,
            marginTop: 16,
          }}
        >
          {Array.from({ length: config.rows }).map((_, rowIdx) =>
            Array.from({ length: config.cols }).map((_, colIdx) => (
              <Cells
                key={`${rowIdx}-${colIdx}`}
                value={board[rowIdx]?.[colIdx]}
                revealed={revealed[rowIdx]?.[colIdx]}
                flagged={flags[rowIdx]?.[colIdx]}
                onClick={() => handleCellClick(rowIdx, colIdx)}
                onRightClick={(e) => handleCellFlag(rowIdx, colIdx, e)}
                showX={Boolean(
                  firstClick &&
                    startCell &&
                    rowIdx === startCell.row &&
                    colIdx === startCell.col
                )}
                onChord={() => handleCellChord(rowIdx, colIdx)}
              />
            ))
          )}
        </div>
      )}

      {gameOver && !checkWin(flags, board) && (
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 top-1/2 text-red-600 text-6xl font-extrabold transition-transform duration-500 ease-in-out ${"animate-size-pulse"}`}
        >
          <div className="flex items-center gap-4 font-mono">
            <span className="font-mono">YOU SUCK!</span>{" "}
            <img src={USuck} alt="you suck svg" className="w-20 h-20" />
          </div>
        </div>
      )}

      {gameOver && checkWin(flags, board) && (
        <div className="text-pink-600 mt-4 font-mono">you awesome 😽</div>
      )}

      <div className="flex items-center gap-2 items-center mt-4 font-mono text-purple-900">
        <span>
          Playing as: <strong>{player}</strong>
        </span>
        <button
          onClick={switchPlayer}
          className="px-4 py-2 rounded-sm transition-colors duration-150 text-purple-900 cursor-pointer bg-purple-300 rounded hover:bg-purple-400"
        >
          Switch Player
        </button>
      </div>
    </div>
  );
}
