import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/api-error";
import { createdResponse } from "@/lib/responses";
import { getCurrentUser } from "@/lib/auth/get-session";
import { evaluateInterviewAnswer } from "@/lib/interviews/engine";
import { saveInterviewAnswerDoc, saveInterviewEvaluationDoc } from "@/lib/firebase/firestore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/interviews/[id]/answers
 * Submits an answer text for a question, evaluates it via AI engine, and saves feedback.
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

    const body = await request.json();
    const questionId = body.question_id || body.questionId || crypto.randomUUID();
    const questionText = body.question_text || body.questionText || "Interview Question";
    const answerText = (body.answer_text || body.answerText || "").trim();
    const interviewType = body.interview_type || body.interviewType || "mixed";

    if (process.env.NODE_ENV === "development") {
      console.log(`[ResumeAI Interview] Submitting answer for session ${id}, question ${questionId}`);
    }

    // Evaluate candidate answer with AI evaluator
    const evalResult = evaluateInterviewAnswer(questionText, answerText, interviewType as any);

    // Save answer and evaluation in Firestore
    const answerId = await saveInterviewAnswerDoc(user.id, id, {
      questionId,
      answerText,
      technicalScore: evalResult.technicalScore,
      communicationScore: evalResult.communicationScore,
      relevanceScore: evalResult.relevanceScore,
      overallScore: evalResult.overallScore,
    });

    await saveInterviewEvaluationDoc(user.id, id, {
      questionId,
      answerId,
      evalResult,
    });

    const createdAnswer = {
      id: answerId,
      interview_id: id,
      question_id: questionId,
      answer_text: answerText,
      technical_score: evalResult.technicalScore,
      communication_score: evalResult.communicationScore,
      confidence_score: evalResult.confidenceScore,
      relevance_score: evalResult.relevanceScore,
      overall_score: evalResult.overallScore,
      ai_feedback: evalResult.feedback,
      created_at: new Date().toISOString(),
    };

    return createdResponse(createdAnswer);
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ResumeAI Interview] Error saving answer evaluation:", error);
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ANSWER_SUBMISSION_FAILED",
          message: error.message || "AI evaluation temporarily unavailable. Please retry.",
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}
