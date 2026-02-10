export default function ScoreCard({ label, score, maxScore, color = "blue" }) {
  const percentage = Math.round((score / maxScore) * 100);
  const colorClasses = {
    blue: { bg: "bg-blue-50", bar: "bg-blue-500", text: "text-blue-700" },
    green: { bg: "bg-green-50", bar: "bg-green-500", text: "text-green-700" },
    purple: { bg: "bg-purple-50", bar: "bg-purple-500", text: "text-purple-700" },
    amber: { bg: "bg-amber-50", bar: "bg-amber-500", text: "text-amber-700" },
    rose: { bg: "bg-rose-50", bar: "bg-rose-500", text: "text-rose-700" },
  };
  const c = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`rounded-xl ${c.bg} p-5 transition-transform hover:scale-[1.02]`}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
        <span className={`text-lg font-bold ${c.text}`}>{score}/{maxScore}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/60">
        <div className={`h-full rounded-full ${c.bar} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{percentage}% achieved</p>
    </div>
  );
}
