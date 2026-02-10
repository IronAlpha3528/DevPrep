/**
 * ATS Scoring Engine
 * ------------------
 * 100-point scale with weighted categories:
 *   Resume Match:      30%
 *   Technical Skills:  25%
 *   Experience:        15%
 *   Communication:     15%
 *   Coding Test:       15%
 */

// ── Helper: word-level overlap ratio ───────────────────────

function overlapRatio(a, b) {
  if (b.length === 0) return 0;
  const setA = new Set(a.map((s) => s.toLowerCase().trim()));
  const setB = new Set(b.map((s) => s.toLowerCase().trim()));
  let matches = 0;
  setB.forEach((item) => {
    if (setA.has(item)) matches++;
  });
  return matches / setB.size;
}

// ── 1. Resume Match Score (max 30) ─────────────────────────

function scoreResumeMatch(resume, job) {
  const feedback = [];
  const resumeText = [...resume.skills, ...resume.projects, resume.summary, resume.education]
    .join(" ").toLowerCase().split(/\W+/);
  const keywordOverlap = overlapRatio(resumeText, job.keywords);
  const keywordScore = keywordOverlap * 12;

  const skillOverlap = overlapRatio(resume.skills, job.requiredSkills);
  const skillScore = skillOverlap * 12;

  const roleRelevant =
    resume.summary.toLowerCase().includes(job.title.toLowerCase()) ||
    resume.projects.some((p) => p.toLowerCase().includes(job.domain.toLowerCase()));
  const roleScore = roleRelevant ? 6 : 2;

  const total = Math.min(30, Math.round(keywordScore + skillScore + roleScore));

  if (keywordOverlap > 0.6) feedback.push("Strong keyword match with job description");
  else if (keywordOverlap < 0.3) feedback.push("Add more relevant keywords from the job description");

  if (skillOverlap > 0.7) feedback.push("Excellent skill alignment");
  else if (skillOverlap < 0.4) feedback.push("Consider acquiring more required skills");

  if (roleRelevant) feedback.push("Resume demonstrates role relevance");
  else feedback.push("Tailor your summary to the target role");

  return { score: total, feedback };
}

// ── 2. Technical Skills Score (max 25) ─────────────────────

function scoreTechnicalSkills(resume, job) {
  const feedback = [];
  const reqPresence = overlapRatio(resume.skills, job.requiredSkills);
  const reqScore = reqPresence * 10;

  const projectRelevance = resume.projects.filter((p) =>
    job.keywords.some((k) => p.toLowerCase().includes(k.toLowerCase()))
  ).length / Math.max(resume.projects.length, 1);
  const projScore = projectRelevance * 7.5;

  const toolOverlap = overlapRatio(resume.skills, job.tools);
  const toolScore = toolOverlap * 7.5;

  const total = Math.min(25, Math.round(reqScore + projScore + toolScore));

  if (reqPresence > 0.7) feedback.push("Strong technical foundation in required skills");
  else feedback.push("Strengthen core technical skills for this role");

  if (projectRelevance > 0.5) feedback.push("Projects align well with job requirements");
  else feedback.push("Add more relevant projects to showcase skills");

  return { score: total, feedback };
}

// ── 3. Experience Score (max 15) ───────────────────────────

function scoreExperience(resume, job) {
  const feedback = [];
  const yearRatio = Math.min(resume.experience.years / Math.max(job.requiredExperience, 1), 1);
  const yearScore = yearRatio * 7.5;

  const domainMatch = resume.experience.domain.toLowerCase() === job.domain.toLowerCase();
  const domainScore = domainMatch ? 4.5 : 1.5;

  const internScore = resume.experience.hasInternships ? 3 : 0;

  const total = Math.min(15, Math.round(yearScore + domainScore + internScore));

  if (yearRatio >= 1) feedback.push("Meets experience requirements");
  else feedback.push(`Consider gaining more experience (${resume.experience.years}/${job.requiredExperience} years)`);

  if (domainMatch) feedback.push("Domain experience is a strong match");

  return { score: total, feedback };
}

// ── 4. Communication Score (max 15) ────────────────────────

function scoreCommunication(interview) {
  const feedback = [];
  if (interview.answers.length === 0) {
    return { score: 0, feedback: ["Interview not completed"] };
  }

  const avgScore = interview.answers.reduce((s, a) => s + a.score, 0) / interview.answers.length;
  const clarityScore = (avgScore / 10) * 6;

  const avgLen = interview.answers.reduce((s, a) => s + a.answer.length, 0) / interview.answers.length;
  const lengthScore = Math.min(1, avgLen / 200) * 4.5;

  const confScore = interview.averageConfidence * 4.5;

  const total = Math.min(15, Math.round(clarityScore + lengthScore + confScore));

  if (avgScore > 7) feedback.push("Clear and articulate responses");
  else feedback.push("Improve communication clarity in answers");

  if (interview.averageConfidence > 0.7) feedback.push("High confidence throughout the interview");
  else feedback.push("Work on presenting answers with more confidence");

  return { score: total, feedback };
}

// ── 5. Coding Score (max 15) ───────────────────────────────

function scoreCoding(coding) {
  const feedback = [];
  if (coding.totalTestCases === 0) {
    return { score: 0, feedback: ["Coding test not completed"] };
  }

  const passRate = coding.testCasesPassed / coding.totalTestCases;
  const passScore = passRate * 7.5;

  const qualScore = coding.codeQuality * 4.5;

  const timeRatio = 1 - Math.min(coding.timeTakenSeconds / coding.maxTimeSeconds, 1);
  const timeScore = timeRatio * 3;

  const total = Math.min(15, Math.round(passScore + qualScore + timeScore));

  if (passRate > 0.8) feedback.push("Excellent test case pass rate");
  else if (passRate > 0.5) feedback.push("Good problem-solving, but missed some edge cases");
  else feedback.push("Practice more coding problems to improve pass rate");

  if (coding.codeQuality > 0.7) feedback.push("Clean and well-structured code");
  else feedback.push("Focus on code readability and best practices");

  return { score: total, feedback };
}

// ── Main scoring function ──────────────────────────────────

export function calculateATSScore(resume, job, interview, coding) {
  const r = scoreResumeMatch(resume, job);
  const t = scoreTechnicalSkills(resume, job);
  const e = scoreExperience(resume, job);
  const c = scoreCommunication(interview);
  const k = scoreCoding(coding);

  const totalScore = r.score + t.score + e.score + c.score + k.score;

  let verdict;
  if (totalScore >= 80) verdict = "Strong Hire";
  else if (totalScore >= 65) verdict = "Hire";
  else if (totalScore >= 45) verdict = "Review";
  else verdict = "Reject";

  const allFeedback = [...r.feedback, ...t.feedback, ...e.feedback, ...c.feedback, ...k.feedback];
  const feedback = allFeedback.slice(0, 6);

  return {
    totalScore,
    breakdown: {
      resume: r.score,
      technical: t.score,
      experience: e.score,
      communication: c.score,
      coding: k.score,
    },
    verdict,
    feedback,
  };
}
