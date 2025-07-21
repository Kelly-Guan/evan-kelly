import '../index.css'; 
import FirstScreen from './screens/FirstScreen';

function App({ onAuthenticate }: { onAuthenticate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <FirstScreen onAuthenticate={onAuthenticate} />
    </div>
  );
}

export default App;
