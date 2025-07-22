import { useEffect, useState } from "react";
import wordleWords from "../../assets/wordleWords.json";
import USuck from "../../assets/usuck.png";

type LetterState = "empty" | "correct" | "wrongPosition" | "incorrect";

interface LetterCell {
  letter: string;
  state: LetterState;
}

export default function Words() {
  const [wordGrid, setWordGrid] = useState<LetterCell[][]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [chosenWord, setChosenWord] = useState("");
  const [currentCol, setCurrentCol] = useState(0);

  const initializeGame = () => {
    const randomEntry =
      wordleWords[Math.floor(Math.random() * wordleWords.length)];
    const word = randomEntry.word.toLowerCase();
    setChosenWord(word);

    const newGrid: LetterCell[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: word.length }, () => ({
        letter: "",
        state: "empty",
      })),
    );
    setWordGrid(newGrid);
    setCurrentRow(0);
    setCurrentCol(0);
    setIsGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentCol < chosenWord.length - 1) {
          setCurrentCol(currentCol + 1);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentCol > 0) {
          setCurrentCol(currentCol - 1);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        const newGrid = [...wordGrid];
        if (newGrid[currentRow][currentCol].letter) {
          newGrid[currentRow][currentCol].letter = "";
          setWordGrid(newGrid);
        } else if (currentCol > 0) {
          setCurrentCol(currentCol - 1);
          newGrid[currentRow][currentCol - 1].letter = "";
          setWordGrid(newGrid);
        }
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        const char = e.key.toLowerCase();
        const newGrid = [...wordGrid];
        newGrid[currentRow][currentCol].letter = char;
        setWordGrid(newGrid);

        if (currentCol < chosenWord.length - 1) {
          setCurrentCol(currentCol + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentRow, currentCol, isGameOver, chosenWord.length, wordGrid]);

  const handleChange = (value: string, row: number, col: number) => {
    if (row !== currentRow || isGameOver) return;

    const char = value.slice(-1).toLowerCase();
    const newGrid = [...wordGrid];
    newGrid[row][col].letter = char;
    setWordGrid(newGrid);

    if (char && col < chosenWord.length - 1) {
      setCurrentCol(col + 1);
    }
  };

  const handleSubmit = () => {
    if (isGameOver) return;

    const currentWord = wordGrid[currentRow];
    const guess = currentWord.map((c) => c.letter).join("");

    if (guess.length !== chosenWord.length) {
      return;
    }

    const newGrid = [...wordGrid];
    const targetLetters = chosenWord.split("");

    for (let i = 0; i < chosenWord.length; i++) {
      const guessChar = currentWord[i].letter;
      if (guessChar === chosenWord[i]) {
        newGrid[currentRow][i].state = "correct";
      } else if (targetLetters.includes(guessChar)) {
        newGrid[currentRow][i].state = "wrongPosition";
      } else {
        newGrid[currentRow][i].state = "incorrect";
      }
    }

    setWordGrid(newGrid);

    const isCorrect = newGrid[currentRow].every(
      (cell) => cell.state === "correct",
    );

    if (isCorrect) {
      setIsGameOver(true);
      setGameWon(true);
    } else if (currentRow >= 6) {
      setIsGameOver(true);
      setGameWon(false);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
    }
  };

  const handleRestart = () => {
    initializeGame();
  };

  return (
    <div className="text-stone-200 flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col gap-2">
        {wordGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                type="text"
                maxLength={1}
                disabled={rowIndex !== currentRow || isGameOver}
                value={cell.letter}
                onChange={(e) =>
                  handleChange(e.target.value, rowIndex, colIndex)
                }
                className={`w-10 h-10 text-center text-xl font-bold rounded border-2 font-mono transition-all ${
                  rowIndex === currentRow &&
                  colIndex === currentCol &&
                  !isGameOver
                    ? "border-pink-400 ring-2 ring-pink-200"
                    : "border-transparent"
                } ${
                  {
                    correct: "bg-green-300 text-purple-800",
                    wrongPosition: "bg-yellow-200 text-purple-800",
                    incorrect: "bg-pink-400 text-purple-800",
                    empty: "bg-purple-300 text-purple-800",
                  }[cell.state]
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      {!isGameOver ? (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-gray-200 rounded text-purple-800 text-lg font-medium transition hover:bg-gray-300 cursor-pointer font-mono"
        >
          ENTER
        </button>
      ) : (
        <button
          onClick={handleRestart}
          className="mt-4 px-4 py-2 rounded text-gray-200 bg-purple-800 text-lg font-medium transition hover:bg-purple-900 cursor-pointer font-mono"
        >
          RESTART
        </button>
      )}

      {isGameOver && gameWon && (
        <div className="text-pink-600 font-mono">you awesome 😽</div>
      )}

      {isGameOver && !gameWon && (
        <div>
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 top-3/8 text-red-600 text-6xl font-extrabold transition-transform duration-500 ease-in-out ${"animate-size-pulse"}`}
          >
            <div className="flex items-center gap-4 font-mono">
              <span>YOU SUCK!</span>
              <img src={USuck} alt="you suck svg" className="w-20 h-20" />
            </div>
          </div>
          <p className="text-stone-400 font-mono">
            The word was:{" "}
            <span className="text-purple-900 font-bold font-mono">
              {chosenWord.toUpperCase()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
