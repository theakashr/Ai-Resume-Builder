import { ApiError } from '@/lib/errors/api-error';
import { createClient } from '@/lib/supabase/server';

export async function verifyResumeOwnership(resumeId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('resumes')
    .select('id, user_id')
    .eq('id', resumeId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    throw ApiError.notFound('Resume not found');
  }

  return true;
}

export async function verifyJobDescriptionOwnership(jobId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_descriptions')
    .select('id, user_id')
    .eq('id', jobId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    throw ApiError.notFound('Job description not found');
  }

  return true;
}

export async function verifyResumeSectionOwnership(
  sectionId: string,
  resumeId: string,
  userId: string
): Promise<boolean> {
  await verifyResumeOwnership(resumeId, userId);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('resume_sections')
    .select('id, resume_id')
    .eq('id', sectionId)
    .eq('resume_id', resumeId)
    .maybeSingle();

  if (error || !data) {
    throw ApiError.notFound('Resume section not found');
  }

  return true;
}

export async function verifyResumeVersionOwnership(
  versionId: string,
  resumeId: string,
  userId: string
): Promise<boolean> {
  await verifyResumeOwnership(resumeId, userId);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('resume_versions')
    .select('id, resume_id')
    .eq('id', versionId)
    .eq('resume_id', resumeId)
    .maybeSingle();

  if (error || !data) {
    throw ApiError.notFound('Resume version not found');
  }

  return true;
}

export async function verifyMockInterviewOwnership(interviewId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mock_interviews')
    .select('id, user_id')
    .eq('id', interviewId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    throw ApiError.notFound('Mock interview session not found');
  }

  return true;
}

export async function verifySuggestionOwnership(suggestionId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('ai_resume_suggestions')
    .select('id, user_id')
    .eq('id', suggestionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    throw ApiError.notFound('AI suggestion not found');
  }

  return true;
}

export async function verifyAnalysisOwnership(analysisId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('ats_analyses')
    .select('id, user_id')
    .eq('id', analysisId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    throw ApiError.notFound('ATS analysis not found');
  }

  return true;
}
