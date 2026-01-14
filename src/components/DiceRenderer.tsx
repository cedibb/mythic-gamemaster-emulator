import React, { useEffect, useState } from "react";
import DiceBox3D from "./DiceBox3D";
import dice from "../lib/dice";

const DiceRenderer: React.FC = () => {
  const [currentSpec, setCurrentSpec] = useState<string | null>(null);
  const [currentRequestResolver, setCurrentRequestResolver] = useState<
    ((n: number) => void) | null
  >(null);

  useEffect(() => {
    const tryPop = () => {
      if (currentSpec) return; // busy
      const req = dice.popNextRequest();
      if (req) {
        setCurrentSpec(req.spec);
        setCurrentRequestResolver(() => req.resolve);
      }
    };
    const unsub = dice.subscribeQueue(tryPop);
    tryPop();
    return unsub;
  }, [currentSpec]);

  const handleComplete = (results: any) => {
    // Attempt to extract a sensible numeric total from dice result
    // The dice-box lib returns an array; we will try to find a percentile or first die value
    let value = 0;
    try {
      if (Array.isArray(results) && results.length > 0) {
        // Flatten and sum
        value = results[0].value ?? 0;
        // If the library returns rolls array
        if (results[0].rolls && results[0].rolls[0]) {
          const r = results[0].rolls[0];
          if (typeof r.value === "number") value = r.value;
        }
      } else if (results && typeof results === "object" && "value" in results) {
        // single object
        // @ts-ignore
        value = results.value;
      }
    } catch (e) {
      console.error("Cannot parse dice result", e, results);
    }

    if (currentRequestResolver) currentRequestResolver(value);
    setCurrentSpec(null);
    setCurrentRequestResolver(null);
  };

  return currentSpec ? (
    <DiceBox3D roll={currentSpec} onRollComplete={handleComplete} />
  ) : null;
};

export default DiceRenderer;
