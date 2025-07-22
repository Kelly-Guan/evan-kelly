import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col justify-center items-center text-white bg-black text-center p-4">
      <h1 className="text-6xl font-bold mb-4">401 🤦‍♀️</h1>
      <p className="text-lg mb-6">where the heck are you going broski?</p>
      <button
        onClick={() => navigate("/")}
        className="bg-purple-900 px-6 py-3 rounded hover:bg-purple-700 transition"
      >
        Go Home
      </button>
    </div>
  );
}
