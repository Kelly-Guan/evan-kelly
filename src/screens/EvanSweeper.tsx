import Boards from '../components/boards'

export default function EvanSweeper() {

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200">
      <h1 className="text-4xl my-5 text-purple-900">evan sweeper 🧹</h1>
      <Boards />
      </div>
    </>
  )
  
}

