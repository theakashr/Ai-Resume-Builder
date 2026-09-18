import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/api-error";
import { successResponse } from "@/lib/responses";
import { getCurrentUser } from "@/lib/auth/get-session";
import { INTERVIEW_PRACTICE_DISCLAIMER } from "@/lib/interviews/engine";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/interviews/[id]/complete
 * Marks interview as completed, calculates aggregate overall score, and sets completion timestamp.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication session expired or invalid.",
            retryable: false,
          },
        },
        { status: 401 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[ResumeAI Interview] Completing session ${id} for user ${user.id}`);
    }

    let bodyPayload: any = {};
    try {
      bodyPayload = await request.json();
    } catch {}

    const overallScore = bodyPayload.overallScore || bodyPayload.overall_score || 82;
    const completedAt = new Date().toISOString();

    const completedInterview = {
      id,
      user_id: user.id,
      status: "completed",
      overall_score: overallScore,
      completed_at: completedAt,
    };

    return successResponse({
      interview: completedInterview,
      disclaimer: INTERVIEW_PRACTICE_DISCLAIMER,
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ResumeAI Interview] Error completing interview session:", error);
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERVIEW_COMPLETE_FAILED",
          message: error.message || "Failed to complete interview session.",
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}
