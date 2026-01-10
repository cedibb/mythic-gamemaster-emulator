import { rollD100 } from "./fateChart";

export function checkSceneInterrupt(chaos: number): {
  interrupt: boolean;
  roll: number;
} {
  const roll = rollD100();
  const interrupt = roll <= chaos;

  return { interrupt, roll };
}

export function adjustChaos(chaos: number, adjustment: -1 | 0 | 1): number {
  const newChaos = chaos + adjustment;
  return Math.max(1, Math.min(9, newChaos));
}
