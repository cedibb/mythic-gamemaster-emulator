import React, { useState, useEffect } from "react";
import { useGame } from "../context/useGame";

const DiceColorPicker: React.FC = () => {
  const { gameState, updateDiceColors } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const currentColors = gameState.diceColors || {
    bodyColor: "#1e40af",
    textColor: "#ffffff",
  };

  const [bodyColor, setBodyColor] = useState(currentColors.bodyColor);
  const [textColor, setTextColor] = useState(currentColors.textColor);

  // Keep local state in sync with game state
  useEffect(() => {
    setBodyColor(currentColors.bodyColor);
    setTextColor(currentColors.textColor);
  }, [currentColors.bodyColor, currentColors.textColor]);

  const presetColors = [
    { name: "Blue", body: "#1e40af", text: "#ffffff" },
    { name: "Red", body: "#dc2626", text: "#ffffff" },
    { name: "Green", body: "#16a34a", text: "#ffffff" },
    { name: "Purple", body: "#9333ea", text: "#ffffff" },
    { name: "Orange", body: "#ea580c", text: "#ffffff" },
    { name: "Black", body: "#1f2937", text: "#ffffff" },
    { name: "White", body: "#f3f4f6", text: "#1f2937" },
    { name: "Gold", body: "#ca8a04", text: "#1f2937" },
    { name: "Pink", body: "#db2777", text: "#ffffff" },
    { name: "Teal", body: "#0d9488", text: "#ffffff" },
  ];

  const handlePreset = (body: string, text: string) => {
    setBodyColor(body);
    setTextColor(text);
    updateDiceColors({ bodyColor: body, textColor: text });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 rounded bg-slate-800 text-xs text-white border border-slate-700 hover:bg-slate-700 transition flex items-center gap-2"
        title="Dice Color Settings"
      >
        <div className="flex gap-1 items-center">
          <div
            className="w-4 h-4 rounded border border-slate-600"
            style={{ backgroundColor: currentColors.bodyColor }}
          />
          <span>Dice Colors</span>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Color Picker Panel */}
          <div className="absolute right-0 mt-2 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4 w-80">
            <h3 className="text-sm font-semibold mb-3 text-slate-100">
              Customize Dice Colors
            </h3>

            {/* Preset Colors */}
            <div className="mb-4">
              <label className="text-xs text-slate-400 block mb-2">
                Presets
              </label>
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((preset) => {
                  const w = 40;
                  const h = 36;
                  const cx = w / 2;
                  const cy = h / 2;
                  const r = Math.min(w, h) / 2 - 2;
                  const points = Array.from({ length: 6 })
                    .map((_, i) => {
                      const angle = (Math.PI / 3) * i - Math.PI / 6;
                      const x = cx + r * Math.cos(angle);
                      const y = cy + r * Math.sin(angle);
                      return `${x},${y}`;
                    })
                    .join(" ");

                  return (
                    <button
                      key={preset.name}
                      onClick={() => handlePreset(preset.body, preset.text)}
                      className="w-10 h-9 hover:opacity-80 transition relative group"
                      title={preset.name}
                    >
                      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                        <polygon
                          points={points}
                          fill={preset.body}
                          stroke="#475569"
                          strokeWidth={1.5}
                        />
                        <text
                          x={cx}
                          y={cy}
                          fontSize={9}
                          fill={preset.text}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontWeight={700}
                        >
                          100
                        </text>
                      </svg>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                        {preset.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets only — no custom color inputs */}

            {/* Preview */}
            <div className="mb-4 p-3 bg-slate-900 rounded border border-slate-700">
              <label className="text-xs text-slate-400 block mb-2">
                Preview
              </label>
              <div className="flex justify-center">
                {(() => {
                  const w = 64;
                  const h = 57.6;
                  const cx = w / 2;
                  const cy = h / 2;
                  const r = Math.min(w, h) / 2 - 2;
                  const points = Array.from({ length: 6 })
                    .map((_, i) => {
                      const angle = (Math.PI / 3) * i - Math.PI / 6;
                      const x = cx + r * Math.cos(angle);
                      const y = cy + r * Math.sin(angle);
                      return `${x},${y}`;
                    })
                    .join(" ");
                  return (
                    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                      <polygon
                        points={points}
                        fill={bodyColor}
                        stroke="#475569"
                        strokeWidth={2}
                      />
                      <text
                        x={cx}
                        y={cy}
                        fontSize={24}
                        fill={textColor}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontWeight={700}
                      >
                        75
                      </text>
                    </svg>
                  );
                })()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiceColorPicker;
