import { rollEventMeaning } from "./eventMeaning";
import type { RandomEvent } from "./types";

const EVENT_FOCUS = [
  "Remote event",
  "NPC action",
  "Introduce a new NPC",
  "Move toward a thread",
  "Move away from a thread",
  "Close a thread",
  "PC negative",
  "PC positive",
  "Ambiguous event",
  "NPC negative",
  "NPC positive",
];

export function rollRandomEvent(): RandomEvent {
  const focusRoll = Math.floor(Math.random() * 100) + 1;
  let focusIndex: number;

  if (focusRoll <= 7) focusIndex = 0;
  else if (focusRoll <= 28) focusIndex = 1;
  else if (focusRoll <= 35) focusIndex = 2;
  else if (focusRoll <= 45) focusIndex = 3;
  else if (focusRoll <= 52) focusIndex = 4;
  else if (focusRoll <= 55) focusIndex = 5;
  else if (focusRoll <= 67) focusIndex = 6;
  else if (focusRoll <= 75) focusIndex = 7;
  else if (focusRoll <= 83) focusIndex = 8;
  else if (focusRoll <= 92) focusIndex = 9;
  else focusIndex = 10;

  const focus = EVENT_FOCUS[focusIndex];
  const meaning = rollEventMeaning();

  return { focus, meaning };
}
