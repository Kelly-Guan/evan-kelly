import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-stone-300">
      <div className="bg-purple-200 text-purple-900 p-4 flex justify-between items-center mx-12">
      <button
        className="text-lg font-bold cursor-pointer font-mono"
        onClick={() => navigate("/Home")}
      >evan & kelly 🫶</button>
      <div>
      <button
        onClick={() => navigate("/EvanSweeper")}
        className={`p-px px-3 rounded-sm text-purple-900 hover:bg-purple-300 cursor-pointer font-mono ${
          location.pathname === "/EvanSweeper" ? "bg-purple-300" : ""
        }`}
      >
        evan sweeps 🧹
      </button> 
      <button
        onClick={() => navigate("/EvanWords")}
        className={`p-px px-3 rounded-sm text-purple-900 hover:bg-purple-300 cursor-pointer font-mono ${
          location.pathname === "/EvanWords" ? "bg-purple-300" : ""
        }`}
      >
        evan yaps 🥰
      </button> 
      </div>
      </div>
    </div>
  );
}