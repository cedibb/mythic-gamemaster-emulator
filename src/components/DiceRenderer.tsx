import React, { useEffect, useState } from "react";
import DiceBox3D from "./DiceBox3D";
import { useGame } from "../context/useGame";
import dice from "../lib/dice";
import { rollEventMeaning } from "../lib/eventMeaning";
import DieIcon from "./DieIcon";

type PendingItem = {
  key: string;
  spec: string;
  label?: string;
  value?: number | null;
  text?: string;
};

const DiceRenderer: React.FC = () => {
  const [current, setCurrent] = useState<
    | {
        id: string;
        kind: "single" | "group";
        spec?: string;
        label?: string;
        items?: PendingItem[];
        resolve?: any;
      }
    | null
  >(null);

  const { gameState } = useGame();

  useEffect(() => {
    const tryPop = () => {
      if (current) return; // busy
      const req: any = dice.popNextRequest();
      if (!req) return;
      if (req.kind === "single") {
        setCurrent({
          id: req.id,
          kind: "single",
          spec: req.spec,
          label: req.label,
          resolve: req.resolve,
        });
      } else if (req.kind === "group") {
        setCurrent({
          id: req.id,
          kind: "group",
          label: req.label,
          items: req.items.map((it: any) => ({ key: it.key, spec: it.spec, label: it.label, value: null })),
          resolve: req.resolve,
        });
      }
    };
    const unsub = dice.subscribeQueue(tryPop);
    tryPop();
    return unsub;
  }, [current]);

  const finishSingle = (value: number) => {
    if (current && current.kind === "single") {
      if (current.resolve) current.resolve(value);
      setCurrent(null);
    }
  };

  const finishGroupItem = (key: string, value: number) => {
    if (!current || current.kind !== "group" || !current.items) return;
    const items = current.items.map((it) => (it.key === key ? { ...it, value } : it));
    const remaining = items.filter((it) => it.value == null);
    // Update UI immediately with the numeric result
    setCurrent((c) => (c ? { ...c, items } : c));

    // Attempt to map the just-completed roll to text immediately so the modal updates per-roll.
    try {
      // existing recorded rolls (may be undefined)
      const existingMap: Record<string, number | undefined> = {};
      items.forEach((it) => (existingMap[it.key] = typeof it.value === "number" ? it.value : undefined));

      // If the completed item is actionRoll or descriptionRoll, compute that text
      if (key === "actionRoll") {
        const a = value;
        const d = existingMap["descriptionRoll"] ?? 1;
        const meaning = rollEventMeaning(a, d);
        const itemsWithText = items.map((it) => (it.key === "actionRoll" ? { ...it, text: meaning.action } : it));
        setCurrent((c) => (c ? { ...c, items: itemsWithText } : c));
      } else if (key === "descriptionRoll") {
        const d = value;
        const a = existingMap["actionRoll"] ?? 1;
        const meaning = rollEventMeaning(a, d);
        const itemsWithText = items.map((it) => (it.key === "descriptionRoll" ? { ...it, text: meaning.description } : it));
        setCurrent((c) => (c ? { ...c, items: itemsWithText } : c));
      }

      // Map focus rolls only when this is an event-meaning/random-event modal
      const label = (current.label || "").toLowerCase();
      if (label.includes("event meaning") || label.includes("random event") || label.includes("scene interrupted")) {
        if (key === "focusRoll") {
          try {
            // derive focus label locally using the same thresholds as rollRandomEvent
            const r = Math.max(1, Math.min(100, Math.floor(value)));
            let focusText = "";
            if (r <= 7) focusText = "Remote event";
            else if (r <= 28) focusText = "NPC action";
            else if (r <= 35) focusText = "Introduce a new NPC";
            else if (r <= 45) focusText = "Move toward a thread";
            else if (r <= 52) focusText = "Move away from a thread";
            else if (r <= 55) focusText = "Close a thread";
            else if (r <= 67) focusText = "PC negative";
            else if (r <= 75) focusText = "PC positive";
            else if (r <= 83) focusText = "Ambiguous event";
            else if (r <= 92) focusText = "NPC negative";
            else focusText = "NPC positive";
            const itemsWithText = items.map((it) => (it.key === "focusRoll" ? { ...it, text: focusText } : it));
            setCurrent((c) => (c ? { ...c, items: itemsWithText } : c));
          } catch (e) {
            console.error("Error mapping focus label", e);
          }
        }
      }
    } catch (e) {
      console.error("Error mapping event meaning", e);
    }

    if (remaining.length === 0) {
      // keep the modal visible for a short moment before resolving
      const map: Record<string, number> = {};
      items.forEach((it) => {
        map[it.key] = it.value ?? 0;
      });
      const DISPLAY_DELAY_MS = 1500;

      // Final mapping: compute full meaning text when all rolls are finished
      const l = (current.label || "").toLowerCase();
      if (l.includes("event meaning") || l.includes("random event") || l.includes("scene interrupted")) {
        try {
          const actionRoll = map["actionRoll"];
          const descriptionRoll = map["descriptionRoll"];
          const meaning = rollEventMeaning(actionRoll, descriptionRoll);
          const itemsWithText = items.map((it) => {
            if (it.key === "actionRoll") return { ...it, text: meaning.action };
            if (it.key === "descriptionRoll") return { ...it, text: meaning.description };
            return it;
          });
          setCurrent((c) => (c ? { ...c, items: itemsWithText, meaningText: meaning } : c));
        } catch (e) {
          console.error("Error mapping event meaning", e);
        }
      }

      // update UI to show final values (and possible text) then resolve after delay
      setTimeout(() => {
        if (current.resolve) current.resolve(map);
        setCurrent(null);
      }, DISPLAY_DELAY_MS);
    }
  };

  // Parse dice-box results into a number
  const extractValue = (results: any) => {
    try {
      if (Array.isArray(results) && results.length > 0) {
        const r0 = results[0];
        if (r0.rolls && Array.isArray(r0.rolls) && r0.rolls[0] && typeof r0.rolls[0].value === "number") {
          return r0.rolls[0].value;
        }
        if (typeof r0.value === "number") return r0.value;
      }
      if (results && typeof results === "object" && typeof results.value === "number") return results.value;
    } catch (e) {
      console.error("Dice parse error", e);
    }
    return 0;
  };

  if (!current) return null;

  if (current.kind === "single") {
    return (
      <DiceBox3D
        key={current.id}
        roll={current.spec ?? "1d100"}
        diceColors={gameState.diceColors}
        onRollComplete={(res: any) => {
          const v = extractValue(res);
          finishSingle(v);
        }}
      />
    );
  }

  // group modal UI with embedded DiceBox3D for the active item
  const activeItem = current.items!.find((it) => it.value == null) as PendingItem | undefined;

  return (
    <div>
      <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-700 rounded p-6 w-full max-w-lg text-slate-200 flex flex-col min-h-[320px]">
          <div className="text-lg font-semibold mb-3 text-center">{current.label ?? "Rolling"}</div>
          <div className="space-y-2 mb-4">
            {current.items!.length > 1 ? (
              <div className="flex items-start justify-center gap-8">
                {current.items!.map((it) => {
                  const spec = it.spec || "1d100";
                  const match = spec.match(/^(\d+)d/i);
                  const count = match ? Math.max(1, parseInt(match[1], 10)) : 1;
                  return (
                    <div key={it.key} className="flex flex-col items-center text-sm">
                      <div className="mb-2">{it.label ?? it.key}</div>
                      <div className={`flex ${count > 1 ? "flex-row" : "flex-col"} items-center justify-center gap-4`}>
                        {Array.from({ length: count }).map((_, i) => (
                          <DieIcon key={i} spec={it.spec} value={it.value == null ? null : it.value ?? 0} size={count > 1 ? 64 : 96} />
                        ))}
                      </div>
                      {it.text && <div className="text-sm text-slate-300 mt-2">{it.text}</div>}
                    </div>
                  );
                })}
              </div>
            ) : (
              current.items!.map((it) => {
                const spec = it.spec || "1d100";
                const match = spec.match(/^(\d+)d/i);
                const count = match ? Math.max(1, parseInt(match[1], 10)) : 1;
                return (
                  <div key={it.key} className="flex flex-col items-center text-sm">
                    <div className="mb-2">{it.label ?? it.key}</div>
                    <div className={`flex items-center justify-center ${count > 1 ? "flex-row" : "flex-col"} gap-4`}>
                      {Array.from({ length: count }).map((_, i) => (
                        <DieIcon key={i} spec={it.spec} value={it.value == null ? null : it.value ?? 0} size={count > 1 ? 64 : 96} />
                      ))}
                      {it.text && <div className="text-sm text-slate-300 mt-2">{it.text}</div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex-1 flex items-center justify-center">
              {activeItem && (
                <DiceBox3D
                  key={`${current.id}-${activeItem.key}`}
                  roll={activeItem.spec}
                  diceColors={gameState.diceColors}
                  onRollComplete={(res: any) => {
                    const v = extractValue(res);
                    finishGroupItem(activeItem.key, v);
                  }}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceRenderer;
