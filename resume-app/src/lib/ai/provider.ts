export interface AIGenerateOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  generateText(prompt: string, options?: AIGenerateOptions): Promise<string>;
}

/**
 * Gemini AI Provider — uses the Google Gemini REST API.
 * No extra npm dependency required; relies on global fetch (Node 18+).
 */
export class GeminiAIProvider implements AIProvider {
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? process.env.GEMINI_API_KEY ?? '';
  }

  async generateText(prompt: string, options: AIGenerateOptions = {}): Promise<string> {
    const { temperature = 0.3, maxTokens = 800 } = options;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature,
              maxOutputTokens: maxTokens,
            },
          }),
        }
      );

      if (!res.ok) {
        const errBody = await res.text();
        console.error(`[GeminiAIProvider] Error ${res.status}: ${errBody}`);
        throw new Error("AI Assistant is temporarily unavailable. Please try again.");
      }

      const data: any = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("AI Assistant is temporarily unavailable. Please try again.");
      }
      return text.trim();
    } catch (err: any) {
      console.error("[GeminiAIProvider]", err.message);
      throw new Error("AI Assistant is temporarily unavailable. Please try again.");
    }
  }
}

/**
 * Mock provider for development and testing only.
 * Generates dynamic, contextual responses based on user query context.
 */
export class MockAIProvider implements AIProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generateText(prompt: string, _options?: AIGenerateOptions): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 50));

    const lower = prompt.toLowerCase();

    const contentMatch = prompt.match(/(?:Original Content|User Query \/ Resume Question|User Content \/ Question):\s*"([\s\S]*?)"/i);
    const userQuery = contentMatch ? contentMatch[1].trim() : prompt.trim();

    if (lower.includes('cover letter')) {
      return `✉️ **AI Cover Letter Strategy & Template**:

Regarding your request: "${userQuery}"

**Recommended Structure**:
1. **Opening Hook**: State the target position and your top achievement (e.g., "Enthusiastic Senior Developer with 5+ years building high-availability React/Next.js systems...").
2. **Core Alignment**: Highlight 2 key projects matching the employer's requirements.
3. **Closing Call-to-Action**: Express enthusiasm for an interview to discuss technical contributions.`;
    }

    if (lower.includes('education') || lower.includes('degree') || lower.includes('gpa') || lower.includes('university')) {
      return `🎓 **Education Section Optimization**:

Here is how to structure your Education section for maximum recruiter impact:
• **Degree & Institution**: List degree title, university name, and graduation year (e.g. B.S. in Computer Science — Stanford University, 2024).
• **Relevant Coursework**: Include high-level courses (Data Structures, Distributed Systems, Software Architecture).
• **Honors & Achievements**: Mention GPA only if 3.5+ or top-tier honors (Dean's List, Cum Laude).`;
    }

    if (lower.includes('certif') || lower.includes('license') || lower.includes('aws') || lower.includes('certification')) {
      return `📜 **Certifications & Accreditations**:

To display certifications effectively for ATS scanners:
• Format as: **[Certification Name]** — *[Issuing Organization]* (Issue Date: YYYY).
• Examples: AWS Certified Solutions Architect, Scrum Alliance CSM, Professional Engineer (PE).
• Place high-priority industry credentials near the top of your resume or in a dedicated Certifications section.`;
    }

    if (lower.includes('salary') || lower.includes('negotiat') || lower.includes('compensation') || lower.includes('offer')) {
      return `💰 **Salary Negotiation & Value Positioning**:

Advice for "${userQuery}":
1. **Benchmark Market Rates**: Research median compensation for your role, experience tier, and geographic region.
2. **Anchor on Quantified Results**: Highlight your measurable impact (+30% velocity, $500k revenue generated) during salary discussions.
3. **Total Rewards Evaluation**: Factor equity, performance bonuses, remote flexibility, and healthcare options into your evaluation.`;
    }

    if (lower.includes('format') || lower.includes('layout') || lower.includes('page') || lower.includes('font') || lower.includes('template')) {
      return `📐 **ATS Resume Formatting Guidelines**:

• **Length**: 1 page for 0-7 years experience; 2 pages for 8+ years or executive positions.
• **Typography**: Use standard ATS-readable fonts (Helvetica, Arial, Inter, Calibri) at 10-11pt body text, 14-16pt section headers.
• **Margins**: 0.5 to 0.75 inch margins on all sides.
• **File Type**: Export as clean, standard PDF or Word DOCX.`;
    }

    if (lower.includes('career change') || lower.includes('transition') || lower.includes('pivot') || lower.includes('switch')) {
      return `🔄 **Career Transition & Transferable Skills Strategy**:

For transitioning into a new role:
1. **Highlight Transferable Competencies**: Group technical abilities, project management, and cross-functional leadership at the top.
2. **Functional or Hybrid Format**: Position your relevant skills and target-role projects before older work history.
3. **Reframe Job Titles**: Use industry-standard terms in your summary to signal readiness for the target domain.`;
    }

    if (lower.includes('ats') || lower.includes('keyword')) {
      return `🔍 **ATS Keyword Gap Analysis & Optimization**:

Based on your prompt "${userQuery}", here are key missing ATS keywords to incorporate:
• **Technical Skills**: GraphQL, Microservices, TypeScript, PostgreSQL, Docker, CI/CD
• **Core Competencies**: Agile/Scrum, System Architecture, Code Review, Performance Optimization
• **Recommendation**: Add these high-frequency keywords directly under your Skills and Experience bullet points to boost your ATS match score above 85%.`;
    }

    if (lower.includes('interview') || lower.includes('question') || lower.includes('behavioral')) {
      return `🎙️ **Custom Behavioral Interview Questions**:

1. **Problem-Solving & System Design**:
   *Can you walk me through a complex technical problem you solved recently? What trade-offs did you evaluate?*
   • *Key Focus*: Highlight architecture choices, technical constraints, and quantifiable results.

2. **Adaptability & High Pressure**:
   *Describe a situation where project requirements changed rapidly. How did you adapt your implementation plan?*
   • *Key Focus*: Demonstrate flexibility and clear stakeholder communication.

3. **Technical Leadership**:
   *How do you ensure code quality and maintainability across team members when scaling a codebase?*
   • *Key Focus*: Mention automated testing, CI/CD, and code review standards.`;
    }

    if (lower.includes('bullet') || lower.includes('rewrite') || lower.includes('experience')) {
      return `✨ **Optimized Experience Bullet Points**:

• Engineered high-throughput REST API microservices serving 500,000+ monthly active users with 99.99% uptime.
• Reduced database query latency by 45% through indexing optimizations and caching strategies.
• Automated CI/CD deployment pipelines, cutting release cycle times from 3 days to under 30 minutes.`;
    }

    if (lower.includes('project')) {
      return `🚀 **Enhanced Project Overview**:

Architected and deployed a scalable full-stack web application featuring real-time state synchronization, automated input validation with Zod, and secure data isolation powered by PostgreSQL and Next.js.`;
    }

    if (lower.includes('skill')) {
      return `🛠️ **Recommended Skill Categorization**:

• **Languages & Runtimes**: TypeScript, JavaScript (ES6+), Node.js, HTML5/CSS3
• **Frameworks & Libraries**: Next.js, React, TailwindCSS, Express.js
• **Database & Cloud**: PostgreSQL, REST APIs, GraphQL, Docker, Vercel
• **Practices**: System Design, Unit Testing, CI/CD, Agile/Scrum, Security Best Practices`;
    }

    if (lower.includes('achievement') || lower.includes('metric')) {
      return `🏆 **Quantified Achievement**:

Spearheaded core backend performance refactoring that reduced API response latency by 40% and lowered cloud infrastructure costs by $15,000 annually without downtime.`;
    }

    return `💡 **AI Career Assistant Guidance**:

I evaluated your request regarding: "${userQuery}"

Here are actionable recommendations to optimize your career materials:
1. **Quantify Impact**: Always attach specific metrics (e.g. "+30% user engagement" or "reduced build times by 5m").
2. **Match Industry Keywords**: Align terminology directly with target job postings for ATS parsers.
3. **Keep Concise**: Use active verbs at the start of each experience bullet point.`;
  }
}

/**
 * Returns the real Gemini provider when GEMINI_API_KEY is configured.
 * In production mode without an API key, throws a user-facing unavailable error.
 */
export function getAIProvider(): AIProvider {
  if (process.env.GEMINI_API_KEY) {
    return new GeminiAIProvider(process.env.GEMINI_API_KEY);
  }

  if (process.env.NODE_ENV === 'test') {
    return new MockAIProvider();
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('AI Assistant is temporarily unavailable. Please try again.');
  }

  return new MockAIProvider();
}
