export const INTERVIEW_PRACTICE_DISCLAIMER =
  "Interview scores and feedback are intended solely as AI-assisted practice metrics for career preparation. They do not represent an objective measurement of candidates' true personality, intelligence, or hiring eligibility.";

export interface InterviewQuestionItem {
  question: string;
  category: string;
  order: number;
}

export interface AnswerEvaluationResult {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  relevanceScore: number;
  starAnalysis: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
  technicalRelevance: boolean;
  resumeContextUsed: boolean;
}

export function generateInterviewQuestions(
  targetRole: string,
  interviewType: 'technical' | 'behavioral' | 'hr',
  difficulty: 'easy' | 'medium' | 'hard'
): InterviewQuestionItem[] {
  const questions: InterviewQuestionItem[] = [];

  if (interviewType === 'technical') {
    questions.push({
      question: `Can you explain the architectural principles you apply when designing a scalable RESTful API or microservice for ${targetRole}?`,
      category: 'System Design',
      order: 1,
    });
    questions.push({
      question: `How do you handle asynchronous error handling, concurrency, and race conditions in modern TypeScript/JavaScript backend applications?`,
      category: 'Technical Core',
      order: 2,
    });
    questions.push({
      question: `Describe a challenging database performance issue or query bottleneck you diagnosed. What indexing or optimization strategy did you implement?`,
      category: 'Database & Performance',
      order: 3,
    });
  } else if (interviewType === 'behavioral') {
    questions.push({
      question: `Tell me about a time when you faced a major technical disagreement with a teammate or stakeholder while working as a ${targetRole}. How did you resolve it?`,
      category: 'Conflict Resolution',
      order: 1,
    });
    questions.push({
      question: `Describe a high-pressure situation where a production outage or critical bug occurred. How did you prioritize tasks and communicate with stakeholders?`,
      category: 'Incident Response',
      order: 2,
    });
    questions.push({
      question: `Give an example of a complex technical project where requirements were ambiguous. How did you break down tasks and drive delivery?`,
      category: 'Ownership & Initiative',
      order: 3,
    });
  } else {
    // HR Interview
    questions.push({
      question: `What attracted you to apply for a ${targetRole} role, and how does this fit into your long-term career aspirations?`,
      category: 'Career Alignment',
      order: 1,
    });
    questions.push({
      question: `What environment or team culture enables you to perform at your absolute best as an engineer?`,
      category: 'Culture Fit',
      order: 2,
    });
    questions.push({
      question: `How do you keep your technical skills current with rapidly evolving web technologies and industry standards?`,
      category: 'Continuous Learning',
      order: 3,
    });
  }

  return questions;
}

export interface AnswerEvaluationInput {
  question: string;
  answer: string;
  role: string;
  type: 'technical' | 'behavioral' | 'hr';
  difficulty: 'easy' | 'medium' | 'hard';
  resumeContextUsed?: boolean;
}