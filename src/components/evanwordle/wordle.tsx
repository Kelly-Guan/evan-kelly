import { useEffect, useState } from "react";
import wordleWords from "../../assets/wordleWords.json"


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
    const randomEntry = wordleWords[Math.floor(Math.random() * wordleWords.length)];
    console.log(randomEntry);
    const word = randomEntry.word.toLowerCase();
    setChosenWord(word);
    
    const newGrid: LetterCell[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: word.length }, () => ({ letter: "", state: "empty" }))
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
    
    // Check if the word is complete
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

    const isCorrect = newGrid[currentRow].every((cell) => cell.state === "correct");
    
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
                onChange={(e) => handleChange(e.target.value, rowIndex, colIndex)}
                className={`w-10 h-10 text-center text-xl font-bold rounded border-2 transition-all ${
                  rowIndex === currentRow && colIndex === currentCol && !isGameOver
                    ? "border-pink-400 ring-2 ring-pink-200"
                    : "border-transparent"
                } ${
                  {
                    correct: "bg-green-400 text-purple-800",
                    wrongPosition: "bg-yellow-300 text-purple-800",
                    incorrect: "bg-red-400 text-purple-800",
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
          className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded text-white text-lg font-medium transition"
        >
          ENTER
        </button>
      ) : (
        <button
          onClick={handleRestart}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white text-lg font-medium transition"
        >
          RESTART
        </button>
      )}
      
      {isGameOver && gameWon && (
        <div className="text-green-400 mt-4 text-xl font-bold">You're awesome! 😽</div>
      )}
      
      {isGameOver && !gameWon && (
        <div className="text-red-400 mt-4 text-xl font-bold">
          Game Over! The word was: <span className="text-yellow-300">{chosenWord.toUpperCase()}</span>
        </div>
      )}
      
      <div className="text-sm text-gray-400 mt-2 text-center">
        Use arrow keys to navigate • Enter to submit • Backspace to delete
      </div>
    </div>
  );
}