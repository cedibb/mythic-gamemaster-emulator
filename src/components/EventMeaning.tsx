import React, { useState, useEffect } from "react";
import { useGame } from "../context/useGame";
import { rollEventMeaning } from "../lib/eventMeaning";
import dice from "../lib/dice";
import DieIcon from "./DieIcon";

const EventMeaning: React.FC = () => {
  const { gameState, addLog } = useGame();
  type EventMeaningResult = {
    action: string;
    description: string;
    actionRoll: number;
    descriptionRoll: number;
  };
  const [result, setResult] = useState<EventMeaningResult | null>(null);

  useEffect(() => {
    const handler = () => setResult(null);
    window.addEventListener("mythic-gme:reset", handler);
    return () => window.removeEventListener("mythic-gme:reset", handler);
  }, []);

  const handleRoll = async () => {
    let meaning: any;
    if (gameState.animationsEnabled) {
      meaning = await dice.requestAnimatedRollGroup("Event Meaning", [
        { key: "actionRoll", spec: "1d100", label: "Action" },
        { key: "descriptionRoll", spec: "1d100", label: "Description" },
      ]);
    } else {
      meaning = {
        actionRoll: dice.rollDice("1d100"),
        descriptionRoll: dice.rollDice("1d100"),
      };
    }

    const eventMeaning = rollEventMeaning(
      meaning.actionRoll,
      meaning.descriptionRoll,
    );

    setResult({
      ...eventMeaning,
      actionRoll: meaning.actionRoll,
      descriptionRoll: meaning.descriptionRoll,
    });

    addLog({
      timestamp: Date.now(),
      type: "event-meaning",
      message: `Event Meaning: ${eventMeaning.action} / ${eventMeaning.description} (Action ${meaning.actionRoll}, Desc ${meaning.descriptionRoll})`,
    });
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-5">
      <h2 className="text-lg font-medium text-slate-200 mb-4">Event Meaning</h2>

      <div className="space-y-4">
        <button
          onClick={handleRoll}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium py-2 px-4 rounded text-sm transition-colors"
        >
          Roll Event Meaning
        </button>

        {result && (
          <div className="mt-6 p-4 bg-slate-800/40 dark:bg-slate-900 rounded-lg space-y-2">
            <div className="text-lg font-semibold text-slate-200">
              {result.action} / {result.description}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-400">Action Roll</div>
                <div>
                  <DieIcon value={result.actionRoll} size={48} />
                </div>
                <div className="text-sm text-slate-500">
                  {result.actionRoll}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-400">Description Roll</div>
                <div>
                  <DieIcon value={result.descriptionRoll} size={48} />
                </div>
                <div className="text-sm text-slate-500">
                  {result.descriptionRoll}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventMeaning;
