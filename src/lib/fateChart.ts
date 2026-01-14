import type { Likelihood, Answer } from "./types";

// Fate Chart for Mythic GME 2nd Edition
// Rows = Chaos Factor (1-9), Columns = Likelihood
const FATE_CHART: Record<number, Record<Likelihood, number>> = {
  1: {
    Impossible: 0,
    "No Way": 0,
    "Very Unlikely": 5,
    Unlikely: 10,
    "Fifty/Fifty": 15,
    "Somewhat Likely": 25,
    Likely: 35,
    "Very Likely": 50,
    "Near Sure Thing": 75,
    "A Sure Thing": 85,
    "Has To Be": 90,
  },
  2: {
    Impossible: 0,
    "No Way": 5,
    "Very Unlikely": 10,
    Unlikely: 15,
    "Fifty/Fifty": 25,
    "Somewhat Likely": 35,
    Likely: 45,
    "Very Likely": 65,
    "Near Sure Thing": 85,
    "A Sure Thing": 90,
    "Has To Be": 95,
  },
  3: {
    Impossible: 0,
    "No Way": 5,
    "Very Unlikely": 15,
    Unlikely: 25,
    "Fifty/Fifty": 35,
    "Somewhat Likely": 45,
    Likely: 55,
    "Very Likely": 75,
    "Near Sure Thing": 90,
    "A Sure Thing": 95,
    "Has To Be": 100,
  },
  4: {
    Impossible: 5,
    "No Way": 10,
    "Very Unlikely": 20,
    Unlikely: 35,
    "Fifty/Fifty": 45,
    "Somewhat Likely": 55,
    Likely: 65,
    "Very Likely": 85,
    "Near Sure Thing": 95,
    "A Sure Thing": 100,
    "Has To Be": 105,
  },
  5: {
    Impossible: 5,
    "No Way": 15,
    "Very Unlikely": 25,
    Unlikely: 45,
    "Fifty/Fifty": 50,
    "Somewhat Likely": 65,
    Likely: 75,
    "Very Likely": 90,
    "Near Sure Thing": 100,
    "A Sure Thing": 105,
    "Has To Be": 115,
  },
  6: {
    Impossible: 10,
    "No Way": 20,
    "Very Unlikely": 35,
    Unlikely: 50,
    "Fifty/Fifty": 65,
    "Somewhat Likely": 75,
    Likely: 85,
    "Very Likely": 95,
    "Near Sure Thing": 105,
    "A Sure Thing": 115,
    "Has To Be": 125,
  },
  7: {
    Impossible: 15,
    "No Way": 25,
    "Very Unlikely": 45,
    Unlikely: 65,
    "Fifty/Fifty": 75,
    "Somewhat Likely": 85,
    Likely: 90,
    "Very Likely": 100,
    "Near Sure Thing": 115,
    "A Sure Thing": 125,
    "Has To Be": 145,
  },
  8: {
    Impossible: 20,
    "No Way": 35,
    "Very Unlikely": 55,
    Unlikely: 75,
    "Fifty/Fifty": 85,
    "Somewhat Likely": 90,
    Likely: 95,
    "Very Likely": 105,
    "Near Sure Thing": 125,
    "A Sure Thing": 145,
    "Has To Be": 170,
  },
  9: {
    Impossible: 25,
    "No Way": 45,
    "Very Unlikely": 65,
    Unlikely: 85,
    "Fifty/Fifty": 90,
    "Somewhat Likely": 95,
    Likely: 100,
    "Very Likely": 115,
    "Near Sure Thing": 145,
    "A Sure Thing": 170,
    "Has To Be": 190,
  },
};

export function rollD100(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export function checkFateQuestion(
  likelihood: Likelihood,
  chaos: number,
  providedRoll?: number
): { answer: Answer; roll: number; target: number } {
  const roll = providedRoll ?? rollD100();
  const target = FATE_CHART[chaos][likelihood];

  let answer: Answer;

  if (roll <= target) {
    // Success (Yes)
    const rollMod = roll % 100;
    const tensDigit = Math.floor(rollMod / 10);
    const onesDigit = rollMod % 10;

    if (tensDigit === onesDigit) {
      answer = "Exceptional Yes";
    } else {
      answer = "Yes";
    }
  } else {
    // Failure (No)
    const rollMod = roll % 100;
    const tensDigit = Math.floor(rollMod / 10);
    const onesDigit = rollMod % 10;

    if (tensDigit === onesDigit) {
      answer = "Exceptional No";
    } else {
      answer = "No";
    }
  }

  return { answer, roll, target };
}

export function isRandomEvent(roll: number, chaos: number): boolean {
  // Random event occurs if both percentile digits are <= chaos and not doubles.
  const rollMod = roll % 100;
  const tensDigit = Math.floor(rollMod / 10);
  const onesDigit = rollMod % 10;

  return tensDigit <= chaos && onesDigit <= chaos && tensDigit !== onesDigit;
}
