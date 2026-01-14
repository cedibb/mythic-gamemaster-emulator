import React, { useState } from "react";
import { useGame } from "../context/useGame";
import type { Likelihood } from "../lib/types";
import { checkFateQuestion, isRandomEvent } from "../lib/fateChart";
import { rollRandomEvent } from "../lib/randomEvent";
import type { RandomEvent } from "../lib/types";
import dice from "../lib/dice";
import DieIcon from "./DieIcon";

const likelihoods: Likelihood[] = [
  "Impossible",
  "No Way",
  "Very Unlikely",
  "Unlikely",
  "Fifty/Fifty",
  "Somewhat Likely",
  "Likely",
  "Very Likely",
  "Near Sure Thing",
  "A Sure Thing",
  "Has To Be",
];

const FateCheck: React.FC = () => {
  const { gameState, addFateQuestion, addLog } = useGame();
  const [question, setQuestion] = useState("");
  const [likelihood, setLikelihood] = useState<Likelihood>("Fifty/Fifty");
  type FateCheckResult = {
    answer: string;
    roll: number;
    target: number;
    randomEvent?: boolean;
    event?: RandomEvent;
    selected?: { type: string; name: string; description?: string } | null;
  };
  const [result, setResult] = useState<FateCheckResult | null>(null);
  

  const handleRoll = async () => {
    // Request an animated percentile roll (show modal)
    const fateMap = await dice.requestAnimatedRollGroup("Rolling fate check", [
      { key: "fateRoll", spec: "1d100", label: "Fate Roll" },
    ]);
    const roll = fateMap.fateRoll;

    const fateResult = checkFateQuestion(likelihood, gameState.chaos, roll);
    const randomEventTriggered = isRandomEvent(fateResult.roll, gameState.chaos);

    let event: RandomEvent | undefined;
    if (randomEventTriggered) {
      // Reopen modal with Random Event title and roll focus + meaning
      const focusMap = await dice.requestAnimatedRollGroup("Random Event!", [
        { key: "focusRoll", spec: "1d100", label: "Focus" },
      ]);
      const focusRoll = focusMap.focusRoll;
      // Animate meaning as a grouped table roll so the modal shows both placeholders
      const meaning = await dice.requestAnimatedRollGroup("Random Event!", [
        { key: "actionRoll", spec: "1d100", label: "Action" },
        { key: "descriptionRoll", spec: "1d100", label: "Description" },
      ]);
      event = rollRandomEvent(focusRoll, {
        actionRoll: meaning.actionRoll,
        descriptionRoll: meaning.descriptionRoll,
      });
    }

    setResult({
      ...fateResult,
      randomEvent: randomEventTriggered,
      event,
      selected: undefined,
    });

    addFateQuestion({
      question,
      likelihood,
      chaos: gameState.chaos,
      answer: fateResult.answer,
      roll: fateResult.roll,
    });
    addLog({
      timestamp: Date.now(),
      type: "oracle",
      message: `Q: ${question} [${likelihood}, Chaos ${gameState.chaos}] → ${
        fateResult.answer
      } (Roll: ${fateResult.roll}${
        randomEventTriggered ? ", Random Event!" : ""
      })`,
    });

    if (randomEventTriggered && event) {
      let extra = "";
      let selected: {
        type: string;
        name: string;
        description?: string;
      } | null = null;
      // PC-related focuses
      const pcFocuses = ["PC action", "PC positive", "PC negative"];
      // NPC-related focuses
      const npcFocuses = [
        "NPC action",
        "Introduce a new NPC",
        "NPC negative",
        "NPC positive",
      ];
      // Thread-related focuses
      const threadFocuses = [
        "Move toward a thread",
        "Move away from a thread",
        "Close a thread",
      ];
      if (pcFocuses.includes(event.focus)) {
        if (gameState.pcs && gameState.pcs.length > 0) {
          const pc =
            gameState.pcs[Math.floor(Math.random() * gameState.pcs.length)];
          selected = { type: "PC", name: pc.name, description: pc.description };
          extra = ` (PC: ${pc.name}${
            pc.description ? ` - ${pc.description}` : ""
          })`;
        } else {
          extra = " (No PCs present)";
        }
      } else if (npcFocuses.includes(event.focus)) {
        if (gameState.npcs && gameState.npcs.length > 0) {
          const npc =
            gameState.npcs[Math.floor(Math.random() * gameState.npcs.length)];
          selected = {
            type: "NPC",
            name: npc.name,
            description: npc.description,
          };
          extra = ` (NPC: ${npc.name}${
            npc.description ? ` - ${npc.description}` : ""
          })`;
        } else if (event.focus === "Introduce a new NPC") {
          extra = " (No NPCs present, introduce a new one!)";
        } else {
          extra = " (No NPCs present)";
        }
      } else if (threadFocuses.includes(event.focus)) {
        const openThreads = gameState.threads.filter((t) => !t.resolved);
        if (openThreads.length > 0) {
          const thread =
            openThreads[Math.floor(Math.random() * openThreads.length)];
          selected = { type: "Thread", name: thread.description };
          extra = ` (Thread: ${thread.description})`;
        } else {
          extra = " (No open threads)";
        }
      }
      addLog({
        timestamp: Date.now(),
        type: "event",
        message: `Random Event: ${event.focus} — ${event.meaning.action} / ${event.meaning.description}${extra}`,
      });
      // Attach selected to result for UI
      setResult((prev) =>
        prev && randomEventTriggered && event ? { ...prev, selected } : prev
      );
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-5">
      <h2 className="text-lg font-medium text-slate-200 mb-4">Fate Check</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
            placeholder="Will the guard let me pass?"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Likelihood
          </label>
          <select
            value={likelihood}
            onChange={(e) => setLikelihood(e.target.value as Likelihood)}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded text-sm text-slate-200 focus:outline-none focus:border-slate-600 transition-colors cursor-pointer"
          >
            {likelihoods.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleRoll}
        className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium py-2 px-4 rounded text-sm transition-colors"
      >
        Roll
      </button>

      

      {result && (
        <div className="mt-6 p-4 bg-slate-800/40 dark:bg-slate-900 rounded-lg space-y-2">
          <div className="text-lg font-semibold text-slate-200 dark:text-slate-100">
            Answer:{" "}
            <span
              className={
                result.answer.includes("Yes")
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {result.answer}
            </span>
          </div>
          <div className="text-sm text-slate-400 dark:text-slate-300 flex items-center gap-3">
            <div>Roll:</div>
            <div>
              <DieIcon spec={"1d100"} value={result.roll} size={36} />
            </div>
            <div className="text-slate-500">(Target: {result.target})</div>
          </div>
          {result.randomEvent && result.event && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 rounded">
              <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                Random Event!
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Focus: {result.event.focus}
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                {(() => {
                  // Replicate the logic for extra from handleRoll, log style
                  const event = result.event;
                  const pcFocuses = ["PC action", "PC positive", "PC negative"];
                  const npcFocuses = [
                    "NPC action",
                    "Introduce a new NPC",
                    "NPC negative",
                    "NPC positive",
                  ];
                  const threadFocuses = [
                    "Move toward a thread",
                    "Move away from a thread",
                    "Close a thread",
                  ];
                  let target = "";
                  if (pcFocuses.includes(event.focus)) {
                    if (result.selected) {
                      target = ` (PC: ${result.selected.name}${
                        result.selected.description
                          ? ` - ${result.selected.description}`
                          : ""
                      })`;
                    } else {
                      target = " (No PCs present)";
                    }
                  } else if (npcFocuses.includes(event.focus)) {
                    if (result.selected) {
                      target = ` (NPC: ${result.selected.name}${
                        result.selected.description
                          ? ` - ${result.selected.description}`
                          : ""
                      })`;
                    } else if (event.focus === "Introduce a new NPC") {
                      target = " (No NPCs present, introduce a new one!)";
                    } else {
                      target = " (No NPCs present)";
                    }
                  } else if (threadFocuses.includes(event.focus)) {
                    if (result.selected) {
                      target = ` (Thread: ${result.selected.name})`;
                    } else {
                      target = " (No open threads)";
                    }
                  }
                  return `Meaning: ${event.meaning.action} / ${event.meaning.description}${target}`;
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FateCheck;
