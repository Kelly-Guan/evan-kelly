import "../index.css";
import LockScreen from "./screens/LockScreen";

function App({ onAuthenticate }: { onAuthenticate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <LockScreen onAuthenticate={onAuthenticate} />
    </div>
  );
}

export default App;
