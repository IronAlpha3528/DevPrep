export default function ChatBubble({ message, isAI = false, timestamp }) {
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div className={`flex max-w-[85%] gap-2.5 ${isAI ? "flex-row" : "flex-row-reverse"}`}>
        <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
          isAI ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-emerald-500 to-teal-600"
        }`}>
          {isAI ? "AI" : "You"}
        </div>
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isAI ? "rounded-tl-sm bg-white border border-slate-100 text-slate-700" : "rounded-tr-sm bg-blue-600 text-white"
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          {timestamp && <p className={`mt-1 text-xs ${isAI ? "text-slate-400" : "text-blue-200"}`}>{timestamp}</p>}
        </div>
      </div>
    </div>
  );
}
