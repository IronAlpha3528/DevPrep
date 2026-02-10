export default function CircularProgress({ value, max = 100, size = 180, strokeWidth = 12, label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / max, 1);
  const offset = circumference - percentage * circumference;

  const getColor = () => {
    if (percentage >= 0.8) return { stroke: "#10b981", text: "text-emerald-600", glow: "drop-shadow(0 0 8px rgba(16,185,129,0.4))" };
    if (percentage >= 0.65) return { stroke: "#3b82f6", text: "text-blue-600", glow: "drop-shadow(0 0 8px rgba(59,130,246,0.4))" };
    if (percentage >= 0.45) return { stroke: "#f59e0b", text: "text-amber-600", glow: "drop-shadow(0 0 8px rgba(245,158,11,0.4))" };
    return { stroke: "#ef4444", text: "text-red-600", glow: "drop-shadow(0 0 8px rgba(239,68,68,0.4))" };
  };

  const color = getColor();

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" style={{ filter: color.glow }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color.stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-[1500ms] ease-out" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-bold ${color.text}`}>{value}</span>
        <span className="text-sm font-medium text-slate-400">{label || `/ ${max}`}</span>
      </div>
    </div>
  );
}
