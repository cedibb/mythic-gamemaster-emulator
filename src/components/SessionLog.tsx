import React from "react";
import { useGame } from "../context/useGame";
import DieIcon from "./DieIcon";

function renderMessageWithDice(message: string) {
  // Replace occurrences like '(Roll: 45)' or '(Roll: 45, Random Event!)'
  const parts: Array<string | React.ReactNode> = [];
  let lastIndex = 0;
  const re = /\(Roll:\s*([0-9]{1,3})([^)]*)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(message))) {
    const idx = m.index;
    if (idx > lastIndex) parts.push(message.slice(lastIndex, idx));
    const rollNum = Number(m[1]);
    const suffix = m[2] || "";
      parts.push(
      <span key={`die-${idx}`} className="inline-flex items-center gap-2 mr-1">
        <DieIcon spec={"1d100"} value={rollNum} size={28} />
        {suffix ? <span className="text-slate-400">{suffix.replace(/^,\s*/, ", ")}</span> : null}
      </span>
    );
    lastIndex = idx + m[0].length;
  }
  if (lastIndex < message.length) parts.push(message.slice(lastIndex));
  return parts.map((p, i) => (typeof p === "string" ? <span key={i}>{p}</span> : p));
}

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
                {/** Render message but replace any '(Roll: N' patterns with a die icon */}
                {renderMessageWithDice(entry.message)}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SessionLog;
