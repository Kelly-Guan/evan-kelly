import Words from '../components/evanwordle/wordle'

export default function EvanWords() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200">
      <h1 className="text-4xl my-5 text-purple-900 font-mono">evan yaps 🥰</h1>
      
        <Words />
      </div>
    </>
  )
  
}

