/**
 * Mock Backend API
 * ----------------
 * In-memory simulation of all backend endpoints.
 * Now with resume-based question generation and pure AI interviewer.
 */

import { calculateATSScore } from "../utils/atsScoring";

// ── Simulated delay ────────────────────────────────────────

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Job Descriptions by Role ───────────────────────────────

export const JOB_ROLES = {
  "Full Stack Developer": {
    title: "Full Stack Developer",
    requiredSkills: ["React", "Node.js", "TypeScript", "JavaScript", "SQL", "Git", "REST API", "HTML", "CSS"],
    preferredSkills: ["Python", "Docker", "AWS", "GraphQL", "Redis", "MongoDB"],
    requiredExperience: 2,
    domain: "Software Engineering",
    keywords: ["react", "node", "typescript", "javascript", "fullstack", "full-stack", "api", "database", "frontend", "backend", "web", "agile", "testing", "deployment", "cloud", "microservices", "responsive", "performance"],
    tools: ["VS Code", "Git", "Docker", "Jira", "Figma", "Postman", "AWS", "Linux"],
  },
  "Frontend Developer": {
    title: "Frontend Developer",
    requiredSkills: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS", "Git", "REST API", "Redux"],
    preferredSkills: ["Next.js", "Vue.js", "GraphQL", "Figma", "Storybook", "Jest"],
    requiredExperience: 2,
    domain: "Frontend Engineering",
    keywords: ["react", "frontend", "ui", "ux", "responsive", "accessibility", "component", "design system", "css", "animation", "performance", "seo", "testing", "web", "javascript", "typescript", "spa", "pwa"],
    tools: ["VS Code", "Git", "Figma", "Chrome DevTools", "Storybook", "Webpack", "Vite", "npm"],
  },
  "Backend Developer": {
    title: "Backend Developer",
    requiredSkills: ["Node.js", "Python", "SQL", "REST API", "Git", "Docker", "PostgreSQL", "Redis", "Linux"],
    preferredSkills: ["Go", "Kubernetes", "AWS", "GraphQL", "RabbitMQ", "Elasticsearch"],
    requiredExperience: 3,
    domain: "Backend Engineering",
    keywords: ["api", "backend", "server", "database", "microservices", "scalable", "security", "authentication", "caching", "queue", "deployment", "ci/cd", "monitoring", "performance", "sql", "nosql", "cloud", "distributed"],
    tools: ["VS Code", "Git", "Docker", "Kubernetes", "Postman", "AWS", "Linux", "Terraform"],
  },
  "Data Scientist": {
    title: "Data Scientist",
    requiredSkills: ["Python", "SQL", "Machine Learning", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Statistics", "Data Visualization"],
    preferredSkills: ["PyTorch", "Spark", "R", "Tableau", "Deep Learning", "NLP"],
    requiredExperience: 2,
    domain: "Data Science",
    keywords: ["machine learning", "data", "model", "prediction", "analysis", "statistics", "neural network", "deep learning", "nlp", "classification", "regression", "feature engineering", "visualization", "pipeline", "python", "experiment"],
    tools: ["Jupyter", "Git", "Python", "TensorFlow", "PyTorch", "Tableau", "AWS SageMaker", "Docker"],
  },
  "DevOps Engineer": {
    title: "DevOps Engineer",
    requiredSkills: ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD", "Terraform", "Git", "Python", "Bash"],
    preferredSkills: ["Ansible", "Jenkins", "Prometheus", "Grafana", "GCP", "Azure"],
    requiredExperience: 3,
    domain: "DevOps Engineering",
    keywords: ["devops", "infrastructure", "deployment", "automation", "ci/cd", "monitoring", "cloud", "container", "orchestration", "scaling", "reliability", "security", "pipeline", "terraform", "kubernetes", "docker", "linux", "networking"],
    tools: ["Docker", "Kubernetes", "Terraform", "Jenkins", "Git", "AWS", "Prometheus", "Grafana"],
  },
  "Mobile Developer": {
    title: "Mobile Developer",
    requiredSkills: ["React Native", "JavaScript", "TypeScript", "iOS", "Android", "Git", "REST API", "Redux", "CSS"],
    preferredSkills: ["Swift", "Kotlin", "Flutter", "Firebase", "GraphQL", "Expo"],
    requiredExperience: 2,
    domain: "Mobile Development",
    keywords: ["mobile", "react native", "ios", "android", "app", "responsive", "performance", "native", "cross-platform", "push notification", "offline", "animation", "navigation", "state management", "testing", "deployment", "store"],
    tools: ["VS Code", "Xcode", "Android Studio", "Git", "Figma", "Firebase", "Expo", "Postman"],
  },
  "UI/UX Designer": {
    title: "UI/UX Designer",
    requiredSkills: ["Figma", "UI Design", "UX Research", "Prototyping", "Wireframing", "Design Systems", "HTML", "CSS", "User Testing"],
    preferredSkills: ["Adobe XD", "Sketch", "After Effects", "Framer", "Accessibility", "React"],
    requiredExperience: 2,
    domain: "Design",
    keywords: ["design", "user experience", "user interface", "wireframe", "prototype", "usability", "accessibility", "responsive", "interaction", "visual", "typography", "color", "layout", "research", "persona", "journey map"],
    tools: ["Figma", "Sketch", "Adobe XD", "InVision", "Miro", "Zeplin", "After Effects", "Framer"],
  },
  "Product Manager": {
    title: "Product Manager",
    requiredSkills: ["Product Strategy", "Agile", "User Research", "Data Analysis", "Roadmapping", "Stakeholder Management", "SQL", "A/B Testing", "Communication"],
    preferredSkills: ["Jira", "Amplitude", "Mixpanel", "Figma", "Technical Writing", "Python"],
    requiredExperience: 3,
    domain: "Product Management",
    keywords: ["product", "strategy", "roadmap", "user", "market", "stakeholder", "agile", "sprint", "prioritization", "metrics", "kpi", "growth", "feature", "requirement", "launch", "feedback", "analysis", "iteration"],
    tools: ["Jira", "Confluence", "Amplitude", "Mixpanel", "Figma", "Miro", "Notion", "Slack"],
  },
};

export const JOB_ROLE_LIST = Object.keys(JOB_ROLES);

export function getJobDescription(role) {
  if (role && JOB_ROLES[role]) return JOB_ROLES[role];
  const stored = localStorage.getItem("ai_recruiter_job_role");
  if (stored && JOB_ROLES[stored]) return JOB_ROLES[stored];
  return JOB_ROLES["Full Stack Developer"];
}

// ── Mock Resume Data ───────────────────────────────────────

export const MOCK_RESUME = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  skills: ["React", "JavaScript", "TypeScript", "Node.js", "Python", "SQL", "Git", "REST API", "HTML", "CSS", "Docker", "MongoDB"],
  experience: { years: 3, domain: "Software Engineering", hasInternships: true },
  projects: [
    "E-commerce platform built with React and Node.js",
    "Real-time chat application using WebSocket and Redis",
    "Machine learning pipeline for sentiment analysis in Python",
    "CI/CD deployment automation with Docker and AWS",
  ],
  education: "B.S. Computer Science, State University, GPA 3.7",
  summary: "Full-stack developer with 3 years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Passionate about clean code and agile methodologies.",
};

// ── AI Interviewer (Pure AI Persona) ───────────────────────

export const AI_INTERVIEWER = {
  name: "ARIA",
  title: "AI Interview Assistant",
  description: "Advanced Recruiting Intelligence Agent",
  getGreeting(resume, jobRole) {
    if (resume && resume.name) {
      return `Hello ${resume.name}! I'm ARIA, your AI interview assistant. I've analyzed your resume and I'm ready to explore your experience in ${resume.experience?.domain || "your field"} further. I'll ask you a series of questions tailored specifically to your background and the ${jobRole || "target"} position. Please take your time with each response. Let's begin!`;
    }
    return "Hello! I'm ARIA, your AI interview assistant. I'll be asking you a series of questions to learn about your skills and experience. Take your time with each answer. Let's begin!";
  },
  closing: "Thank you for your responses! I've completed my analysis of your answers. Your detailed evaluation results, including scores for communication, confidence, and overall fit, will be available shortly. Best of luck with your application!",
};

// ── Resume-Based Question Generator ────────────────────────

function generateResumeQuestions(resume, jobRole) {
  const questions = [];
  const role = jobRole || "the target position";

  // Q1 — Skill deep-dive: pick a specific skill from the resume
  if (resume && resume.skills && resume.skills.length > 0) {
    const randomSkills = [...resume.skills].sort(() => 0.5 - Math.random());
    const skill1 = randomSkills[0];
    const skill2 = randomSkills[1] || skill1;
    questions.push({
      id: 201,
      question: `I noticed you have experience with ${skill1} and ${skill2}. Can you walk me through a specific scenario where you used these technologies together? What technical challenges did you encounter and how did you solve them?`,
      category: "Technical Deep-Dive",
      timeLimit: 120,
      tips: `Be specific about the project, your contributions with ${skill1} and ${skill2}, and the outcomes.`,
    });
  }

  // Q2 — Project discussion: pick a specific project
  if (resume && resume.projects && resume.projects.length > 0) {
    const project = resume.projects[Math.floor(Math.random() * resume.projects.length)];
    questions.push({
      id: 202,
      question: `You mentioned working on "${project}" in your resume. Tell me about the architecture decisions you made, the biggest technical challenge you faced, and what you would do differently if you built it again today.`,
      category: "Project Discussion",
      timeLimit: 120,
      tips: "Discuss design trade-offs, alternatives you considered, technical depth, and lessons learned.",
    });
  }

  // Q3 — Experience-based question
  if (resume && resume.experience) {
    const years = resume.experience.years || 0;
    const domain = resume.experience.domain || "your field";
    questions.push({
      id: 203,
      question: `With ${years} year${years !== 1 ? "s" : ""} of experience in ${domain}, what has been your most significant technical achievement? How did it impact the team or the product?`,
      category: "Experience & Impact",
      timeLimit: 90,
      tips: "Focus on measurable outcomes, leadership moments, and the specific value you delivered.",
    });
  }

  // Q4 — Role-specific question
  questions.push({
    id: 204,
    question: `For the ${role} position, how would you approach your first 90 days? What would you prioritize to make an immediate impact, and how would you ramp up on the team's existing codebase and processes?`,
    category: "Role Fit",
    timeLimit: 90,
    tips: "Show understanding of the role, proactive approach, and ability to integrate quickly.",
  });

  // Q5 — Problem solving / behavioral (always include)
  questions.push({
    id: 205,
    question: "Describe a time when you had to debug a critical production issue under pressure. Walk me through your approach, the tools you used, and how you prevented similar issues in the future.",
    category: "Problem Solving",
    timeLimit: 90,
    tips: "Use the STAR method. Emphasize systematic debugging, collaboration, and preventive measures.",
  });

  // Q6 — Extra: collaboration/communication
  questions.push({
    id: 206,
    question: "Tell me about a time you disagreed with a teammate on a technical approach. How did you handle the conversation, and what was the outcome?",
    category: "Communication",
    timeLimit: 90,
    tips: "Show emotional intelligence, active listening, willingness to compromise, and professional maturity.",
  });

  // Return 4 random questions (always include Q1 and Q2 if available)
  const mustInclude = questions.slice(0, Math.min(2, questions.length));
  const rest = questions.slice(2).sort(() => 0.5 - Math.random());
  const selected = [...mustInclude, ...rest].slice(0, 4);
  return selected;
}

// ── Fallback general questions ─────────────────────────────

const GENERAL_VIDEO_QUESTIONS = [
  { id: 301, question: "Tell me about yourself — your background, what excites you about technology, and why you're exploring this role.", category: "Introduction", timeLimit: 120, tips: "Keep it concise. Focus on relevant experience and genuine enthusiasm." },
  { id: 302, question: "What is a recent technical concept or tool you learned? How did you go about learning it, and have you applied it in any project?", category: "Learning Ability", timeLimit: 90, tips: "Show your curiosity and structured approach to learning." },
  { id: 303, question: "Describe a project you're most proud of. What was your role, what technologies did you use, and what impact did it have?", category: "Project Showcase", timeLimit: 120, tips: "Be specific about your contributions and measurable outcomes." },
  { id: 304, question: "How do you prioritize tasks when you have multiple deadlines? Give me a specific example.", category: "Time Management", timeLimit: 90, tips: "Discuss frameworks, communication strategies, and real outcomes." },
];

// ── Interview Questions (Text-based) ───────────────────────

const INTERVIEW_QUESTIONS = [
  { id: 1, question: "Tell me about yourself and your experience as a developer.", category: "Introduction", tips: "Focus on relevant experience, key achievements, and what drives you." },
  { id: 2, question: "What is the difference between REST and GraphQL? When would you choose one over the other?", category: "Technical", tips: "Discuss trade-offs: flexibility, caching, over-fetching, complexity." },
  { id: 3, question: "Describe a challenging bug you encountered and how you resolved it.", category: "Problem Solving", tips: "Use the STAR method: Situation, Task, Action, Result." },
  { id: 4, question: "How do you ensure code quality in a team environment?", category: "Collaboration", tips: "Mention code reviews, testing, CI/CD, documentation, standards." },
  { id: 5, question: "Explain how React's virtual DOM works and why it improves performance.", category: "Technical", tips: "Cover reconciliation, diffing algorithm, batched updates." },
  { id: 6, question: "Where do you see yourself in 3 years? What are your career goals?", category: "Behavioral", tips: "Show ambition while aligning with the company's growth." },
  { id: 7, question: "How would you design a scalable notification system for a social media platform?", category: "System Design", tips: "Discuss message queues, push vs pull, real-time delivery, storage." },
  { id: 8, question: "What strategies do you use for debugging production issues?", category: "Problem Solving", tips: "Logging, monitoring, reproduce locally, rollback strategies." },
];

// ── Coding Challenge ───────────────────────────────────────

export const CODING_CHALLENGES = [
  {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice.\n\nExample:\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9",
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expected: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", expected: "[1,2]" },
      { input: "nums = [3,3], target = 6", expected: "[0,1]" },
    ],
    languages: ["JavaScript", "Python", "Java"],
    starterCode: {
      JavaScript: "function twoSum(nums, target) {\n  // Write your solution here\n  \n}",
      Python: "def two_sum(nums, target):\n    # Write your solution here\n    pass",
      Java: "public int[] twoSum(int[] nums, int target) {\n    // Write your solution here\n    return new int[]{};\n}",
    },
  },
];

// ═══════════════════════════════════════════════════════════
// API Endpoints
// ═══════════════════════════════════════════════════════════

/** POST /api/upload */
export async function uploadResume(file, jobRole) {
  await delay(1800);
  const resume = { ...MOCK_RESUME };
  const role = jobRole || "Full Stack Developer";
  localStorage.setItem("ai_recruiter_resume", JSON.stringify(resume));
  localStorage.setItem("ai_recruiter_job_role", role);
  return { success: true, resume, jobRole: role };
}

/** POST /api/start — Text interview */
export async function startInterview() {
  await delay(800);
  const sessionId = `session_${Date.now()}`;
  const shuffled = [...INTERVIEW_QUESTIONS].sort(() => 0.5 - Math.random());
  const questions = shuffled.slice(0, 5);
  localStorage.setItem("ai_recruiter_session", sessionId);
  localStorage.setItem("ai_recruiter_questions", JSON.stringify(questions));
  return { sessionId, questions, totalQuestions: questions.length };
}

/**
 * POST /api/video/start
 * Now generates questions based on the uploaded resume.
 */
export async function startVideoInterview() {
  await delay(1000);
  const sessionId = `video_session_${Date.now()}`;

  // Read resume and role from localStorage
  const storedResume = localStorage.getItem("ai_recruiter_resume");
  const storedRole = localStorage.getItem("ai_recruiter_job_role");
  const resume = storedResume ? JSON.parse(storedResume) : null;
  const jobRole = storedRole || "Full Stack Developer";

  let questions;
  if (resume) {
    // Generate personalized questions based on resume
    questions = generateResumeQuestions(resume, jobRole);
  } else {
    // Fallback to general questions
    questions = [...GENERAL_VIDEO_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 4);
  }

  localStorage.setItem("ai_recruiter_video_session", sessionId);
  return {
    sessionId,
    questions,
    totalQuestions: questions.length,
    resume,
    jobRole,
  };
}

/** POST /api/video/analyze */
export async function analyzeVideoResponse(questionId, durationSeconds, hasVideo) {
  await delay(2500);
  const eyeContact = Math.round((0.55 + Math.random() * 0.4) * 100) / 100;
  const clarity = Math.round((0.5 + Math.random() * 0.45) * 100) / 100;
  const bodyLanguage = Math.round((0.5 + Math.random() * 0.4) * 100) / 100;
  const confidence = Math.round((0.5 + Math.random() * 0.45) * 100) / 100;
  const score = Math.round(((eyeContact + clarity + bodyLanguage + confidence) / 4) * 10 * 10) / 10;

  const feedbackOptions = [
    "Great response clarity and structured delivery. Consider pausing briefly between key points for emphasis.",
    "Good energy detected in your response. Try to structure your answer with a clear beginning, middle, and end.",
    "Strong presence and engagement observed. Adding more specific examples would strengthen your answer.",
    "Clear articulation of your thoughts. Maintaining consistent eye contact with the camera will improve connection.",
    "Professional and composed demeanor throughout. Varying your tone slightly will help maintain engagement.",
    "Thoughtful response with good pacing. Consider summarizing your key point at the end for impact.",
  ];

  return {
    score,
    confidence,
    eyeContact,
    clarity,
    bodyLanguage,
    feedback: feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)],
  };
}

/** POST /api/answer */
export async function submitAnswer(questionId, answer) {
  await delay(1000);
  const lengthFactor = Math.min(answer.length / 200, 1);
  const hasKeywords = ["experience", "project", "team", "solution", "built", "developed", "implemented", "design"]
    .filter((k) => answer.toLowerCase().includes(k)).length;
  const keywordFactor = Math.min(hasKeywords / 3, 1);
  const baseScore = 4 + lengthFactor * 3 + keywordFactor * 3;
  const score = Math.min(10, Math.round(baseScore * 10) / 10);
  const confidence = 0.5 + lengthFactor * 0.3 + keywordFactor * 0.2;

  const feedbackOptions = [
    "Good structure in your response. Consider adding specific metrics.",
    "Solid answer. Try to include more concrete examples.",
    "Well-articulated. Quantifying your achievements would strengthen this.",
    "Thoughtful response. Adding a specific technology reference would help.",
    "Clear communication. Consider the STAR method for behavioral answers.",
  ];

  return {
    score,
    feedback: feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)],
    confidence: Math.round(confidence * 100) / 100,
  };
}

/** POST /api/code */
export async function evaluateCode(challengeId, code, language) {
  await delay(2000);
  const totalTestCases = 3;
  const hasFunction = code.includes("function") || code.includes("def") || code.includes("public");
  const hasReturn = code.includes("return");
  const hasLoop = code.includes("for") || code.includes("while") || code.includes("map") || code.includes("reduce");
  const hasCondition = code.includes("if") || code.includes("===") || code.includes("==");
  const codeLength = code.trim().length;

  let passed = 0;
  if (hasFunction && codeLength > 50) passed++;
  if (hasReturn && (hasLoop || hasCondition)) passed++;
  if (hasReturn && hasLoop && hasCondition && codeLength > 80) passed++;

  const codeQuality = Math.min(
    1,
    (codeLength > 30 ? 0.3 : 0) + (hasFunction ? 0.2 : 0) + (hasReturn ? 0.2 : 0) + (hasLoop ? 0.15 : 0) + (hasCondition ? 0.15 : 0)
  );

  const output =
    passed === totalTestCases
      ? `✅ All ${totalTestCases} test cases passed!\n\nTest 1: PASS — nums=[2,7,11,15], target=9 → [0,1]\nTest 2: PASS — nums=[3,2,4], target=6 → [1,2]\nTest 3: PASS — nums=[3,3], target=6 → [0,1]`
      : passed > 0
      ? `⚠️ ${passed}/${totalTestCases} test cases passed.\n\nTest 1: ${passed >= 1 ? "PASS" : "FAIL"} — nums=[2,7,11,15], target=9\nTest 2: ${passed >= 2 ? "PASS" : "FAIL"} — nums=[3,2,4], target=6\nTest 3: ${passed >= 3 ? "PASS" : "FAIL"} — nums=[3,3], target=6`
      : `❌ 0/${totalTestCases} test cases passed.\n\nMake sure your function returns the correct indices.`;

  return {
    testCasesPassed: passed,
    totalTestCases,
    output,
    codeQuality,
    timeTaken: Math.floor(Math.random() * 600 + 120),
  };
}

/** GET /api/results */
export async function getResults() {
  await delay(1500);
  const storedResume = localStorage.getItem("ai_recruiter_resume");
  const resume = storedResume ? JSON.parse(storedResume) : MOCK_RESUME;
  const job = getJobDescription();

  const storedAnswers = localStorage.getItem("ai_recruiter_answers");
  const answers = storedAnswers ? JSON.parse(storedAnswers) : [];

  const storedVideo = localStorage.getItem("ai_recruiter_video_results");
  const videoResults = storedVideo ? JSON.parse(storedVideo) : [];

  let avgConf;
  if (answers.length > 0 || videoResults.length > 0) {
    const textConf =
      answers.length > 0 ? answers.reduce((s, a) => s + (a.score / 10) * 0.8 + 0.2, 0) / answers.length : 0;
    const videoConf =
      videoResults.length > 0 ? videoResults.reduce((s, v) => s + v.confidence, 0) / videoResults.length : 0;
    if (answers.length > 0 && videoResults.length > 0) avgConf = textConf * 0.5 + videoConf * 0.5;
    else if (videoResults.length > 0) avgConf = videoConf;
    else avgConf = textConf;
  } else {
    avgConf = 0.65;
  }

  const videoAnswers = videoResults.map((v, i) => ({
    question: `Video Q${i + 1}`,
    answer: "Video response recorded with AI analysis",
    score: v.score,
  }));
  const allAnswers =
    answers.length > 0 || videoResults.length > 0
      ? [...answers, ...videoAnswers]
      : [
          { question: "Q1", answer: "Sample answer with relevant experience and project details.", score: 7 },
          { question: "Q2", answer: "Technical answer demonstrating knowledge.", score: 8 },
          { question: "Q3", answer: "Problem solving approach described.", score: 6 },
        ];

  const interviewPerf = { answers: allAnswers, averageConfidence: avgConf };

  const storedCoding = localStorage.getItem("ai_recruiter_coding");
  const codingData = storedCoding ? JSON.parse(storedCoding) : null;
  const codingPerf = codingData
    ? {
        testCasesPassed: codingData.testCasesPassed,
        totalTestCases: codingData.totalTestCases,
        codeQuality: codingData.codeQuality,
        timeTakenSeconds: codingData.timeTaken,
        maxTimeSeconds: 900,
      }
    : { testCasesPassed: 2, totalTestCases: 3, codeQuality: 0.7, timeTakenSeconds: 420, maxTimeSeconds: 900 };

  const result = calculateATSScore(resume, job, interviewPerf, codingPerf);

  let videoPerformance;
  if (videoResults.length > 0) {
    videoPerformance = {
      eyeContact: Math.round((videoResults.reduce((s, v) => s + v.eyeContact, 0) / videoResults.length) * 100),
      clarity: Math.round((videoResults.reduce((s, v) => s + v.clarity, 0) / videoResults.length) * 100),
      bodyLanguage: Math.round((videoResults.reduce((s, v) => s + v.bodyLanguage, 0) / videoResults.length) * 100),
      confidence: Math.round((videoResults.reduce((s, v) => s + v.confidence, 0) / videoResults.length) * 100),
      avgScore: Math.round((videoResults.reduce((s, v) => s + v.score, 0) / videoResults.length) * 10) / 10,
    };
  }

  localStorage.setItem("ai_recruiter_result", JSON.stringify({ ...result, videoPerformance }));
  return { ...result, videoPerformance };
}
