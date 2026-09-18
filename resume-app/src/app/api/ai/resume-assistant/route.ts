import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { createdResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseRequestBody } from '@/lib/validations';
import { resumeAssistantSchema } from '@/lib/validations/ai';
import { verifyResumeOwnership, verifyResumeSectionOwnership } from '@/lib/security/resource-ownership';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { buildPrompt } from '@/lib/ai/prompts';
import { getAIProvider } from '@/lib/ai/provider';

/**
 * POST /api/ai/resume-assistant
 * Generates an AI recommendation/suggestion for resume text sections.
 * Server-only execution; AI credentials are never exposed to the frontend.
 */
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireUser();

    // Enforce sliding window rate limit per user
    checkRateLimit(user.id);

    const body = await parseRequestBody(request, resumeAssistantSchema);

    let targetResumeId = body.resume_id;

    if (targetResumeId) {
      // Verify ownership of the specified resume
      await verifyResumeOwnership(targetResumeId, user.id);
    } else {
      // Look up user's active resume or initialize a default resume if none exists
      const { data: userResumes } = await (supabase as any)
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (userResumes && userResumes.length > 0) {
        targetResumeId = userResumes[0].id;
      } else {
        const { data: newResume, error: createErr } = await (supabase as any)
          .from('resumes')
          .insert({
            user_id: user.id,
            title: 'My Primary Resume',
            status: 'draft',
          })
          .select('id')
          .single();

        if (createErr || !newResume) {
          throw ApiError.internal('Failed to initialize active workspace resume for AI assistant');
        }
        targetResumeId = newResume.id;
      }
    }

    if (!targetResumeId) {
      throw ApiError.internal('Failed to locate active resume ID');
    }

    // Verify ownership of section if section ID is provided
    if (body.resume_section_id) {
      await verifyResumeSectionOwnership(body.resume_section_id, targetResumeId, user.id);
    }

    // Build prompt and system instructions
    const { systemPrompt, prompt } = buildPrompt(body.action_type, body.current_content);

    let generatedText = '';
    try {
      const provider = getAIProvider();
      generatedText = await provider.generateText(prompt, { systemPrompt });
    } catch (aiErr: any) {
      throw ApiError.internal('AI service temporarily unavailable. Please try again.');
    }

    if (!generatedText || generatedText.trim().length === 0) {
      throw ApiError.internal('AI service returned an empty response.');
    }

    // Persist suggestion to database with 'generated' status
    const { data: suggestion, error } = await (supabase as any)
      .from('ai_resume_suggestions')
      .insert({
        user_id: user.id,
        resume_id: targetResumeId,
        resume_section_id: body.resume_section_id || null,
        action_type: body.action_type,
        original_content: body.current_content,
        suggested_content: generatedText,
        status: 'generated',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return createdResponse(suggestion);
  } catch (error) {
    return handleApiError(error);
  }
}
