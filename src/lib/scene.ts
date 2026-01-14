import { rollD100, isRandomEvent } from "./fateChart";

export function checkSceneInterrupt(
  chaos: number,
  providedRoll?: number
): {
  interrupt: boolean;
  roll: number;
} {
  const roll = typeof providedRoll === "number" ? providedRoll : rollD100();
  // Use digit-based random event rule from Mythic 2E: both percentile digits <= chaos and not doubles
  const interrupt = isRandomEvent(roll, chaos);

  return { interrupt, roll };
}

export function adjustChaos(chaos: number, adjustment: -1 | 0 | 1): number {
  const newChaos = chaos + adjustment;
  return Math.max(1, Math.min(9, newChaos));
}
