export const ATS_DISCLAIMER =
  'Scores and recommendations are AI-driven optimization indicators to enhance resume visibility and ATS readability. They do not guarantee interview placement or exact parsing by third-party proprietary ATS software.';

export interface ResumeSectionData {
  section_type: string;
  content: any;
}

export interface ATSAnalysisResult {
  scores: {
    overall_score: number;
    keyword_score: number;
    skills_score: number;
    experience_score: number;
    formatting_score: number;
  };
  keywords: Array<{
    keyword: string;
    keyword_type: 'matched' | 'missing' | 'recommended';
    importance: 'low' | 'medium' | 'high';
    is_matched: boolean;
  }>;
  recommendations: Array<{
    category: 'keywords' | 'skills' | 'experience' | 'formatting' | 'summary';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  disclaimer: string;
}

export function runATSAnalysis(
  resume: { title: string; sections: ResumeSectionData[] },
  jobDescription: { title: string; company: string; description: string }
): ATSAnalysisResult {
  // Combine all text content from resume
  const resumeText = (
    resume.title +
    ' ' +
    resume.sections
      .map((s) => JSON.stringify(s.content || ''))
      .join(' ')
  ).toLowerCase();

  const jdText = (
    jobDescription.title +
    ' ' +
    jobDescription.company +
    ' ' +
    jobDescription.description
  ).toLowerCase();

  // Extract core keywords from job description
  const candidateKeywords = [
    { word: 'typescript', importance: 'high' as const },
    { word: 'node.js', importance: 'high' as const },
    { word: 'react', importance: 'medium' as const },
    { word: 'next.js', importance: 'medium' as const },
    { word: 'postgresql', importance: 'high' as const },
    { word: 'rest api', importance: 'high' as const },
    { word: 'aws', importance: 'medium' as const },
    { word: 'docker', importance: 'medium' as const },
    { word: 'microservices', importance: 'medium' as const },
    { word: 'ci/cd', importance: 'low' as const },
    { word: 'git', importance: 'low' as const },
    { word: 'agile', importance: 'low' as const },
  ];

  // Filter candidate keywords present in the JD
  const targetKeywords = candidateKeywords.filter((k) => jdText.includes(k.word));
  const activeKeywords = targetKeywords.length > 0 ? targetKeywords : candidateKeywords.slice(0, 5);

  const keywords: ATSAnalysisResult['keywords'] = [];
  let matchedCount = 0;

  for (const item of activeKeywords) {
    const isMatched = resumeText.includes(item.word);
    if (isMatched) {
      matchedCount++;
      keywords.push({
        keyword: item.word,
        keyword_type: 'matched',
        importance: item.importance,
        is_matched: true,
      });
    } else {
      keywords.push({
        keyword: item.word,
        keyword_type: 'missing',
        importance: item.importance,
        is_matched: false,
      });
    }
  }

  // Add recommended keywords
  keywords.push({
    keyword: 'system architecture',
    keyword_type: 'recommended',
    importance: 'medium',
    is_matched: resumeText.includes('system architecture'),
  });

  // Calculate scores
  const keywordScore = Math.min(
    100,
    Math.max(40, Math.round((matchedCount / (activeKeywords.length || 1)) * 100))
  );

  const hasSkillsSection = resume.sections.some((s) => s.section_type.includes('skill'));
  const skillsScore = hasSkillsSection ? Math.min(100, keywordScore + 10) : 55;

  const hasExperienceSection = resume.sections.some((s) => s.section_type.includes('experience') || s.section_type.includes('work'));
  const experienceScore = hasExperienceSection ? 85 : 50;

  const hasSummarySection = resume.sections.some((s) => s.section_type.includes('summary'));
  const formattingScore = hasSkillsSection && hasExperienceSection && hasSummarySection ? 95 : 75;

  const overallScore = Math.round(
    keywordScore * 0.35 + skillsScore * 0.25 + experienceScore * 0.25 + formattingScore * 0.15
  );

  // Generate recommendations based on scores
  const recommendations: ATSAnalysisResult['recommendations'] = [];

  const missingHighImportance = keywords.filter((k) => !k.is_matched && k.importance === 'high');
  if (missingHighImportance.length > 0) {
    recommendations.push({
      category: 'keywords',
      title: 'Incorporate Missing High-Priority Keywords',
      description: `Include core technical keywords such as ${missingHighImportance.map((k) => `"${k.keyword}"`).join(', ')} in your experience bullet points to improve ATS keyword parsing.`,
      priority: 'high',
    });
  }

  if (!hasSummarySection) {
    recommendations.push({
      category: 'summary',
      title: 'Add a Professional Summary Section',
      description: 'Include a concise 3-4 sentence professional summary highlighting key technical expertise aligned with the job role.',
      priority: 'medium',
    });
  }

  recommendations.push({
    category: 'experience',
    title: 'Quantify Achievement Impact',
    description: 'Enhance work experience bullet points with quantitative metrics (e.g. percentages, latency reductions, user counts) to demonstrate measurable results.',
    priority: 'high',
  });

  return {
    scores: {
      overall_score: overallScore,
      keyword_score: keywordScore,
      skills_score: skillsScore,
      experience_score: experienceScore,
      formatting_score: formattingScore,
    },
    keywords,
    recommendations,
    disclaimer: ATS_DISCLAIMER,
  };
}
