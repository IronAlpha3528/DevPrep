import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  // Hide footer during video call
  if (location.pathname === "/video-interview") return null;

  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5.47 14.03a2.25 2.25 0 00-.659 1.591v.286c0 1.243 1.007 2.25 2.25 2.25h9.878a2.25 2.25 0 002.25-2.25v-.286a2.25 2.25 0 00-.659-1.591l-3.621-3.621a2.25 2.25 0 01-.659-1.591V3.104" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">DevPrep</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} DevPrep. AI Interview Preparation Platform — Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
