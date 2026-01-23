import React, { useState, useEffect } from "react";
import { useGame } from "../context/useGame";
import { checkSceneInterrupt } from "../lib/scene";
import { rollRandomEvent } from "../lib/randomEvent";
import dice from "../lib/dice";
import DieIcon from "./DieIcon";
import type { RandomEvent } from "../lib/types";

const SceneManager: React.FC = () => {
  const { gameState, addScene, addLog, updateChaos } = useGame();
  // No setup/description needed

  const [showResult, setShowResultState] = useState<{
    interrupt: boolean;
    roll: number;
    event?: RandomEvent;
  } | null>(() => {
    const stored = localStorage.getItem("mythic-gme-scene-alert");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        /* empty */
      }
    }
    return null;
  });

  const setShowResult = (val: typeof showResult) => {
    setShowResultState(val);
    if (val) {
      localStorage.setItem("mythic-gme-scene-alert", JSON.stringify(val));
    } else {
      localStorage.removeItem("mythic-gme-scene-alert");
    }
  };

  // Clear any in-memory/transient showResult state when the app is reset
  useEffect(() => {
    const handler = () => setShowResult(null);
    window.addEventListener("mythic-gme:reset", handler);
    return () => window.removeEventListener("mythic-gme:reset", handler);
  }, []);
  const [showSceneSetup, setShowSceneSetup] = useState(false);
  const [sceneDesc, setSceneDesc] = useState("");
  const [chaos, setChaos] = useState(gameState.chaos);

  const handleStartScene = () => {
    setSceneDesc("");
    setChaos(gameState.chaos);
    setShowSceneSetup(true);
  };

  const handleConfirmScene = () => {
    updateChaos(chaos);
    const run = async () => {
      let interruptMap: any;
      if (gameState.animationsEnabled) {
        interruptMap = await dice.requestAnimatedRollGroup("Rolling new scene", [
          { key: "interruptRoll", spec: "1d100", label: "Interrupt Roll" },
        ]);
      } else {
        interruptMap = { interruptRoll: dice.rollDice("1d100") };
      }
      const roll = interruptMap.interruptRoll;
      const interruptCheck = checkSceneInterrupt(chaos, roll);
      let event;
      if (interruptCheck.interrupt) {
        // Reopen modal with interrupt title and roll meaning table
        let focusMap: any;
        if (gameState.animationsEnabled) {
          focusMap = await dice.requestAnimatedRollGroup("Scene interrupted!", [
            { key: "focusRoll", spec: "1d100", label: "Focus" },
          ]);
        } else {
          focusMap = { focusRoll: dice.rollDice("1d100") };
        }
        const focusRoll = focusMap.focusRoll;
        let meaning: any;
        if (gameState.animationsEnabled) {
          meaning = await dice.requestAnimatedRollGroup("Scene interrupted!", [
            { key: "actionRoll", spec: "1d100", label: "Action" },
            { key: "descriptionRoll", spec: "1d100", label: "Description" },
          ]);
        } else {
          meaning = {
            actionRoll: dice.rollDice("1d100"),
            descriptionRoll: dice.rollDice("1d100"),
          };
        }
        event = rollRandomEvent(focusRoll, {
          actionRoll: meaning.actionRoll,
          descriptionRoll: meaning.descriptionRoll,
        });
      }

      const scene = {
        number: gameState.scenes.length + 1,
        interrupt: interruptCheck.interrupt,
        chaos,
        timestamp: Date.now(),
        description: sceneDesc,
      };
      addScene(scene);
      setShowResult({ ...interruptCheck, event });
      setShowSceneSetup(false);
      // Include the interrupt roll in the scene log so the session log can
      // display the die badge and any relevant details without needing the
      // separate alert box to be present.
      addLog({
        timestamp: Date.now(),
        type: "scene",
        message: `Scene ${scene.number} started${
          interruptCheck.interrupt ? " (Interrupted)" : ""
        }${" "}${interruptCheck && typeof interruptCheck.roll === "number" ? `(Roll: ${interruptCheck.roll})` : ""}`,
      });
      if (interruptCheck.interrupt && event) {
        addLog({
          timestamp: Date.now(),
          type: "event",
          message: `Scene Interrupt: ${event.focus} — ${event.meaning.action} / ${event.meaning.description}`,
        });
      }
    };
    run();
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-5">
      <h2 className="text-lg font-medium text-slate-200 mb-4">Scene</h2>

      <div className="space-y-4">
        <button
          onClick={handleStartScene}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded text-sm transition-colors"
        >
          Start New Scene
        </button>

        {showSceneSetup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                New Scene Setup
              </h3>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Scene Description
              </label>
              <input
                type="text"
                value={sceneDesc}
                onChange={(e) => setSceneDesc(e.target.value)}
                className="w-full px-3 py-2 mb-4 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500"
                placeholder="Describe the scene..."
              />
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Chaos Factor
              </label>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-slate-500">1</span>
                <input
                  type="range"
                  min={1}
                  max={9}
                  value={chaos}
                  onChange={(e) => setChaos(Number(e.target.value))}
                  className="flex-1 accent-slate-600"
                />
                <span className="text-xs text-slate-500">9</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mb-4">
                <span>↑ Increase when things go badly</span>
                <span>↓ Decrease when PCs regain control</span>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowSceneSetup(false)}
                  className="px-4 py-2 rounded bg-slate-700 text-slate-300 hover:bg-slate-800 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmScene}
                  className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 text-sm"
                >
                  Start Scene
                </button>
              </div>
            </div>
          </div>
        )}

        {showResult && (
          <div
            className={`relative mt-4 p-4 rounded-lg border ${
              showResult.interrupt
                ? "bg-red-900/20 border-red-800/50"
                : "bg-green-900/20 border-green-800/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`font-medium text-sm ${
                  showResult.interrupt ? "text-red-300" : "text-green-300"
                }`}
              >
                {showResult.interrupt
                  ? "Scene Interrupted"
                  : "Scene Proceeds As Expected"}
              </div>
              <div
                className="text-2xl font-bold text-slate-200 ml-4 flex-shrink-0"
                title="Chaos Level"
              >
                Chaos:{" "}
                <span
                  className={
                    showResult.interrupt ? "text-red-300" : "text-green-300"
                  }
                >
                  {gameState.chaos}
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-3">
              <div>Roll:</div>
              <DieIcon spec={"1d100"} value={showResult.roll} size={28} />
            </div>

            {showResult.interrupt && showResult.event && (
              <div className="mt-3 pt-3 border-t border-red-800/50">
                <div className="font-medium text-xs text-red-400 mb-2">
                  Altered Scene:
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">Focus:</span>{" "}
                    {showResult.event.focus}
                  </div>
                  <div>
                    <span className="text-slate-400">Action:</span>{" "}
                    {showResult.event.meaning.action}
                  </div>
                  <div>
                    <span className="text-slate-400">Description:</span>{" "}
                    {showResult.event.meaning.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneManager;
