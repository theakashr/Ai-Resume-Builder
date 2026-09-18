import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { requireUser } from '@/lib/auth/get-session';
import { uuidSchema } from '@/lib/validations';
import { verifyResumeOwnership } from '@/lib/security/resource-ownership';
import { generateResumePDFBuffer } from '@/lib/export/pdf-generator';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/resumes/[id]/export
 * Exports an owned resume into formatted PDF file buffer.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify tenant ownership
    await verifyResumeOwnership(id, user.id);

    const { data: resume, error: resumeErr } = await (supabase as any)
      .from('resumes')
      .select('*, resume_templates(name)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (resumeErr || !resume) {
      throw ApiError.notFound('Resume not found');
    }

    const { data: sections } = await (supabase as any)
      .from('resume_sections')
      .select('*')
      .eq('resume_id', id)
      .order('section_order', { ascending: true });

    let bodyData: any = null;
    try {
      bodyData = await request.json();
    } catch {}

    const resumeTitle = bodyData?.personalInfo?.fullName || resume?.title || 'Resume';

    const pdfBuffer = generateResumePDFBuffer(
      bodyData || { title: resume?.title, ...resume },
      bodyData?.templateStyle || resume?.templateStyle || 'modern'
    );

    const safeFilename = `${resumeTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
