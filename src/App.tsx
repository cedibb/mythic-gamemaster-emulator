import { GameProvider } from "./context/GameContext";
import { useGame } from "./context/useGame";
import FateCheck from "./components/FateCheck";
import SceneManager from "./components/SceneManager";
import ListsManager from "./components/ListsManager";
import SessionLog from "./components/SessionLog";

function HeaderActions() {
  const { resetGame } = useGame();
  return (
    <div className="flex gap-2 ml-4">
      <button
        className="px-3 py-1 rounded bg-red-900 text-xs text-white border border-red-700 hover:bg-red-700 transition"
        onClick={resetGame}
        title="Reset session"
      >
        Reset
      </button>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-slate-950 pointer-events-none" />

        <div className="relative z-10">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
                  Mythic GME
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Game Master Emulator
                </p>
              </div>
              <HeaderActions />
            </header>


            <div className="space-y-4">
              <SceneManager />
              <FateCheck />
            </div>

            <div className="mt-4">
              <ListsManager />
              <SessionLog />
            </div>

            <footer className="text-center py-6 mt-8 border-t border-slate-800/50">
              <p className="text-xs text-slate-600">
                Based on Mythic Game Master Emulator by Tana Pigeon
              </p>
            </footer>
          </div>
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
