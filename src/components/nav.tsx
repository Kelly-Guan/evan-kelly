import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 bg-purple-200 text-purple-900 p-4 flex justify-between items-center z-50 border-b border-stone-200">
      <button
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/Home")}
      >evan & kelly 🫶</button>
      <button
        onClick={() => navigate("/EvanSweeper")}
        className={`p-px px-3 rounded-sm text-purple-900 hover:bg-purple-300 cursor-pointer`}
      >
        evan sweeper 🧹
      </button> 
    </div>
  );
}
