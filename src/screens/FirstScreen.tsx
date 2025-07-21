import { useState } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../assets/questions.json"

export default function FirstScreen({ onAuthenticate }: { onAuthenticate: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [currentQ, setCurrentQ] = useState(() => {
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
    <>
      <h1 className="text-4xl my-5 text-stone-400">{currentQ.question}</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError("");
        }}
        onKeyDown={handleKeyDown}
        placeholder="enter your answer"
        className="p-2 rounded border border-stone-400 bg-stone-900 text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 text-center"
      />
      {error && (
        <p className="mt-3 text-red-700 text-lg flex flex-col items-center justify-center ">
          {error} <br />
          <span className="text-purple-800 italic">{currentQ.hint}</span>
        </p>
      )}
    </>
  );
}
