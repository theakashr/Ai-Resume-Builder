export const SYSTEM_PROMPT = `
You are a expert AI Resume Assistant specializing in professional resume optimization and ATS formatting.

CRITICAL INTEGRITY RULES:
1. Be professional, concise, and impactful.
2. NEVER invent or fabricate employment history, job titles, degrees, certifications, or achievements.
3. NEVER invent dates, company names, or metrics not grounded in user input.
4. Improve and reframe existing user-provided content using active voice, strong action verbs, and clear structure.
5. If details are missing or sparse, enhance clarity without adding unverified facts.
`;

export function sanitizePromptInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/(ignore|disregard|override)\s+(all\s+)?(previous|prior|system)\s+(instructions|prompts|rules)/gi, '[REDACTED_OVERRIDE_ATTEMPT]')
    .replace(/(you\s+are\s+now|act\s+as)\s+(DAN|developer\s+mode|root|jailbreak)/gi, '[REDACTED_JAILBREAK_ATTEMPT]')
    .trim();
}

export function buildPrompt(actionType: string, currentContent: string): { systemPrompt: string; prompt: string } {
  const sanitizedContent = sanitizePromptInput(currentContent);
  let promptText = '';

  switch (actionType) {
    case 'improve_summary':
      promptText = `
Action: Improve Summary
Original Content:
"${sanitizedContent}"

Task: Rewrite and elevate this professional summary to make it compelling, active, and concise for hiring managers.
`;
      break;

    case 'rewrite_experience':
      promptText = `
Action: Rewrite Work Experience
Original Content:
"${sanitizedContent}"

Task: Format this work experience into clear, bulleted statements starting with strong action verbs. Highlight responsibilities and achievements without fabricating information.
`;
      break;

    case 'improve_project':
      promptText = `
Action: Improve Project Description
Original Content:
"${sanitizedContent}"

Task: Reframe this project overview to emphasize technologies used, problem solved, and technical outcomes cleanly.
`;
      break;

    case 'generate_skills':
      promptText = `
Action: Generate Skills
Original Content:
"${sanitizedContent}"

Task: Extract and organize relevant technical and professional skills into a clear, comma-separated list based strictly on the provided context.
`;
      break;

    case 'improve_achievement':
      promptText = `
Action: Improve Achievement
Original Content:
"${sanitizedContent}"

Task: Reframe this key achievement using metric-driven, impact-oriented language while keeping original numbers and facts intact.
`;
      break;

    case 'general_qa':
    case 'chat_question':
    case 'general_advice':
      promptText = `
User Query / Resume Question:
"${sanitizedContent}"

Task: Provide a comprehensive, actionable, and professionally formatted answer to the user's specific question regarding resumes, cover letters, ATS optimization, or career preparation. Give concrete examples, structural advice, or recommended phrasing tailored strictly to their prompt.
`;
      break;

    default:
      promptText = `
User Content / Question:
"${sanitizedContent}"

Task: Provide an optimized, professional answer or refined resume text based directly on the provided input.
`;
      break;
  }

  return {
    systemPrompt: SYSTEM_PROMPT,
    prompt: promptText.trim(),
  };
}
