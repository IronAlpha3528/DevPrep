import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { CODING_CHALLENGES, evaluateCode } from "../mock/api";

export default function Coding() {
  const navigate = useNavigate();
  const challenge = CODING_CHALLENGES[0];
  const [language, setLanguage] = useState(challenge.languages[0]);
  const [code, setCode] = useState(challenge.starterCode[challenge.languages[0]] || "");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(challenge.starterCode[lang] || "");
    setOutput("");
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput("");
    try {
      const res = await evaluateCode(challenge.id, code, language);
      setOutput(res.output);
    } catch {
      setOutput("❌ Error running code. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setRunning(true);
    setOutput("");
    try {
      const res = await evaluateCode(challenge.id, code, language);
      setOutput(res.output);
      setResult({ testCasesPassed: res.testCasesPassed, totalTestCases: res.totalTestCases, codeQuality: res.codeQuality });
      localStorage.setItem("ai_recruiter_coding", JSON.stringify(res));
      setSubmitted(true);
    } catch {
      setOutput("❌ Submission failed. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">Coding Challenge</h1>
          <p className="mt-1 text-sm text-slate-500">Solve the problem below to demonstrate your skills</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Problem */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">{challenge.title}</h2>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Medium</span>
              </div>
              <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 font-sans">{challenge.description}</pre>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-slate-800">Test Cases</h3>
              <div className="space-y-3">
                {challenge.testCases.map((tc, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs font-medium text-slate-500">Test Case {i + 1}</div>
                    <div className="mt-1 text-sm font-mono text-slate-700"><span className="text-slate-400">Input: </span>{tc.input}</div>
                    <div className="text-sm font-mono text-slate-700"><span className="text-slate-400">Expected: </span>{tc.expected}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Language:</span>
              <div className="flex gap-1">
                {challenge.languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      language === lang ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >{lang}</button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2">
                <span className="text-xs font-medium text-slate-500">Code Editor</span>
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full resize-none border-0 bg-slate-900 p-4 font-mono text-sm leading-relaxed text-green-300 focus:outline-none focus:ring-0"
                rows={16}
                spellCheck={false}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleRun} disabled={running || submitted} className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50">
                {running ? "Running..." : "▶ Run Code"}
              </button>
              <button onClick={handleSubmit} disabled={running || submitted} className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50">
                {submitted ? "✓ Submitted" : "Submit Solution"}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-2">
                <span className="text-xs font-medium text-slate-500">Output Console</span>
              </div>
              <div className="min-h-[120px] bg-slate-900 p-4">
                {running ? <Loader text="Executing code..." size="sm" /> : output ? <pre className="whitespace-pre-wrap font-mono text-sm text-green-300">{output}</pre> : <p className="font-mono text-sm text-slate-500">Run your code to see output here...</p>}
              </div>
            </div>

            {result && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                <h3 className="mb-2 font-bold text-green-800">Submission Results</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-extrabold text-green-700">{result.testCasesPassed}/{result.totalTestCases}</p>
                    <p className="text-xs text-green-600">Tests Passed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-green-700">{Math.round(result.codeQuality * 100)}%</p>
                    <p className="text-xs text-green-600">Code Quality</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-green-700">{Math.round((result.testCasesPassed / result.totalTestCases) * 100)}%</p>
                    <p className="text-xs text-green-600">Pass Rate</p>
                  </div>
                </div>
                <button onClick={() => navigate("/results")} className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg">
                  View Final Results →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
