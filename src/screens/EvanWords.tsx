import Words from "../components/evanwordle/wordle";

export default function EvanWords() {
  return (
    <>
      <div className="flex flex-col items-center justify-center bg-purple-200 min-h-[calc(100vh-60px)]">
        <h1 className="text-4xl my-5 text-purple-900 font-mono">
          evan yaps 🥰
        </h1>
        <Words />
      </div>
    </>
  );
}
