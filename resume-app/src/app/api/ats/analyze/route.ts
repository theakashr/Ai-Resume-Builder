import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { createdResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseRequestBody } from '@/lib/validations';
import { analyzeRequestSchema } from '@/lib/validations/ats';
import { verifyResumeOwnership, verifyJobDescriptionOwnership } from '@/lib/security/resource-ownership';
import { runATSAnalysis, ATS_DISCLAIMER } from '@/lib/ats/analyzer';

/**
 * POST /api/ats/analyze
 * Evaluates a resume against a target job description, generating ATS match scores, keywords, and recommendations.
 */
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireUser();
    const body = await parseRequestBody(request, analyzeRequestSchema);

    // Verify tenant ownership of both resume and job description
    await verifyResumeOwnership(body.resume_id, user.id);
    await verifyJobDescriptionOwnership(body.job_description_id, user.id);

    // Retrieve resume details and sections
    const { data: resumeRecord, error: resumeErr } = await (supabase as any)
      .from('resumes')
      .select('title')
      .eq('id', body.resume_id)
      .eq('user_id', user.id)
      .single();

    if (resumeErr || !resumeRecord) {
      throw ApiError.notFound('Resume not found');
    }

    const { data: sectionsRecords } = await (supabase as any)
      .from('resume_sections')
      .select('section_type, content')
      .eq('resume_id', body.resume_id);

    // Retrieve target job description
    const { data: jdRecord, error: jdErr } = await (supabase as any)
      .from('job_descriptions')
      .select('title, company, description')
      .eq('id', body.job_description_id)
      .eq('user_id', user.id)
      .single();

    if (jdErr || !jdRecord) {
      throw ApiError.notFound('Job description not found');
    }

    // Execute ATS Analysis engine
    const analysisResult = runATSAnalysis(
      { title: resumeRecord.title, sections: sectionsRecords || [] },
      { title: jdRecord.title, company: jdRecord.company, description: jdRecord.description }
    );

    // Persist analysis record
    const { data: analysisRecord, error: insertErr } = await (supabase as any)
      .from('ats_analyses')
      .insert({
        user_id: user.id,
        resume_id: body.resume_id,
        job_description_id: body.job_description_id,
        overall_score: analysisResult.scores.overall_score,
        keyword_score: analysisResult.scores.keyword_score,
        skills_score: analysisResult.scores.skills_score,
        experience_score: analysisResult.scores.experience_score,
        formatting_score: analysisResult.scores.formatting_score,
      })
      .select()
      .single();

    if (insertErr || !analysisRecord) {
      throw insertErr || ApiError.internal('Failed to save ATS analysis report');
    }

    // Insert keywords
    const keywordInserts = analysisResult.keywords.map((k) => ({
      analysis_id: analysisRecord.id,
      keyword: k.keyword,
      keyword_type: k.keyword_type,
      importance: k.importance,
      is_matched: k.is_matched,
    }));

    if (keywordInserts.length > 0) {
      await (supabase as any).from('ats_keywords').insert(keywordInserts);
    }

    // Insert recommendations
    const recInserts = analysisResult.recommendations.map((r) => ({
      analysis_id: analysisRecord.id,
      category: r.category,
      title: r.title,
      description: r.description,
      priority: r.priority,
      is_resolved: false,
    }));

    if (recInserts.length > 0) {
      await (supabase as any).from('ai_recommendations').insert(recInserts);
    }

    // Update resume ats_score to latest evaluation result
    await (supabase as any)
      .from('resumes')
      .update({ ats_score: analysisResult.scores.overall_score })
      .eq('id', body.resume_id)
      .eq('user_id', user.id);

    return createdResponse({
      analysis: analysisRecord,
      keywords: keywordInserts,
      recommendations: recInserts,
      disclaimer: ATS_DISCLAIMER,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
