// Centralized dice/animation request queue
type SingleRequest = {
  id: string;
  kind: "single";
  spec: string;
  label?: string;
  resolve: (result: number) => void;
  reject: (err: unknown) => void;
};

type GroupItem = { key: string; spec: string; label?: string };

type GroupRequest = {
  id: string;
  kind: "group";
  label?: string; // group label shown in modal
  items: GroupItem[];
  resolve: (result: Record<string, number>) => void;
  reject: (err: unknown) => void;
};

type Request = SingleRequest | GroupRequest;

const queue: Request[] = [];
const listeners: Array<() => void> = [];

function nextId() {
  return Math.random().toString(36).slice(2, 9);
}

export function requestAnimatedRoll(spec: string, label?: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const rq: SingleRequest = {
      id: nextId(),
      kind: "single",
      spec,
      label,
      resolve,
      reject,
    };
    queue.push(rq);
    listeners.forEach((l) => l());
  });
}

export function requestAnimatedRollGroup(
  label: string,
  items: Array<{ key: string; spec: string; label?: string }>
): Promise<Record<string, number>> {
  return new Promise<Record<string, number>>((resolve, reject) => {
    const rq: GroupRequest = {
      id: nextId(),
      kind: "group",
      label,
      items,
      resolve,
      reject,
    };
    queue.push(rq);
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
  requestAnimatedRollGroup,
  popNextRequest,
  subscribeQueue,
  rollPercentile,
  rollDice,
};
