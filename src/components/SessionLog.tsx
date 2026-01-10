import React from "react";
import { useGame } from "../context/useGame";

const SessionLog: React.FC = () => {
  const { gameState } = useGame();
  return (
    <div className="bg-slate-900/80 border border-slate-800/50 rounded-lg p-4 max-h-60 overflow-y-auto text-xs text-slate-300 mt-6">
      <div className="font-bold text-slate-200 mb-2">Session Log</div>
      {gameState.log.length === 0 ? (
        <div className="text-slate-500">No log entries yet.</div>
      ) : (
        <ul className="space-y-1">
          {gameState.log
            .slice()
            .reverse()
            .map((entry: import("../lib/types").LogEntry, i: number) => (
              <li
                key={i}
                className={
                  entry.type === "error"
                    ? "text-red-400"
                    : entry.type === "system"
                    ? "text-mythic-teal"
                    : ""
                }
              >
                <span className="text-slate-500 mr-2">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                {entry.message}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SessionLog;
