import React from "react";

interface DieIconProps {
  spec?: string; // e.g. "1d100", "1d20"
  value?: number | null;
  size?: number;
}

function parseSides(spec?: string): number {
  if (!spec) return 6;
  const m = spec.match(/(\d+)d(\d+)/i);
  if (!m) return 6;
  return Number(m[2]);
}

const DieIcon: React.FC<DieIconProps> = ({ spec = "1d6", value = null, size = 44 }) => {
  const sides = parseSides(spec);
  const display = value == null ? "…" : String(value);

  // Choose a simple polygon shape based on sides (hexagon for most)
  const w = size;
  const h = size * 0.9;
  const cx = w / 2;
  const cy = h / 2;

  // Regular hexagon points
  const r = Math.min(w, h) / 2 - 2;
  const points = Array.from({ length: 6 }).map((_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
        <polygon points={points} fill="#0f172a" stroke="#334155" strokeWidth={2} />
        <text x={cx} y={cy} fontSize={Math.max(12, w / 4)} fill="#fff" textAnchor="middle" dominantBaseline="central" fontWeight={700}>
          {display}
        </text>
      </svg>
    </div>
  );
};

export default DieIcon;
