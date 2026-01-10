import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type {
  GameState,
  Scene,
  NPC,
  Thread,
  FateQuestion,
  LogEntry,
  PC,
} from "../lib/types";

export interface GameContextType {
  gameState: GameState;
  updateChaos: (chaos: number) => void;
  addScene: (scene: Scene) => void;
  addPC: (pc: PC) => void;
  removePC: (id: string) => void;
  addNPC: (npc: NPC) => void;
  removeNPC: (id: string) => void;
  addThread: (thread: Thread) => void;
  removeThread: (id: string) => void;
  togglePCResolved: (id: string) => void;
  toggleNPCResolved: (id: string) => void;
  toggleThreadResolved: (id: string) => void;
  addFateQuestion: (question: FateQuestion) => void;
  addLog: (entry: LogEntry) => void;
  resetGame: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialState: GameState = {
    chaos: 5,
    scenes: [],
    pcs: [],
    npcs: [],
    threads: [],
    fateQuestions: [],
    log: [],
  };
  const addPC = (pc: PC) => {
    setGameState((prev: GameState) => ({
      ...prev,
      pcs: [...prev.pcs, { ...pc, resolved: false }],
    }));
  };

  const removePC = (id: string) => {
    setGameState((prev: GameState) => ({
      ...prev,
      pcs: prev.pcs.filter((p: PC) => p.id !== id),
    }));
  };
  const [gameState, setGameState] = useState<GameState>(() => {
    const data = localStorage.getItem("mythic-gme-state");
    if (data) {
      try {
        return JSON.parse(data) as GameState;
      } catch {
        return initialState;
      }
    }
    return initialState;
  });
  const addLog = (entry: LogEntry) => {
    setGameState((prev: GameState) => ({ ...prev, log: [...prev.log, entry] }));
  };

  // Auto-save on every gameState change
  useEffect(() => {
    localStorage.setItem("mythic-gme-state", JSON.stringify(gameState));
  }, [gameState]);

  const resetGame = () => {
    setGameState(initialState);
  };

  const updateChaos = (chaos: number) => {
    setGameState((prev: GameState) => ({ ...prev, chaos }));
  };

  const addScene = (scene: Scene) => {
    setGameState((prev: GameState) => ({
      ...prev,
      scenes: [...prev.scenes, scene],
    }));
  };

  const addNPC = (npc: NPC) => {
    setGameState((prev: GameState) => ({
      ...prev,
      npcs: [...prev.npcs, { ...npc, resolved: false }],
    }));
  };

  const removeNPC = (id: string) => {
    setGameState((prev: GameState) => ({
      ...prev,
      npcs: prev.npcs.filter((n: NPC) => n.id !== id),
    }));
  };

  const addThread = (thread: Thread) => {
    setGameState((prev: GameState) => ({
      ...prev,
      threads: [
        ...prev.threads,
        {
          ...thread,
          resolved:
            typeof thread.resolved === "boolean" ? thread.resolved : false,
        },
      ],
    }));
  };

  const removeThread = (id: string) => {
    setGameState((prev: GameState) => ({
      ...prev,
      threads: prev.threads.filter((t: Thread) => t.id !== id),
    }));
  };

  const toggleThreadResolved = (id: string) => {
    setGameState((prev: GameState) => ({
      ...prev,
      threads: prev.threads.map((t) =>
        t.id === id ? { ...t, resolved: !t.resolved } : t
      ),
    }));
  };

  const togglePCResolved = (id: string) => {
    setGameState((prev: GameState) => ({
      ...prev,
      pcs: prev.pcs.map((pc) =>
        pc.id === id ? { ...pc, resolved: !pc.resolved } : pc
      ),
    }));
  };

  const toggleNPCResolved = (id: string) => {
    setGameState((prev: GameState) => ({
      ...prev,
      npcs: prev.npcs.map((npc) =>
        npc.id === id ? { ...npc, resolved: !npc.resolved } : npc
      ),
    }));
  };

  const addFateQuestion = (question: FateQuestion) => {
    setGameState((prev: GameState) => ({
      ...prev,
      fateQuestions: [...prev.fateQuestions, question],
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        updateChaos,
        addScene,
        addPC,
        removePC,
        addNPC,
        removeNPC,
        addThread,
        removeThread,
        togglePCResolved,
        toggleNPCResolved,
        toggleThreadResolved,
        addFateQuestion,
        addLog,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
