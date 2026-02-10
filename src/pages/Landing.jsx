import { Link } from "react-router-dom";

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
    title: "Smart Resume Parsing",
    desc: "Upload your resume and select a job role. Our AI extracts skills, projects, and experience for targeted scoring.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
    title: "AI Video Interview",
    desc: "Join a video call with ARIA, our AI interviewer. It asks resume-based questions and evaluates your responses with real-time audio.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
        />
      </svg>
    ),
    title: "Resume-Based Questions",
    desc: "ARIA reads your resume and generates personalized questions about your specific skills, projects, and experience.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    ),
    title: "Coding Assessment",
    desc: "Test problem-solving skills with real coding challenges, automated evaluation, and code quality analysis.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
        />
      </svg>
    ),
    title: "AI-Powered Practice",
    desc: "Every practice session is conducted by ARIA. Consistent, fair, data-driven feedback to help you improve.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
    title: "ATS Score & Readiness Verdict",
    desc: "Get a comprehensive 100-point ATS score with detailed breakdown, AI feedback, and interview readiness recommendation.",
  },
];

const stats = [
  { value: "10K+", label: "Resumes Screened" },
  { value: "95%", label: "Accuracy Rate" },
  { value: "3min", label: "Avg. Processing" },
  { value: "500+", label: "Companies Trust Us" },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-20 text-white sm:px-6 lg:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            DevPrep — AI Interview Preparation Platform
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Prepare. Practice.
            <br />
            <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Ace Your Interview.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100">
            Upload your resume and practice with <strong>ARIA</strong> — our AI interviewer that asks personalized questions based on your experience. Get ATS scores, coding assessments, and interview readiness reports.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-700 shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-50 hover:shadow-xl hover:scale-105"
            >
              📄 Upload Resume & Start
            </Link>
            <Link
              to="/video-interview"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-900/20 transition-all hover:shadow-xl hover:scale-105 border border-cyan-400/30"
            >
              🧠 Join AI Video Interview
            </Link>
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50 hover:scale-105"
            >
              💬 Text Interview
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-blue-600">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Your Complete Interview Prep Experience
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Practice anytime. Get real feedback. ARIA analyzes your resume and conducts realistic AI interviews to get you ready.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all hover:shadow-lg hover:border-blue-100 hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">How It Works</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Four steps to a complete AI-powered evaluation.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Upload Resume",
                desc: "Select your target role & upload your resume. ARIA analyzes it instantly.",
                icon: "📄",
              },
              {
                step: "02",
                title: "AI Video Interview",
                desc: "Join a video call with ARIA. It asks personalized questions based on your resume.",
                icon: "🧠",
              },
              {
                step: "03",
                title: "Coding Test",
                desc: "Solve a coding challenge to prove your problem-solving skills.",
                icon: "💻",
              },
              {
                step: "04",
                title: "Get Results",
                desc: "Receive your ATS score, AI feedback, and hire/reject verdict.",
                icon: "📊",
              },
            ].map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-extrabold text-white shadow-lg shadow-blue-200">
                  {s.icon}
                </div>
                <h3 className="mb-1 text-base font-bold text-slate-800">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Interviewer Showcase ────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Meet Your AI Interviewer
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            ARIA
          </h2>
          <p className="text-lg text-cyan-300 font-medium mt-1">Advanced Recruiting Intelligence Agent</p>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400 leading-relaxed">
            ARIA reads your resume, understands your skills and projects, then asks targeted questions during a live video call. It speaks questions aloud, evaluates your responses in real-time, and provides detailed scoring on eye contact, clarity, confidence, and body language.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Speaks Questions", icon: "🔊", desc: "AI voice reads each question aloud with natural speech" },
              { label: "Real-Time Analysis", icon: "📊", desc: "Evaluates your response as soon as you finish" },
              { label: "Zero Human Bias", icon: "⚖️", desc: "Every candidate gets the same fair AI evaluation" },
            ].map((f) => (
              <div key={f.label} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-2 text-sm font-bold text-white">{f.label}</h3>
                <p className="mt-1 text-xs text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-16 text-center text-white sm:px-6">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to Prep for Your Interview?</h2>
        <p className="mx-auto mt-4 max-w-xl text-blue-100">
          Upload your resume and let ARIA help you practice — personalized questions, real feedback, instant readiness scores.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition-all hover:scale-105"
          >
            Get Started Free →
          </Link>
          <Link
            to="/video-interview"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:scale-105"
          >
            🧠 Try AI Interview
          </Link>
        </div>
      </section>
    </div>
  );
}
