import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatBubble from "../components/ChatBubble";
import Loader from "../components/Loader";
import ProgressStepper from "../components/ProgressStepper";
import { startInterview, submitAnswer } from "../mock/api";

export default function Interview() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState([]);
  const [done, setDone] = useState(false);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    (async () => {
      try {
        const data = await startInterview();
        setQuestions(data.questions);
        setMessages([
          { text: `Welcome to your AI interview! I'll ask you ${data.totalQuestions} questions covering different areas. Take your time to answer thoroughly.\n\nLet's begin!`, isAI: true, timestamp: now() },
          { text: `[${data.questions[0].category}]\n\n${data.questions[0].question}`, isAI: true, timestamp: now() },
        ]);
      } catch {
        setMessages([{ text: "Failed to start interview. Please try again.", isAI: true, timestamp: now() }]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || submitting) return;
    const userAnswer = answer.trim();
    setAnswer("");
    setMessages((prev) => [...prev, { text: userAnswer, isAI: false, timestamp: now() }]);
    setSubmitting(true);

    try {
      const result = await submitAnswer(questions[currentQ].id, userAnswer);
      const newScore = { question: questions[currentQ].question, answer: userAnswer, score: result.score };
      const updatedScores = [...scores, newScore];
      setScores(updatedScores);
      setMessages((prev) => [...prev, { text: `Score: ${result.score}/10 — ${result.feedback}`, isAI: true, timestamp: now() }]);

      if (currentQ + 1 < questions.length) {
        const nextQ = currentQ + 1;
        setCurrentQ(nextQ);
        setTimeout(() => {
          setMessages((prev) => [...prev, { text: `[${questions[nextQ].category}]\n\n${questions[nextQ].question}`, isAI: true, timestamp: now() }]);
        }, 800);
      } else {
        localStorage.setItem("ai_recruiter_answers", JSON.stringify(updatedScores));
        setDone(true);
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            text: `🎉 Interview complete! You answered all ${questions.length} questions.\n\nAverage score: ${(updatedScores.reduce((s, a) => s + a.score, 0) / updatedScores.length).toFixed(1)}/10\n\nYou can proceed to the video interview, coding test, or view your results.`,
            isAI: true, timestamp: now(),
          }]);
        }, 800);
      }
    } catch {
      setMessages((prev) => [...prev, { text: "Error evaluating answer. Please try again.", isAI: true, timestamp: now() }]);
    } finally {
      setSubmitting(false);
    }
  };

  const steps = questions.map((q, i) => ({
    label: `Q${i + 1}`,
    completed: i < currentQ || done,
    active: i === currentQ && !done,
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader text="Preparing your interview..." size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">AI Text Interview</h1>
          <p className="mt-1 text-sm text-slate-500">Question {Math.min(currentQ + 1, questions.length)} of {questions.length}</p>
        </div>

        {questions.length > 0 && <div className="mb-6"><ProgressStepper steps={steps} /></div>}

        {!done && questions[currentQ] && (
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-600">💡</span>
              <div>
                <p className="text-xs font-semibold text-blue-800">Tips for this question</p>
                <p className="mt-0.5 text-xs text-blue-600">{questions[currentQ].tips}</p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="h-[400px] overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg.text} isAI={msg.isAI} timestamp={msg.timestamp} />
            ))}
            {submitting && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-100 px-5 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-slate-100 p-4">
            {!done ? (
              <div className="flex gap-3">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitAnswer(); } }}
                  placeholder="Type your answer... (Shift+Enter for new line)"
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim() || submitting}
                  className="self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => navigate("/video-interview")} className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg">
                  🧠 AI Video Interview →
                </button>
                <button onClick={() => navigate("/coding")} className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg">
                  Coding Test →
                </button>
                <button onClick={() => navigate("/results")} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
                  Skip to Results
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
