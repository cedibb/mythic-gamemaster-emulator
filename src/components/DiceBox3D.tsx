import React, { useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";

interface DiceBox3DProps {
  roll: string | null; // e.g., "1d6", "2d20"
  onRollComplete?: (results: any) => void;
}

const DiceBox3D: React.FC<DiceBox3DProps> = ({ roll, onRollComplete }) => {
  const diceBoxRef = useRef<any>(null);
  const containerIdRef = useRef<string>("");
  if (!containerIdRef.current) {
    containerIdRef.current = `dicebox3d-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }
  const containerId = containerIdRef.current;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Wait for next tick to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!diceBoxRef.current && !cancelled) {
        console.log("Initializing DiceBox with container:", containerId);
        const diceBox = new DiceBox({
          container: `#${containerId}`,
          assetPath: "/assets/",
          theme: "default",
          scale: 6,
          gravity: 9.8,
          onRollComplete: (results: any) => {
            console.log("Roll complete, results:", results);
            if (onRollComplete) onRollComplete(results);
          },
        });

        diceBox
          .init()
          .then(() => {
            console.log("DiceBox initialized:", diceBox);
            if (!cancelled) {
              diceBoxRef.current = diceBox;
              setReady(true);
            }
          })
          .catch((error: unknown) => {
            console.error("DiceBox init error:", error);
          });
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [containerId, onRollComplete]);

  useEffect(() => {
    const doRoll = async () => {
      if (roll && diceBoxRef.current && ready) {
        console.log("Rolling:", roll, diceBoxRef.current);
        try {
          await diceBoxRef.current.roll(roll);
        } catch (error) {
          console.error("Roll error:", error);
        }
      } else {
        console.log("Not ready to roll:", {
          roll,
          hasDiceBox: !!diceBoxRef.current,
          ready,
        });
      }
    };
    doRoll();
  }, [roll, ready]);

  return (
    <div
      id={containerId}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default DiceBox3D;
