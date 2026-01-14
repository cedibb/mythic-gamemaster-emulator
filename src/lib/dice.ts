// Centralized dice/animation request queue
type Request = {
  spec: string;
  resolve: (result: number) => void;
  reject: (err: unknown) => void;
};

const queue: Request[] = [];
const listeners: Array<() => void> = [];

export function requestAnimatedRoll(spec: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    queue.push({ spec, resolve, reject });
    listeners.forEach((l) => l());
  });
}

export function popNextRequest(): Request | undefined {
  return queue.shift();
}

export function subscribeQueue(cb: () => void) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

// Non-animated roll helpers
export function rollPercentile(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export function rollDice(spec: string): number {
  // Only supports simple XdY or percentile '1d100' style
  const m = spec.match(/(\d+)d(\d+)/i);
  if (!m) return rollPercentile();
  const count = Number(m[1]);
  const sides = Number(m[2]);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

export default {
  requestAnimatedRoll,
  popNextRequest,
  subscribeQueue,
  rollPercentile,
  rollDice,
};
