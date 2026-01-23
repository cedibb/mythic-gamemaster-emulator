import React from "react";

interface DieIconProps {
  spec?: string; // e.g. "1d100", "1d20"
  value?: number | null;
  size?: number;
}

const DieIcon: React.FC<DieIconProps> = ({ value = null, size = 72 }) => {
  // When `value` is null, show a spinning die with no characters inside.
  const showSpinner = value == null;

  // Choose a simple polygon shape based on sides (hexagon for most)
  const w = size;
  const h = size * 0.9;
  const cx = w / 2;
  const cy = h / 2;

  // Regular hexagon points
  const r = Math.min(w, h) / 2 - 2;
  const points = Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  const spinDuration = 1.4; // seconds

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <style>{`@keyframes die-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden style={showSpinner ? { animation: `die-spin ${spinDuration}s linear infinite`, transformBox: "fill-box", transformOrigin: "50% 50%" } : undefined}>
        <polygon points={points} fill="#0f172a" stroke="#334155" strokeWidth={2} />

        {!showSpinner && (
          <text
            x={cx}
            y={cy}
            fontSize={Math.max(12, w / 4)}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontWeight={700}
          >
            {String(value)}
          </text>
        )}
      </svg>
    </div>
  );
};

export default DieIcon;
