import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { startVideoInterview, analyzeVideoResponse, AI_INTERVIEWER } from "../mock/api";

// ═══════════════════════════════════════════════════════════
// AI ORB — Animated AI visualization (replaces human avatar)
// ═══════════════════════════════════════════════════════════

function AIOrb({ speaking, size = "lg" }) {
  const dims = size === "lg" ? "h-36 w-36" : "h-20 w-20";
  const innerDims = size === "lg" ? "inset-2" : "inset-1.5";
  const iconSize = size === "lg" ? "text-3xl" : "text-lg";
  const labelSize = size === "lg" ? "text-[10px] mt-1" : "text-[7px] mt-0.5";

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      {speaking && (
        <>
          <div
            className="absolute rounded-full bg-cyan-500/15 blur-3xl"
            style={{
              width: size === "lg" ? "200px" : "120px",
              height: size === "lg" ? "200px" : "120px",
              animation: "orbGlow 2s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full bg-blue-500/10 blur-2xl"
            style={{
              width: size === "lg" ? "160px" : "100px",
              height: size === "lg" ? "160px" : "100px",
              animation: "orbGlow 2s ease-in-out 0.5s infinite",
            }}
          />
        </>
      )}

      {/* Main orb */}
      <div
        className={`relative ${dims} rounded-full transition-all duration-700`}
        style={{
          background: speaking
            ? "linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)"
            : "linear-gradient(135deg, #1e40af, #3b82f6, #1e3a5f)",
          animation: speaking ? "orbPulse 1.8s ease-in-out infinite" : "orbIdle 4s ease-in-out infinite",
        }}
      >
        {/* Rotating ring (visible when speaking) */}
        {speaking && (
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "#22d3ee",
              borderRightColor: "#60a5fa",
              animation: "orbRotate 2s linear infinite",
            }}
          />
        )}

        {/* Inner circle */}
        <div
          className={`absolute ${innerDims} rounded-full flex flex-col items-center justify-center`}
          style={{ background: "radial-gradient(circle at 40% 40%, #0f172a, #1e293b)" }}
        >
          <span className={iconSize}>🧠</span>
          <span className={`${labelSize} font-bold tracking-[0.2em] text-cyan-400`}>
            ARIA
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SOUNDLINE — Animated waveform/soundbar visualization
// ═══════════════════════════════════════════════════════════

function Soundline({ active, barCount = 48 }) {
  // Pre-compute bar properties so they don't change on re-render
  const bars = useMemo(
    () =>
      Array.from({ length: barCount }).map((_, i) => ({
        delay: i * 0.025,
        duration: 0.3 + ((Math.sin(i * 0.7) + 1) / 2) * 0.4,
        maxH: 10 + Math.abs(Math.sin(i * 0.4)) * 28 + (Math.sin(i * 0.15) + 1) * 8,
      })),
    [barCount]
  );

  return (
    <div className="flex items-center justify-center gap-[2px]" style={{ height: "52px" }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className="rounded-full origin-center"
          style={{
            width: "3px",
            background: active
              ? `linear-gradient(to top, #3b82f6, #06b6d4)`
              : "linear-gradient(to top, #334155, #475569)",
            height: active ? `${bar.maxH}px` : "4px",
            animation: active
              ? `soundBar ${bar.duration}s ease-in-out ${bar.delay}s infinite`
              : `soundBarIdle 3s ease-in-out ${bar.delay}s infinite`,
            transition: "height 0.6s ease",
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CONTROLS BAR — Meeting controls (mic, cam, actions, end)
// ═══════════════════════════════════════════════════════════

function ControlsBar({ micOn, camOn, onToggleMic, onToggleCam, onEndCall, onAction, showAction, actionLabel }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl bg-slate-800/90 px-6 py-3 backdrop-blur-sm shadow-xl">
      {/* Mic */}
      <button
        onClick={onToggleMic}
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
          micOn ? "bg-slate-600 hover:bg-slate-500 text-white" : "bg-red-500 hover:bg-red-600 text-white"
        }`}
        title={micOn ? "Mute" : "Unmute"}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
          />
        </svg>
        {!micOn && (
          <svg className="absolute h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <line x1="4" y1="4" x2="20" y2="20" strokeLinecap="round" className="text-white" />
          </svg>
        )}
      </button>

      {/* Camera */}
      <button
        onClick={onToggleCam}
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
          camOn ? "bg-slate-600 hover:bg-slate-500 text-white" : "bg-red-500 hover:bg-red-600 text-white"
        }`}
        title={camOn ? "Turn off camera" : "Turn on camera"}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </button>

      {/* Decorative: Share screen (disabled) */}
      <button
        className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700 text-slate-400 cursor-not-allowed opacity-40"
        title="Share Screen (disabled)"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
          />
        </svg>
      </button>

      {/* Action button */}
      {showAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:scale-105 shadow-lg shadow-blue-500/30"
        >
          {actionLabel}
        </button>
      )}

      {/* End call */}
      <button
        onClick={onEndCall}
        className="flex h-11 w-14 items-center justify-center rounded-full bg-red-600 text-white transition-all hover:bg-red-700 hover:scale-105 shadow-lg shadow-red-500/30"
        title="End Call"
      >
        <svg className="h-6 w-6 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function VideoInterview() {
  const navigate = useNavigate();

  // ── Core state ────────────────────────────────────────────
  const [phase, setPhase] = useState("lobby"); // lobby | connecting | incall | ended
  const [callState, setCallState] = useState("idle"); // idle | ai-speaking | user-turn | recording | analyzing | feedback
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [results, setResults] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [resume, setResume] = useState(null);

  // ── UI state ──────────────────────────────────────────────
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // ── Refs ──────────────────────────────────────────────────
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const callTimerRef = useRef(null);
  const questionTimerRef = useRef(null);
  const recordingStartRef = useRef(0);
  const typingRef = useRef(null);
  const ttsActiveRef = useRef(false);

  // ── Load voices for TTS ───────────────────────────────────
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // ── Load questions (resume-based) ─────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await startVideoInterview();
        setQuestions(data.questions);
        if (data.resume) setResume(data.resume);
      } catch {
        /* fallback handled */
      }
    })();
    return () => {
      stopCamera();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  // ── Derived data ──────────────────────────────────────────
  const jobRole = localStorage.getItem("ai_recruiter_job_role") || "Full Stack Developer";
  const candidateName = resume?.name || "Candidate";
  const avgScore = results.length > 0 ? results.reduce((s, r) => s + r.score, 0) / results.length : 0;

  // ═══════════════════════════════════════════════════════════
  // Camera controls
  // ═══════════════════════════════════════════════════════════

  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setCameraError("Camera access denied — AI will still evaluate based on your responses.");
      setCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  const toggleCam = useCallback(() => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setCamOn(track.enabled);
      }
    }
  }, []);

  const toggleMic = useCallback(() => {
    if (streamRef.current) {
      const track = streamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setMicOn(track.enabled);
      }
    } else {
      setMicOn((m) => !m);
    }
  }, []);

  // ═══════════════════════════════════════════════════════════
  // AI Speech — TTS + typewriter + soundline sync
  // ═══════════════════════════════════════════════════════════

  const speak = useCallback(
    (text, onDone) => {
      // Cancel any ongoing speech
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (typingRef.current) clearTimeout(typingRef.current);

      setAiSpeaking(true);
      setTypedText("");
      ttsActiveRef.current = false;

      // Start typewriter effect
      let charIdx = 0;
      const typeSpeed = 28;
      const typeNext = () => {
        if (charIdx < text.length) {
          setTypedText(text.substring(0, charIdx + 1));
          charIdx++;
          typingRef.current = setTimeout(typeNext, typeSpeed);
        }
      };
      typeNext();

      // Estimated duration for non-TTS fallback
      const estimatedMs = Math.max(text.length * 50, 2500);

      const finish = () => {
        setTypedText(text); // ensure full text shown
        setAiSpeaking(false);
        if (onDone) setTimeout(onDone, 600);
      };

      // Try Text-to-Speech
      if ("speechSynthesis" in window && voices.length > 0) {
        try {
          const utter = new SpeechSynthesisUtterance(text);
          utter.rate = 0.94;
          utter.pitch = 1.05;
          utter.volume = 0.85;

          // Pick a good English voice
          const preferred =
            voices.find((v) => v.name.includes("Google US English")) ||
            voices.find((v) => v.name.includes("Samantha")) ||
            voices.find((v) => v.name.includes("Microsoft Zira")) ||
            voices.find((v) => v.lang.startsWith("en") && v.localService) ||
            voices.find((v) => v.lang.startsWith("en")) ||
            voices[0];
          if (preferred) utter.voice = preferred;

          utter.onend = finish;
          utter.onerror = finish;

          window.speechSynthesis.speak(utter);
          ttsActiveRef.current = true;
        } catch {
          // TTS failed — use fallback timing
          setTimeout(finish, estimatedMs);
        }
      } else {
        // No TTS available — use estimated timing
        setTimeout(finish, estimatedMs);
      }
    },
    [voices]
  );

  // ═══════════════════════════════════════════════════════════
  // Call flow
  // ═══════════════════════════════════════════════════════════

  const joinCall = useCallback(async () => {
    setPhase("connecting");
    await startCamera();
    setTimeout(() => {
      setPhase("incall");
      callTimerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);

      // AI greeting
      setCallState("ai-speaking");
      const greetingText = AI_INTERVIEWER.getGreeting(resume, jobRole);
      speak(greetingText, () => {
        setTimeout(() => askQuestion(0), 1200);
      });
    }, 2800);
  }, [startCamera, speak, resume, jobRole]);

  const askQuestion = useCallback(
    (idx) => {
      if (idx >= questions.length) return;
      setCurrentQ(idx);
      setCallState("ai-speaking");
      setCurrentResult(null);
      speak(questions[idx].question, () => {
        setTimeout(() => {
          setCallState("user-turn");
          setQuestionTimer(questions[idx].timeLimit);
        }, 600);
      });
    },
    [questions, speak]
  );

  const startRecording = useCallback(() => {
    setCallState("recording");
    recordingStartRef.current = Date.now();
    const limit = questions[currentQ]?.timeLimit || 90;
    setQuestionTimer(limit);
    questionTimerRef.current = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [currentQ, questions]);

  const stopRecording = useCallback(async () => {
    setCallState("analyzing");
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }
    const duration = Math.round((Date.now() - recordingStartRef.current) / 1000);
    try {
      const analysis = await analyzeVideoResponse(questions[currentQ].id, duration, cameraActive);
      const res = {
        questionId: questions[currentQ].id,
        score: analysis.score,
        confidence: analysis.confidence,
        eyeContact: analysis.eyeContact,
        clarity: analysis.clarity,
        bodyLanguage: analysis.bodyLanguage,
        feedback: analysis.feedback,
        duration,
      };
      setCurrentResult(res);
      setResults((prev) => [...prev, res]);
      setCallState("feedback");
      speak(analysis.feedback, () => {});
    } catch {
      setCallState("feedback");
    }
  }, [currentQ, questions, cameraActive, speak]);

  const handleNext = useCallback(() => {
    if (currentQ + 1 < questions.length) {
      askQuestion(currentQ + 1);
    } else {
      setCallState("ai-speaking");
      speak(AI_INTERVIEWER.closing, () => {
        setTimeout(() => endCall(), 1500);
      });
    }
  }, [currentQ, questions, askQuestion, speak]);

  const endCall = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    stopCamera();
    localStorage.setItem("ai_recruiter_video_results", JSON.stringify(results));
    setPhase("ended");
  }, [results, stopCamera]);

  // ── Format time helper ────────────────────────────────────
  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ═══════════════════════════════════════════════════════════
  // PHASE: LOBBY
  // ═══════════════════════════════════════════════════════════

  if (phase === "lobby") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to join your AI Interview?
            </h1>
            <p className="mt-2 text-slate-400">
              Check your camera and microphone before joining the call
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Camera Preview */}
            <div className="lg:col-span-3">
              <div className="relative overflow-hidden rounded-2xl bg-slate-800 aspect-video shadow-2xl border border-slate-700">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-slate-700 flex items-center justify-center mb-3">
                      <svg
                        className="h-12 w-12 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-400">Camera preview will appear here</p>
                    {cameraError && (
                      <p className="mt-2 text-xs text-amber-400 max-w-xs text-center px-4">{cameraError}</p>
                    )}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                  <p className="text-xs font-medium text-white">{candidateName}</p>
                </div>
              </div>

              {/* Camera/Mic controls */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={async () => {
                    if (cameraActive) stopCamera();
                    else await startCamera();
                  }}
                  className="flex items-center gap-2 rounded-xl bg-slate-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-600 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  {cameraActive ? "Camera On ✓" : "Test Camera"}
                </button>
                <button
                  onClick={toggleMic}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                    micOn ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-600/80 text-white hover:bg-red-600"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                    />
                  </svg>
                  {micOn ? "Mic On ✓" : "Mic Off"}
                </button>
              </div>
            </div>

            {/* Meeting Info Sidebar */}
            <div className="lg:col-span-2 space-y-4">
              {/* AI Interviewer card */}
              <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6 text-center">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
                  Your AI Interviewer
                </p>
                <div className="flex justify-center mb-3">
                  <AIOrb speaking={false} size="sm" />
                </div>
                <p className="font-bold text-white text-lg">{AI_INTERVIEWER.name}</p>
                <p className="text-xs text-slate-400">{AI_INTERVIEWER.title}</p>
                <p className="text-xs text-cyan-400 mt-0.5">{AI_INTERVIEWER.description}</p>
                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400">Online — Ready to interview</span>
                </div>
              </div>

              {/* Meeting details */}
              <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Meeting Details</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500">🤖</span>
                    <span className="text-slate-300">AI-Powered Interview</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500">💼</span>
                    <span className="text-slate-300">{jobRole}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500">❓</span>
                    <span className="text-slate-300">
                      {questions.length} personalized questions
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500">⏱️</span>
                    <span className="text-slate-300">~10-15 minutes</span>
                  </div>
                  {resume && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-slate-500">📄</span>
                      <span className="text-cyan-400 text-xs">Resume analyzed — questions are personalized</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Join */}
              <button
                onClick={joinCall}
                disabled={questions.length === 0}
                className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-green-500/20 transition-all hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join AI Interview Call
              </button>
              <p className="text-center text-xs text-slate-500">
                ARIA will ask questions based on your resume
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE: CONNECTING
  // ═══════════════════════════════════════════════════════════

  if (phase === "connecting") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="text-center animate-fade-in">
          <AIOrb speaking={false} size="lg" />
          <h2 className="mt-6 text-xl font-bold text-white">Connecting to ARIA...</h2>
          <p className="mt-2 text-slate-400">Setting up your AI interview session</p>
          <div className="mt-6 flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-full bg-cyan-500"
                style={{ animation: `connectDots 1.4s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE: ENDED
  // ═══════════════════════════════════════════════════════════

  if (phase === "ended") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl animate-scale-in">
          <div className="rounded-2xl bg-slate-800 border border-slate-700 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10">
              <span className="text-3xl">🧠</span>
            </div>
            <h2 className="text-2xl font-bold text-white">AI Interview Complete</h2>
            <p className="mt-1 text-slate-400">Session with ARIA — {jobRole}</p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-slate-700/50 p-4">
                <p className="text-2xl font-bold text-white">{fmtTime(callDuration)}</p>
                <p className="text-xs text-slate-400">Duration</p>
              </div>
              <div className="rounded-xl bg-slate-700/50 p-4">
                <p className="text-2xl font-bold text-white">{results.length}</p>
                <p className="text-xs text-slate-400">Questions</p>
              </div>
              <div className="rounded-xl bg-slate-700/50 p-4">
                <p className="text-2xl font-bold text-cyan-400">{avgScore.toFixed(1)}/10</p>
                <p className="text-xs text-slate-400">Avg Score</p>
              </div>
            </div>

            {/* Per-question results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-2 text-left">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Question Analysis</p>
                {results.map((r, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-slate-700/30 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {questions.find((q) => q.id === r.questionId)?.category || `Question ${i + 1}`}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{r.feedback}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-cyan-400">{r.score.toFixed(1)}</p>
                      <p className="text-xs text-slate-500">{r.duration}s</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Aggregate metrics */}
            {results.length > 0 && (
              <div className="mt-6 grid grid-cols-4 gap-3">
                {[
                  {
                    label: "Eye Contact",
                    value: Math.round(
                      (results.reduce((s, r) => s + r.eyeContact, 0) / results.length) * 100
                    ),
                    color: "text-blue-400",
                  },
                  {
                    label: "Clarity",
                    value: Math.round(
                      (results.reduce((s, r) => s + r.clarity, 0) / results.length) * 100
                    ),
                    color: "text-emerald-400",
                  },
                  {
                    label: "Body Lang.",
                    value: Math.round(
                      (results.reduce((s, r) => s + r.bodyLanguage, 0) / results.length) * 100
                    ),
                    color: "text-purple-400",
                  },
                  {
                    label: "Confidence",
                    value: Math.round(
                      (results.reduce((s, r) => s + r.confidence, 0) / results.length) * 100
                    ),
                    color: "text-amber-400",
                  },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-slate-700/30 p-3 text-center">
                    <p className={`text-xl font-bold ${m.color}`}>{m.value}%</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/coding")}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:scale-[1.02]"
              >
                Continue to Coding Test →
              </button>
              <button
                onClick={() => navigate("/results")}
                className="flex-1 rounded-xl bg-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-600"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE: IN-CALL (THE MAIN VIDEO INTERVIEW)
  // ═══════════════════════════════════════════════════════════

  const isSpeaking = callState === "ai-speaking";
  const isUserTurn = callState === "user-turn";
  const isRecording = callState === "recording";
  const isAnalyzing = callState === "analyzing";
  const isFeedback = callState === "feedback";

  // Determine action button
  let showAction = false;
  let actionLabel = "";
  let actionFn = null;

  if (isUserTurn) {
    showAction = true;
    actionLabel = "🔴 Start Responding";
    actionFn = startRecording;
  } else if (isRecording) {
    showAction = true;
    actionLabel = "⏹ Submit Response";
    actionFn = stopRecording;
  } else if (isFeedback) {
    showAction = true;
    actionLabel = currentQ + 1 < questions.length ? "Next Question →" : "Finish Interview";
    actionFn = handleNext;
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2.5 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <span className="text-sm">🧠</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AI Interview — {jobRole}</p>
            <p className="text-xs text-slate-400">
              Question {currentQ + 1} of {questions.length}
              {resume ? " • Personalized" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-2 rounded-lg bg-slate-700/50 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-mono text-slate-300">{fmtTime(callDuration)}</span>
          </div>
          {/* Recording badge */}
          {isRecording && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/20 px-3 py-1.5 animate-pulse-record">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-red-400">REC</span>
            </div>
          )}
          {/* AI badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-2.5 py-1">
            <span className="text-xs">🤖</span>
            <span className="text-xs font-medium text-cyan-400">AI-Powered</span>
          </div>
        </div>
      </div>

      {/* ── Main Call Area ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-2 p-2 overflow-hidden">
        {/* ── AI TILE (Main) ──────────────────────────────────── */}
        <div className="flex-1 relative rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 overflow-hidden border border-slate-700/50 flex flex-col items-center justify-center min-h-[220px]">
          {/* AI Orb */}
          <AIOrb speaking={aiSpeaking} size="lg" />

          {/* AI Name */}
          <p className="mt-4 text-lg font-bold text-white">{AI_INTERVIEWER.name}</p>
          <p className="text-xs text-slate-400">{AI_INTERVIEWER.description}</p>

          {/* Soundline — The main waveform visualization */}
          <div className="mt-5 w-full max-w-md px-8">
            <Soundline active={aiSpeaking} barCount={48} />
          </div>

          {/* Speech text bubble */}
          {(isSpeaking || isUserTurn || isRecording || isFeedback) && typedText && (
            <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto">
              <div
                className={`rounded-2xl px-5 py-3.5 backdrop-blur-md shadow-xl text-sm leading-relaxed ${
                  isFeedback
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-200"
                    : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold shrink-0 mt-0.5">
                    {isFeedback ? (
                      <span className="text-emerald-400">📊 Analysis:</span>
                    ) : (
                      <span className="text-cyan-400">🧠 ARIA:</span>
                    )}
                  </span>
                  <p className="text-sm">{typedText}</p>
                </div>
              </div>
            </div>
          )}

          {/* Analyzing overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-2xl">
              <div className="text-center">
                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-3 border-cyan-400 border-t-transparent" />
                <p className="text-sm font-medium text-white">Analyzing your response...</p>
                <p className="mt-1 text-xs text-slate-400">
                  Evaluating clarity, confidence & communication
                </p>
              </div>
            </div>
          )}

          {/* Name plate */}
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/40 px-3 py-1 backdrop-blur-sm flex items-center gap-2">
            <span className="text-xs font-medium text-white">🧠 ARIA</span>
            {aiSpeaking && (
              <div className="flex items-end gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-0.5 rounded-full bg-cyan-400"
                    style={{
                      animation: `soundBar 0.4s ease-in-out ${i * 0.1}s infinite`,
                      height: "4px",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── USER WEBCAM TILE ────────────────────────────────── */}
        <div className="lg:w-80 relative rounded-2xl bg-slate-800 overflow-hidden border border-slate-700/50 min-h-[200px] lg:min-h-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />

          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
              <div className="h-16 w-16 rounded-full bg-slate-700 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <p className="mt-2 text-xs text-slate-500">Camera off</p>
            </div>
          )}

          {/* Timer (when user is responding) */}
          {(isRecording || isUserTurn) && (
            <div className="absolute top-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 backdrop-blur-sm">
              <span
                className={`text-xs font-mono font-bold ${questionTimer <= 10 ? "text-red-400" : "text-white"}`}
              >
                {fmtTime(questionTimer)}
              </span>
            </div>
          )}

          {/* Status badges */}
          {isRecording && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-red-600/80 px-2.5 py-1 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold text-white">Recording</span>
            </div>
          )}
          {isUserTurn && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-blue-600/80 px-2.5 py-1 backdrop-blur-sm">
              <span className="text-xs font-bold text-white">Your Turn</span>
            </div>
          )}

          {/* Score overlay during feedback */}
          {isFeedback && currentResult && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-white">{currentResult.score.toFixed(1)}</p>
                <p className="text-xs text-slate-300">out of 10</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { l: "👁", v: Math.round(currentResult.eyeContact * 100) },
                    { l: "🎯", v: Math.round(currentResult.clarity * 100) },
                    { l: "🧍", v: Math.round(currentResult.bodyLanguage * 100) },
                    { l: "💪", v: Math.round(currentResult.confidence * 100) },
                  ].map((m, i) => (
                    <div key={i} className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white">
                      {m.l} {m.v}%
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Name plate */}
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/40 px-3 py-1 backdrop-blur-sm flex items-center gap-2">
            <span className="text-xs font-medium text-white">{candidateName}</span>
            {!micOn && (
              <svg className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* ── Question Panel (visible during user's turn) ──────── */}
      {questions[currentQ] && (isUserTurn || isRecording) && (
        <div className="mx-2 mb-2 rounded-xl bg-slate-800/80 border border-slate-700/50 px-4 py-3 backdrop-blur-sm animate-slide-up">
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-400">
              {questions[currentQ].category}
            </span>
            <span className="text-xs text-slate-500">
              Q{currentQ + 1}/{questions.length}
            </span>
            {resume && (
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-400">
                Resume-Based
              </span>
            )}
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">{questions[currentQ].question}</p>
          <p className="mt-1 text-xs text-slate-500">💡 {questions[currentQ].tips}</p>
        </div>
      )}

      {/* ── Controls Bar ──────────────────────────────────────── */}
      <div className="flex justify-center pb-4 pt-2">
        <ControlsBar
          micOn={micOn}
          camOn={camOn}
          onToggleMic={toggleMic}
          onToggleCam={toggleCam}
          onEndCall={endCall}
          onAction={actionFn}
          showAction={showAction}
          actionLabel={actionLabel}
        />
      </div>
    </div>
  );
}
