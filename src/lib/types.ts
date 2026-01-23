// Mythic GME Types

export type Likelihood =
  | "Impossible"
  | "No Way"
  | "Very Unlikely"
  | "Unlikely"
  | "Fifty/Fifty"
  | "Somewhat Likely"
  | "Likely"
  | "Very Likely"
  | "Near Sure Thing"
  | "A Sure Thing"
  | "Has To Be";

export type Answer = "Yes" | "No" | "Exceptional Yes" | "Exceptional No";

export interface FateQuestion {
  question: string;
  likelihood: Likelihood;
  chaos: number;
  answer?: Answer;
  roll?: number;
}

export interface RandomEvent {
  focus: string;
  meaning: {
    action: string;
    description: string;
  };
}

export interface Scene {
  number: number;
  interrupt: boolean;
  chaos: number;
  timestamp: number;
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  resolved: boolean;
}

export interface PC {
  id: string;
  name: string;
  description: string;
  resolved: boolean;
}

export interface Thread {
  id: string;
  description: string;
  resolved: boolean;
}

export interface LogEntry {
  timestamp: number;
  type: string;
  message: string;
}

export interface DiceColors {
  bodyColor: string;
  textColor: string;
}

export interface GameState {
  chaos: number;
  scenes: Scene[];
  pcs: PC[];
  npcs: NPC[];
  threads: Thread[];
  fateQuestions: FateQuestion[];
  log: LogEntry[];
  diceColors?: DiceColors;
  animationsEnabled?: boolean;
}
