import React, { useState } from "react";
import { useGame } from "../context/useGame";

const ListsManager: React.FC = () => {
  const {
    gameState,
    addNPC,
    removeNPC,
    addThread,
    removeThread,
    toggleThreadResolved,
    togglePCResolved,
    toggleNPCResolved,
    addPC,
    removePC,
  } = useGame();
  const [npcName, setNpcName] = useState("");
  const [npcDesc, setNpcDesc] = useState("");
  const [pcName, setPcName] = useState("");
  const [pcDesc, setPcDesc] = useState("");
  const [threadDesc, setThreadDesc] = useState("");
  const [activeTab, setActiveTab] = useState<"pcs" | "npcs" | "threads">("pcs");

  const handleAddPC = () => {
    if (!pcName.trim()) return;
    addPC({
      id: Date.now().toString(),
      name: pcName.trim(),
      description: pcDesc.trim(),
      resolved: false,
    });
    setPcName("");
    setPcDesc("");
  };

  const handleAddNPC = () => {
    if (!npcName.trim()) return;
    addNPC({
      id: Date.now().toString(),
      name: npcName.trim(),
      description: npcDesc.trim(),
      resolved: false,
    });
    setNpcName("");
    setNpcDesc("");
  };

  const handleAddThread = () => {
    if (!threadDesc.trim()) return;
    addThread({
      id: Date.now().toString(),
      description: threadDesc.trim(),
      resolved: false,
    });
    setThreadDesc("");
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-5">
      <h2 className="text-lg font-medium text-slate-200 mb-4">Lists</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("pcs")}
          className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
            activeTab === "pcs"
              ? "bg-slate-700 text-slate-200"
              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
          }`}
        >
          PCs ({gameState.pcs.length})
        </button>
        <button
          onClick={() => setActiveTab("npcs")}
          className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
            activeTab === "npcs"
              ? "bg-slate-700 text-slate-200"
              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
          }`}
        >
          NPCs ({gameState.npcs.length})
        </button>
        <button
          onClick={() => setActiveTab("threads")}
          className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
            activeTab === "threads"
              ? "bg-slate-700 text-slate-200"
              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
          }`}
        >
          Threads
        </button>
      </div>

      {activeTab === "pcs" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              value={pcName}
              onChange={(e) => setPcName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
              placeholder="PC Name"
            />
            <input
              type="text"
              value={pcDesc}
              onChange={(e) => setPcDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
              placeholder="Description (optional)"
            />
            <button
              onClick={handleAddPC}
              disabled={!pcName.trim()}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800/50 text-slate-200 disabled:text-slate-600 font-medium py-2 px-4 rounded text-sm transition-colors disabled:cursor-not-allowed"
            >
              Add PC
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {gameState.pcs.map((pc: import("../lib/types").PC) => (
              <div
                key={pc.id}
                className={`flex items-start justify-between p-3 border rounded transition-colors ${
                  pc.resolved
                    ? "bg-slate-800/20 border-slate-800/50 opacity-70"
                    : "bg-slate-800/30 border-slate-800/50 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-200 text-sm flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pc.resolved}
                      onChange={() => togglePCResolved(pc.id)}
                      className="mr-2 w-4 h-4 rounded border-slate-600 text-slate-600 focus:ring-slate-500 cursor-pointer"
                      title="Toggle resolved"
                    />
                    <span
                      className={
                        pc.resolved ? "line-through text-slate-500" : undefined
                      }
                    >
                      {pc.name}
                    </span>
                  </div>
                  {pc.description && (
                    <div
                      className={
                        pc.resolved
                          ? "text-xs text-slate-400 mt-1 line-through text-slate-500"
                          : "text-xs text-slate-400 mt-1"
                      }
                    >
                      {pc.description}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removePC(pc.id)}
                  className="ml-3 text-slate-500 hover:text-red-400 text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            {gameState.pcs.length === 0 && (
              <div className="text-center text-slate-500 py-8 bg-slate-800/20 rounded">
                <div className="text-sm">No PCs yet</div>
                <div className="text-xs mt-1">
                  Add player characters to track them
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === "npcs" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              value={npcName}
              onChange={(e) => setNpcName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
              placeholder="NPC Name"
            />
            <input
              type="text"
              value={npcDesc}
              onChange={(e) => setNpcDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
              placeholder="Description (optional)"
            />
            <button
              onClick={handleAddNPC}
              disabled={!npcName.trim()}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800/50 text-slate-200 disabled:text-slate-600 font-medium py-2 px-4 rounded text-sm transition-colors disabled:cursor-not-allowed"
            >
              Add NPC
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {gameState.npcs.map((npc: import("../lib/types").NPC) => (
              <div
                key={npc.id}
                className={`flex items-start justify-between p-3 border rounded transition-colors ${
                  npc.resolved
                    ? "bg-slate-800/20 border-slate-800/50 opacity-70"
                    : "bg-slate-800/30 border-slate-800/50 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-200 text-sm flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={npc.resolved}
                      onChange={() => toggleNPCResolved(npc.id)}
                      className="mr-2 w-4 h-4 rounded border-slate-600 text-slate-600 focus:ring-slate-500 cursor-pointer"
                      title="Toggle resolved"
                    />
                    <span
                      className={
                        npc.resolved ? "line-through text-slate-500" : undefined
                      }
                    >
                      {npc.name}
                    </span>
                  </div>
                  {npc.description && (
                    <div
                      className={
                        npc.resolved
                          ? "text-xs text-slate-400 mt-1 line-through text-slate-500"
                          : "text-xs text-slate-400 mt-1"
                      }
                    >
                      {npc.description}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeNPC(npc.id)}
                  className="ml-3 text-slate-500 hover:text-red-400 text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            {gameState.npcs.length === 0 && (
              <div className="text-center text-slate-500 py-8 bg-slate-800/20 rounded">
                <div className="text-sm">No NPCs yet</div>
                <div className="text-xs mt-1">Add characters to track them</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              value={threadDesc}
              onChange={(e) => setThreadDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
              placeholder="Thread description"
            />
            <button
              onClick={handleAddThread}
              disabled={!threadDesc.trim()}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800/50 text-slate-200 disabled:text-slate-600 font-medium py-2 px-4 rounded text-sm transition-colors disabled:cursor-not-allowed"
            >
              Add Thread
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {gameState.threads.map((thread: import("../lib/types").Thread) => (
              <div
                key={thread.id}
                className={`flex items-start justify-between p-3 rounded border transition-colors ${
                  thread.resolved
                    ? "bg-slate-800/20 opacity-50 border-slate-800/50"
                    : "bg-slate-800/30 border-slate-800/50 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-start gap-2 flex-1">
                  <input
                    type="checkbox"
                    checked={thread.resolved}
                    onChange={() => toggleThreadResolved(thread.id)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-600 text-slate-600 focus:ring-slate-500 cursor-pointer"
                  />
                  <div
                    className={`flex-1 text-sm ${
                      thread.resolved
                        ? "line-through text-slate-500"
                        : "text-slate-300"
                    }`}
                  >
                    {thread.description}
                  </div>
                </div>
                <button
                  onClick={() => removeThread(thread.id)}
                  className="ml-3 text-slate-500 hover:text-red-400 text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            {gameState.threads.length === 0 && (
              <div className="text-center text-slate-500 py-8 bg-slate-800/20 rounded">
                <div className="text-sm">No threads yet</div>
                <div className="text-xs mt-1">Add story threads to track</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListsManager;
