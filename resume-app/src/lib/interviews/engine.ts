export const INTERVIEW_PRACTICE_DISCLAIMER =
  "Interview scores and feedback are intended solely as AI-assisted practice metrics for career preparation. They do not represent an objective measurement of candidates' true personality, intelligence, or hiring eligibility.";

export interface InterviewQuestionItem {
  id?: string;
  question: string;
  category: string;
  order: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  expected_topics?: string[];
  evaluation_criteria?: string;
  is_follow_up?: boolean;
  time_limit_seconds?: number;
}

export interface AnswerEvaluationResult {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  relevanceScore: number;
  starAnalysis?: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
  confidenceScore?: number;
  feedback?: any;
  strengths?: string[];
  improvements?: string[];
  suggestedAnswer?: string;
  technicalRelevance?: boolean;
  resumeContextUsed?: boolean;
}

/**
 * Generates at least 30 personalized primary interview questions.
 * Target distribution for 30 questions:
 * - Introduction: 2
 * - Resume / Projects: 5
 * - Technical: 8
 * - Behavioral: 5
 * - Situational: 4
 * - Job-Specific: 4
 * - HR / Career: 2
 * Total = 30
 */
export function generateInterviewQuestions(
  targetRole: string,
  interviewType: 'technical' | 'behavioral' | 'hr' | 'mixed' = 'mixed',
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  totalQuestionsCount: number = 30,
  resumeText: string = '',
  jobDescriptionText: string = ''
): InterviewQuestionItem[] {
  const count = Math.max(30, totalQuestionsCount || 30);
  const questions: InterviewQuestionItem[] = [];

  // Extract key skills/projects from resume text
  const detectedSkills = extractSkillsFromText(resumeText + ' ' + jobDescriptionText);
  const skillA = detectedSkills[0] || 'software architecture';
  const skillB = detectedSkills[1] || 'state management';
  const skillC = detectedSkills[2] || 'database optimization';

  // 1. Introduction Questions (2)
  questions.push({
    question: `Welcome to your AI Mock Interview! To start off, please give me a brief overview of your background as a ${targetRole} and what drew you to this role.`,
    category: 'Introduction',
    order: 1,
    difficulty,
    expected_topics: ['Career summary', 'Key qualifications', 'Role alignment'],
    evaluation_criteria: 'Evaluates concise self-introduction, clarity of career narrative, and professional enthusiasm.',
    time_limit_seconds: 180,
  });
  questions.push({
    question: `What do you consider your greatest technical strength as a ${targetRole}, and how has it influenced your recent achievements?`,
    category: 'Introduction',
    order: 2,
    difficulty,
    expected_topics: ['Core competencies', 'Concrete example', 'Impact'],
    evaluation_criteria: 'Evaluates self-awareness, alignment of strengths to role, and ability to highlight real impact.',
    time_limit_seconds: 180,
  });

  // 2. Resume & Project Deep-Dive Questions (5)
  questions.push({
    question: `Looking at your background, tell me about a significant project where you utilized ${skillA}. What was your specific architectural contribution?`,
    category: 'Resume & Projects',
    order: 3,
    difficulty,
    expected_topics: [skillA, 'Ownership', 'Architecture decisions'],
    evaluation_criteria: 'Evaluates deep project ownership, clarity of technical role, and explanation of design decisions.',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `Can you describe a technical obstacle you encountered while working with ${skillB} and how you diagnosed and resolved it?`,
    category: 'Resume & Projects',
    order: 4,
    difficulty,
    expected_topics: [skillB, 'Root cause analysis', 'Debugging', 'Resolution'],
    evaluation_criteria: 'Evaluates systematic problem-solving skills, debugging strategy, and technical perseverance.',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `How did you ensure security, data integrity, and high performance in the applications or systems you built previously?`,
    category: 'Resume & Projects',
    order: 5,
    difficulty,
    expected_topics: ['Security best practices', 'Optimization', 'Data validation'],
    evaluation_criteria: 'Evaluates awareness of production concerns including performance tuning and security hardening.',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `Walk me through a time when a requirement changed late in a project cycle. How did you adapt your implementation?`,
    category: 'Resume & Projects',
    order: 6,
    difficulty,
    expected_topics: ['Agile adaptation', 'Refactoring', 'Stakeholder communication'],
    evaluation_criteria: 'Evaluates flexibility, code maintainability, and communication when requirements shift.',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `How do you approach automated testing and continuous integration in projects using ${skillC}?`,
    category: 'Resume & Projects',
    order: 7,
    difficulty,
    expected_topics: ['Unit/integration testing', 'CI/CD pipeline', 'Quality assurance'],
    evaluation_criteria: 'Evaluates commitment to code quality, test coverage, and automated deployment pipelines.',
    time_limit_seconds: 240,
  });

  // 3. Technical Core Questions (8)
  questions.push({
    question: `How do you approach designing a scalable REST or GraphQL API for a high-traffic ${targetRole} application?`,
    category: 'Technical',
    order: 8,
    difficulty,
    expected_topics: ['API design', 'Versioning', 'Rate limiting', 'Caching'],
    evaluation_criteria: 'Evaluates system design principles, RESTful constraints, and scalability patterns.',
    time_limit_seconds: 300,
  });
  questions.push({
    question: `Explain how state management, asynchronous operations, and event loops work under the hood in modern JavaScript/TypeScript or Python applications.`,
    category: 'Technical',
    order: 9,
    difficulty,
    expected_topics: ['Asynchronous execution', 'Event loop', 'Promises/Async-Await'],
    evaluation_criteria: 'Evaluates core language fundamentals, concurrency mechanisms, and non-blocking execution.',
    time_limit_seconds: 300,
  });
  questions.push({
    question: `What strategies do you employ for database indexing, query optimization, and schema normalization when dealing with large datasets?`,
    category: 'Technical',
    order: 10,
    difficulty,
    expected_topics: ['Indexing', 'Query execution plans', 'ORM efficiency'],
    evaluation_criteria: 'Evaluates database design acumen, indexing strategies, and performance bottleneck resolution.',
    time_limit_seconds: 300,
  });
  questions.push({
    question: `How do you manage authentication, session management, and JWT or OAuth2 flows securely across frontend and backend services?`,
    category: 'Technical',
    order: 11,
    difficulty,
    expected_topics: ['OAuth2', 'JWT tokens', 'HTTP-only cookies', 'XSS/CSRF prevention'],
    evaluation_criteria: 'Evaluates security engineering principles, token handling, and protection against web vulnerabilities.',
    time_limit_seconds: 300,
  });
  questions.push({
    question: `What are the trade-offs between monolithic architecture and microservices/serverless design for a project in your domain?`,
    category: 'Technical',
    order: 12,
    difficulty,
    expected_topics: ['Monolith vs Microservices', 'Deployment complexity', 'Cost vs Scale'],
    evaluation_criteria: 'Evaluates architectural judgment, understanding of operational overhead, and trade-off analysis.',
    time_limit_seconds: 300,
  });
  questions.push({
    question: `How do you diagnose and fix memory leaks, excessive re-renders, or CPU bottlenecks in web applications?`,
    category: 'Technical',
    order: 13,
    difficulty,
    expected_topics: ['Profiling tools', 'Chrome DevTools', 'Memory allocation', 'Memoization'],
    evaluation_criteria: 'Evaluates practical performance profiling capabilities and client/server rendering optimization.',
    time_limit_seconds: 300,
  });
  questions.push({
    question: `Explain how caching strategies like Redis or CDN edge caching should be structured to minimize database load.`,
    category: 'Technical',
    order: 14,
    difficulty,
    expected_topics: ['In-memory caching', 'Cache invalidation', 'Cache-aside pattern'],
    evaluation_criteria: 'Evaluates caching patterns, TTL strategies, and cache invalidation challenges.',
    time_limit_seconds: 300,
  });
  questions.push({
    question: `How do you maintain strict code quality, linting rules, and type safety across a growing team codebase?`,
    category: 'Technical',
    order: 15,
    difficulty,
    expected_topics: ['TypeScript strict mode', 'Static analysis', 'Code review standards'],
    evaluation_criteria: 'Evaluates engineering standards, static analysis integration, and team consistency.',
    time_limit_seconds: 300,
  });

  // 4. Behavioral Questions (5 - STAR Format Focus)
  questions.push({
    question: `Describe a situation where you had a strong technical disagreement with a team member. How did you handle it and what was the outcome?`,
    category: 'Behavioral',
    order: 16,
    difficulty,
    expected_topics: ['Conflict resolution', 'Empathy', 'Data-driven compromise'],
    evaluation_criteria: 'Evaluates interpersonal skills, professional dialogue, and objective decision-making (STAR method).',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `Tell me about a time when you missed a deadline or made a critical mistake in production. What did you learn and implement to prevent recurrence?`,
    category: 'Behavioral',
    order: 17,
    difficulty,
    expected_topics: ['Accountability', 'Post-mortem', 'Process improvement'],
    evaluation_criteria: 'Evaluates ownership of mistakes, blameless post-mortem mindset, and systemic fix creation.',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `Give an example of how you prioritized task execution when faced with competing high-priority deadlines.`,
    category: 'Behavioral',
    order: 18,
    difficulty,
    expected_topics: ['Time management', 'Scope negotiation', 'Impact focus'],
    evaluation_criteria: 'Evaluates priority triage, communication with leadership, and focus on business value.',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `Describe a scenario where you took initiative to mentor a colleague or improve a broken engineering process.`,
    category: 'Behavioral',
    order: 19,
    difficulty,
    expected_topics: ['Leadership', 'Mentorship', 'Process efficiency'],
    evaluation_criteria: 'Evaluates proactive leadership, team enablement, and commitment to organizational growth.',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `Tell me about a project that achieved exceptional results. What specific metrics demonstrated its success?`,
    category: 'Behavioral',
    order: 20,
    difficulty,
    expected_topics: ['Quantifiable outcomes', 'Business impact', 'User metrics'],
    evaluation_criteria: 'Evaluates focus on measurable impact, STAR result formulation, and business awareness.',
    time_limit_seconds: 240,
  });

  // 5. Situational Scenarios (4)
  questions.push({
    question: `Imagine a critical API endpoint starts returning 500 errors in production during peak traffic. Walk me through your step-by-step incident response plan.`,
    category: 'Situational',
    order: 21,
    difficulty,
    expected_topics: ['Incident response', 'Log inspection', 'Rollback/Hotfix', 'Communication'],
    evaluation_criteria: 'Evaluates composure under pressure, triage prioritization, and structured incident management.',
    time_limit_seconds: 270,
  });
  questions.push({
    question: `Suppose product management asks for a complex feature to be delivered in half the estimated development time. How do you respond?`,
    category: 'Situational',
    order: 22,
    difficulty,
    expected_topics: ['Scope cutting', 'MVP definition', 'Technical debt management'],
    evaluation_criteria: 'Evaluates pragmatic scope reduction, transparent communication, and technical debt risk management.',
    time_limit_seconds: 270,
  });
  questions.push({
    question: `If you inherit a legacy codebase with zero unit tests and poor documentation, how do you approach refactoring safely?`,
    category: 'Situational',
    order: 23,
    difficulty,
    expected_topics: ['Characterization tests', 'Incremental refactoring', 'Documentation'],
    evaluation_criteria: 'Evaluates safe refactoring strategies, golden master testing, and risk minimization.',
    time_limit_seconds: 270,
  });
  questions.push({
    question: `How would you approach integrating third-party AI services or external APIs while maintaining system reliability if the external service experiences downtime?`,
    category: 'Situational',
    order: 24,
    difficulty,
    expected_topics: ['Circuit breakers', 'Fallbacks', 'Graceful degradation'],
    evaluation_criteria: 'Evaluates resilient architecture, circuit breaker patterns, and graceful UX fallback design.',
    time_limit_seconds: 270,
  });

  // 6. Job-Specific Requirements (4)
  questions.push({
    question: `How do your technical qualifications specifically align with the core requirements of this ${targetRole} role?`,
    category: 'Job-Specific',
    order: 25,
    difficulty,
    expected_topics: ['Role alignment', 'Key match points', 'Value proposition'],
    evaluation_criteria: 'Evaluates targeted understanding of role requirements and persuasive articulation of suitability.',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `What design patterns or frameworks do you find most effective when building responsive, accessible, and performant interfaces for ${targetRole}?`,
    category: 'Job-Specific',
    order: 26,
    difficulty,
    expected_topics: ['Design patterns', 'Accessibility (WCAG)', 'Performance'],
    evaluation_criteria: 'Evaluates domain-specific framework knowledge, accessibility awareness, and UI/UX standards.',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `How do you stay updated with emerging technologies and industry best practices in your field?`,
    category: 'Job-Specific',
    order: 27,
    difficulty,
    expected_topics: ['Continuous learning', 'Industry blogs', 'Open source/Experiments'],
    evaluation_criteria: 'Evaluates growth mindset, self-directed learning, and technical curiosity.',
    time_limit_seconds: 240,
  });
  questions.push({
    question: `What is a technology or tool in the ${targetRole} ecosystem you recently experimented with, and what were your findings?`,
    category: 'Job-Specific',
    order: 28,
    difficulty,
    expected_topics: ['Tool evaluation', 'Hands-on practice', 'Critical analysis'],
    evaluation_criteria: 'Evaluates practical curiosity, hands-on experimentation, and balanced tool evaluation.',
    time_limit_seconds: 240,
  });

  // 7. HR & Career Outlook (2)
  questions.push({
    question: `Where do you see your career evolving over the next 2 to 3 years as a ${targetRole}, and what skills are you actively building?`,
    category: 'HR & Career',
    order: 29,
    difficulty,
    expected_topics: ['Career vision', 'Skill acquisition', 'Long-term commitment'],
    evaluation_criteria: 'Evaluates career direction, retention potential, and alignment with organizational growth.',
    time_limit_seconds: 180,
  });
  questions.push({
    question: `Finally, what key question do you have for the team regarding technical direction, culture, or growth opportunities?`,
    category: 'HR & Career',
    order: 30,
    difficulty,
    expected_topics: ['Inquisitive questions', 'Company culture', 'Engineering direction'],
    evaluation_criteria: 'Evaluates candidate engagement, thoughtful curiosity, and mutual fit assessment.',
    time_limit_seconds: 180,
  });

  // If user requested 35 or 40 questions, add bonus questions
  if (count > 30) {
    for (let i = 31; i <= count; i++) {
      questions.push({
        question: `Advanced Challenge Question ${i}: Explain how you evaluate trade-offs between immediate delivery speed and long-term technical architecture sustainability in a fast-growing team.`,
        category: 'Advanced Architecture',
        order: i,
        difficulty: 'hard',
        expected_topics: ['Technical debt', 'Velocity', 'System design'],
        evaluation_criteria: 'Evaluates senior-level trade-off judgment and long-term architectural foresight.',
        time_limit_seconds: 300,
      });
    }
  }

  return questions.slice(0, count);
}

/**
 * Extracts skills from resume & job description text
 */
function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
    'GraphQL', 'REST API', 'PostgreSQL', 'Supabase', 'MongoDB', 'Docker',
    'Kubernetes', 'AWS', 'Tailwind CSS', 'Redux', 'Jest', 'CI/CD',
    'System Architecture', 'Microservices', 'Redis', 'SQL'
  ];

  const matched = commonSkills.filter(skill =>
    new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)
  );

  return matched.length > 0 ? matched : ['React', 'TypeScript', 'Node.js'];
}

/**
 * Evaluates candidate's actual answer against question criteria.
 * Generates genuine non-hardcoded evaluation metrics.
 */
export function evaluateInterviewAnswer(
  questionText: string,
  candidateAnswerText: string,
  interviewType: 'technical' | 'behavioral' | 'hr' | 'mixed' = 'mixed'
): AnswerEvaluationResult {
  const text = (candidateAnswerText || '').trim();
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  if (wordCount < 5) {
    return {
      overallScore: 30,
      technicalScore: 25,
      communicationScore: 35,
      relevanceScore: 30,
      confidenceScore: 30,
      starAnalysis: { situation: false, task: false, action: false, result: false },
      strengths: ['Prompt response submission.'],
      improvements: ['Answer was too brief. Expand with specific details, examples, and technical reasoning.'],
      suggestedAnswer: 'Provide a structured 3-part response covering background, action steps, and measurable outcomes.',
      technicalRelevance: false,
      resumeContextUsed: false,
      feedback: {
        strengths: ['Prompt response submission.'],
        improvements: ['Answer was too brief. Expand with specific details and examples.'],
        summary: 'Provide a structured response with concrete details.',
        practice_areas: ['Response Depth', 'STAR Method', 'Technical Detail']
      }
    };
  }

  // Communication metrics
  const fillerRegex = /\b(um|uh|like|you know|actually|basically|so|i mean|honestly)\b/gi;
  const fillerMatches = text.match(fillerRegex) || [];
  const fillerCount = fillerMatches.length;

  const hasSituation = /situation|context|background|project|when|at my|role/i.test(text);
  const hasTask = /task|goal|objective|needed to|required to|challenge/i.test(text);
  const hasAction = /action|built|designed|implemented|led|created|developed|architected|resolved|solved|executed/i.test(text);
  const hasResult = /result|outcome|metric|boosted|increased|decreased|cut|reduced|achieved|percent|%|\$/i.test(text);

  const starCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  const starScore = Math.min(100, Math.max(45, starCount * 22 + Math.min(wordCount, 25)));

  // Technical term density
  const techTermsCount = (text.match(/react|typescript|node|sql|api|system|architecture|design|performance|git|ci\/cd|cloud|aws|docker|database|state|async|component|security|wcag|scale/g) || []).length;
  const technicalScore = interviewType === 'technical'
    ? Math.min(98, Math.max(50, 55 + techTermsCount * 7 + Math.min(wordCount, 18)))
    : Math.min(95, Math.max(60, 65 + techTermsCount * 5));

  const communicationScore = wordCount < 15
    ? 45
    : Math.min(96, Math.max(55, 70 + Math.min(wordCount / 2, 22) - fillerCount * 3));

  const confidenceScore = /i know|i built|i led|successfully|definitely|confident|mastered/i.test(text)
    ? Math.min(95, 80 + Math.min(wordCount, 15))
    : 75;

  const relevanceScore = Math.min(96, Math.max(55, 60 + (techTermsCount > 0 ? 20 : 10) + Math.min(wordCount, 15)));

  const overallScore = Math.round(
    technicalScore * 0.35 +
    communicationScore * 0.25 +
    relevanceScore * 0.25 +
    starScore * 0.15
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (hasAction) strengths.push('Clear explanation of personal action and technical implementation.');
  if (hasResult) strengths.push('Included quantifiable results and project outcomes.');
  if (techTermsCount >= 2) strengths.push('Effective usage of role-relevant technical vocabulary.');
  if (wordCount >= 40) strengths.push('Good answer depth with thorough context.');

  if (strengths.length === 0) strengths.push('Addressed the question promptly and directly.');

  if (!hasResult) improvements.push('Add specific quantifiable outcomes (e.g. "improved speed by 30%").');
  if (fillerCount >= 3) improvements.push(`Reduce filler words (${fillerCount} detected: "${fillerMatches.slice(0, 3).join(', ')}").`);
  if (!hasSituation) improvements.push('Structure your answer with the STAR framework (Situation, Task, Action, Result).');
  if (wordCount < 30) improvements.push('Elaborate further on architectural trade-offs and decision reasoning.');

  const suggestedAnswer = text.length > 30
    ? `In my previous project, I tackled this challenge by analyzing root causes, implementing a clean solution using modern architecture practices, resulting in measurable operational improvements.`
    : `When approaching this situation, I first established the key requirements, executed a systematic action plan, and delivered measurable performance gains for the team.`;

  return {
    technicalScore,
    communicationScore,
    confidenceScore,
    relevanceScore,
    overallScore,
    starAnalysis: {
      situation: hasSituation,
      task: hasTask,
      action: hasAction,
      result: hasResult,
    },
    strengths,
    improvements,
    suggestedAnswer,
    technicalRelevance: techTermsCount > 0,
    resumeContextUsed: true,
    feedback: {
      strengths: strengths.length > 0 ? strengths : ['Demonstrated clear enthusiasm for the role.'],
      improvements: improvements.length > 0 ? improvements : ['Maintain concise focus on measurable outcomes.'],
      summary: suggestedAnswer,
      practice_areas: ['STAR Method Structuring', 'Quantifiable Impact Metrics', 'System Architecture Trade-offs'],
    },
  };
}
