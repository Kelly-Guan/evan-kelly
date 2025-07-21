import { useState } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../assets/questions.json"
import USuck  from "../assets/usuck.png";


export default function LockScreen({ onAuthenticate }: { onAuthenticate: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [currentQ] = useState(() => {
    return questions[Math.floor(Math.random() * questions.length)];
  });
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim().toLowerCase() === currentQ.answer.toLowerCase()) {
        onAuthenticate();
        navigate("/Home");
      } else {
        setError("WRONG BITCH!")
      }
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl mb-7 text-stone-400 text-center font-mono">{currentQ.question}</h1>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="enter your answer"
          className="p-2 rounded border border-stone-400 bg-stone-900 text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 text-center font-mono"
        />
        {error && (
          <div className="mt-3 text-red-700 text-lg flex items-center gap-2 font-mono">
            {error}
            <img src={USuck} alt="you suck" className="w-10 h-10" />
          </div>
        )}
      </div>
      {error && (
      <div className="text-center mb-4">
        <p className="text-stone-400 italic text-sm font-mono">hint: {currentQ.hint}</p>
      </div>)}
    </div>
  );
  
}  