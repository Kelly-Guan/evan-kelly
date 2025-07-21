import { useState, useEffect } from "react";
import "./FlipClock.css"; // Add this line

export default function Home() {
  const targetDate = new Date("2025-05-31T00:00:00");

  const calculateTimeElapsed = () => {
    const now = new Date();
    const diff = now.getTime() - targetDate.getTime();

    const absDiff = Math.abs(diff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((absDiff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeElapsed, setTimeElapsed] = useState(calculateTimeElapsed());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "DAYS", value: timeElapsed.days },
    { label: "HRS", value: timeElapsed.hours },
    { label: "MIN", value: timeElapsed.minutes },
    { label: "SEC", value: timeElapsed.seconds },
  ];

  return (
    <div className="min-h-screen bg-purple-200 flex flex-col items-center justify-center font-mono px-4">
      <h1 className="text-2xl mb-8 text-purple-900">been dabbing on them haters for</h1>
      <div className="flex gap-4">
        {timeUnits.map((unit, idx) => (
          <div key={idx} className="flip-card">
            <div className="flip-top">{unit.value.toString().padStart(2, "0")}</div>
            <div className="flip-label">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
