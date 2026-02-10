export default function ProgressStepper({ steps }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
              step.completed
                ? "bg-green-500 text-white shadow-md shadow-green-200"
                : step.active
                ? "bg-blue-600 text-white shadow-md shadow-blue-200 ring-4 ring-blue-100"
                : "bg-slate-200 text-slate-500"
            }`}>
              {step.completed ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (i + 1)}
            </div>
            <span className={`mt-1.5 text-xs font-medium ${step.active ? "text-blue-700" : "text-slate-400"}`}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`mx-1 mb-5 h-0.5 w-8 sm:w-16 ${step.completed ? "bg-green-400" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
