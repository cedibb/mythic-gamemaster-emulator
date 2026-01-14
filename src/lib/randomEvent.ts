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

export function rollRandomEvent(
  focusRoll?: number,
  meaningRolls?: { actionRoll?: number; descriptionRoll?: number }
): RandomEvent {
  const fRoll = typeof focusRoll === "number" ? focusRoll : Math.floor(Math.random() * 100) + 1;
  let focusIndex: number;

  if (fRoll <= 7) focusIndex = 0;
  else if (fRoll <= 28) focusIndex = 1;
  else if (fRoll <= 35) focusIndex = 2;
  else if (fRoll <= 45) focusIndex = 3;
  else if (fRoll <= 52) focusIndex = 4;
  else if (fRoll <= 55) focusIndex = 5;
  else if (fRoll <= 67) focusIndex = 6;
  else if (fRoll <= 75) focusIndex = 7;
  else if (fRoll <= 83) focusIndex = 8;
  else if (fRoll <= 92) focusIndex = 9;
  else focusIndex = 10;

  const focus = EVENT_FOCUS[focusIndex];
  const meaning = rollEventMeaning(
    meaningRolls?.actionRoll,
    meaningRolls?.descriptionRoll
  );

  return { focus, meaning };
}
