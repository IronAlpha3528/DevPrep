import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import Loader from "../components/Loader";
import ProgressStepper from "../components/ProgressStepper";
import { uploadResume, JOB_ROLE_LIST } from "../mock/api";

const ROLE_ICONS = {
  "Full Stack Developer": "⚡",
  "Frontend Developer": "🎨",
  "Backend Developer": "⚙️",
  "Data Scientist": "📊",
  "DevOps Engineer": "🔧",
  "Mobile Developer": "📱",
  "UI/UX Designer": "✏️",
  "Product Manager": "📋",
};

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState(localStorage.getItem("ai_recruiter_job_role") || "");
  const [customRole, setCustomRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");

  const selectedRole = jobRole === "__custom__" ? customRole : jobRole;

  const steps = [
    { label: "Select Role", completed: !!selectedRole, active: !selectedRole && !file },
    { label: "Upload", completed: !!file, active: !!selectedRole && !file && !resume },
    { label: "Parse", completed: !!resume, active: loading },
    { label: "Review", completed: false, active: !!resume },
  ];

  const handleUpload = async () => {
    if (!file) return;
    if (!selectedRole) {
      setError("Please select a job role before uploading.");
      return;
    }
    setLoading(true);
    setError("");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const result = await uploadResume(file, selectedRole);
      clearInterval(interval);
      setProgress(100);
      setResume(result.resume);
    } catch {
      clearInterval(interval);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">Upload Your Resume</h1>
          <p className="mt-2 text-slate-500">
            Select your target role and upload your resume — ARIA will generate personalized practice questions
          </p>
        </div>

        <div className="mb-10">
          <ProgressStepper steps={steps} />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          {!resume ? (
            <>
              {/* Job Role Selector */}
              <div className="mb-8">
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Target Job Role <span className="text-red-500">*</span>
                </label>
                <p className="mb-3 text-xs text-slate-500">
                  Select the position you're applying for. ARIA will tailor interview questions and ATS scoring to this role.
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 mb-3">
                  {JOB_ROLE_LIST.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setJobRole(role);
                        setError("");
                      }}
                      className={`rounded-xl border-2 px-3 py-2.5 text-left text-xs font-medium transition-all ${
                        jobRole === role
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                            jobRole === role ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {jobRole === role ? "✓" : ROLE_ICONS[role] || "💼"}
                        </span>
                        <span className="leading-tight">{role}</span>
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setJobRole("__custom__");
                      setError("");
                    }}
                    className={`rounded-xl border-2 px-3 py-2.5 text-left text-xs font-medium transition-all ${
                      jobRole === "__custom__"
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-dashed border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-200 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          jobRole === "__custom__" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        +
                      </span>
                      <span className="leading-tight">Other Role</span>
                    </div>
                  </button>
                </div>

                {jobRole === "__custom__" && (
                  <div className="animate-fade-in">
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="Enter job role (e.g., Machine Learning Engineer)"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    />
                  </div>
                )}

                {selectedRole && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                    <span className="text-sm">💼</span>
                    <span className="text-xs font-semibold text-blue-700">Applying for: {selectedRole}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Resume Upload</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <FileUploader onFileSelect={(f) => setFile(f)} />

              {loading && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">Uploading & analyzing...</span>
                    <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              {loading && <Loader text="Parsing your resume with AI..." />}

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-medium">❌ {error}</p>
                </div>
              )}

              {file && !loading && (
                <button
                  onClick={handleUpload}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50"
                  disabled={!selectedRole}
                >
                  {selectedRole ? `Upload & Analyze for "${selectedRole}"` : "Select a job role first"}
                </button>
              )}
            </>
          ) : (
            /* ── Resume Preview ─────────────────────────────── */
            <div className="space-y-6">
              <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-green-800">Resume Parsed Successfully!</p>
                  <p className="text-sm text-green-600">ARIA has analyzed your resume and generated personalized questions</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-3">
                <span className="text-lg">💼</span>
                <div>
                  <p className="text-xs text-indigo-500 font-medium">Target Role</p>
                  <p className="text-sm font-bold text-indigo-700">{selectedRole}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard label="Name" value={resume.name} />
                <InfoCard label="Email" value={resume.email} />
                <InfoCard label="Phone" value={resume.phone} />
                <InfoCard label="Education" value={resume.education} />
                <InfoCard
                  label="Experience"
                  value={`${resume.experience.years} years in ${resume.experience.domain}`}
                />
                <InfoCard label="Internships" value={resume.experience.hasInternships ? "Yes" : "No"} />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-700">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-700">Projects</h3>
                <ul className="space-y-2">
                  {resume.projects.map((project, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {project}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-700">Summary</h3>
                <p className="text-sm leading-relaxed text-slate-600">{resume.summary}</p>
              </div>

              {/* ── Primary CTA: Join AI Video Interview ───── */}
              <div className="rounded-2xl border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                    <span className="text-2xl">🧠</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Your AI Interview is Ready
                </h3>
                <p className="text-sm text-slate-500 mb-1">
                  ARIA has generated <strong>personalized questions</strong> based on your resume, skills, and projects.
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  Join the video call — ARIA will ask questions and evaluate your responses in real-time.
                </p>
                <button
                  onClick={() => navigate("/video-interview")}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:scale-[1.02]"
                >
                  🧠 Join AI Video Interview
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/interview")}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:scale-[1.02]"
                >
                  💬 Text Interview Instead
                </button>
                <button
                  onClick={() => {
                    setResume(null);
                    setFile(null);
                    setProgress(0);
                  }}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Upload Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
