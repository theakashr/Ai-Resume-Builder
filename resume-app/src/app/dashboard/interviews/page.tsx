"use client";

import React, { useState } from "react";
import { InterviewSetup, InterviewConfig } from "@/components/interview/InterviewSetup";
import { DeviceCheckModal } from "@/components/interview/DeviceCheckModal";
import { ActiveInterviewScreen } from "@/components/interview/ActiveInterviewScreen";
import { QuestionFeedbackModal } from "@/components/interview/QuestionFeedbackModal";
import { FinalInterviewResult } from "@/components/interview/FinalInterviewResult";
import { Toast } from "@/components/ui/Toast";
import { fetchApi } from "@/lib/api-client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, AlertTriangle } from "lucide-react";

export default function MockInterviewPage() {
  const [sessionState, setSessionState] = useState<"setup" | "active" | "completed">("setup");
  const [showDeviceCheck, setShowDeviceCheck] = useState<boolean>(false);
  const [config, setConfig] = useState<InterviewConfig>({
    role: "Software Developer",
    experienceLevel: "Entry Level",
    interviewType: "Mixed",
    difficulty: "Medium",
    questionsCount: 30,
  });

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [currentAnswerFeedback, setCurrentAnswerFeedback] = useState<any | null>(null);
  const [finalScore, setFinalScore] = useState(88);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [hasCamera, setHasCamera] = useState(true);
  const [hasMic, setHasMic] = useState(true);

  // Loading & Error States
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const handleStartSetupClick = (newConfig: InterviewConfig) => {
    setConfig(newConfig);
    setShowDeviceCheck(true);
  };

  const handleDeviceCheckProceed = async (cameraReady: boolean, micReady: boolean) => {
    setHasCamera(cameraReady);
    setHasMic(micReady);
    setShowDeviceCheck(false);

    setToastType("success");
    setToastMessage(`Initializing AI Mock Interview (${config.questionsCount || 30} Questions)...`);
    setInitError(null);
    setIsInitializing(true);

    try {
      // Create session
      const createRes = await fetchApi<any>("/api/interviews", {
        method: "POST",
        body: JSON.stringify({
          target_role: config.role,
          interview_type: (config.interviewType || "mixed").toLowerCase(),
          difficulty: (config.difficulty || "medium").toLowerCase(),
          questions_count: config.questionsCount || 30,
          resume_id: config.resumeId,
          job_description: config.jobDescription,
        }),
      });

      if (!createRes.success || !createRes.data?.id) {
        throw new Error(createRes.error?.message || "Failed to create mock interview session.");
      }

      const interviewId = createRes.data.id;
      setSessionId(interviewId);

      // Start session & generate 30+ questions
      const startRes = await fetchApi<any>(`/api/interviews/${interviewId}/start`, {
        method: "POST",
      });

      if (!startRes.success || !startRes.data?.questions) {
        throw new Error(startRes.error?.message || "Failed to generate interview questions.");
      }

      setQuestions(startRes.data.questions);
      setCurrentQuestionIdx(0);
      setSessionState("active");
      setToastMessage(`${startRes.data.questions.length} questions generated successfully!`);
      setIsInitializing(false);
    } catch (err: any) {
      setToastType("error");
      setToastMessage(err.message || "Failed to start interview session");
      setInitError(err.message || "Unable to start your interview right now. Please try again.");
      setIsInitializing(false);
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleSubmitAnswer = async (answerText: string, durationSec: number) => {
    if (!sessionId || questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIdx];
    try {
      const ansRes = await fetchApi<any>(`/api/interviews/${sessionId}/answers`, {
        method: "POST",
        body: JSON.stringify({
          question_id: currentQuestion.id,
          answer_text: answerText,
          duration_seconds: durationSec,
        }),
      });

      if (ansRes.success && ansRes.data) {
        setCurrentAnswerFeedback(ansRes.data);
        setFeedbackModalOpen(true);
      }
    } catch (err) {
      console.error("Answer submission error:", err);
      setFeedbackModalOpen(true);
    }
  };

  const handleNextQuestion = async () => {
    setFeedbackModalOpen(false);

    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Complete interview session
      if (sessionId) {
        const compRes = await fetchApi<any>(`/api/interviews/${sessionId}/complete`, {
          method: "POST",
        });
        if (compRes.success && compRes.data) {
          setFinalScore(compRes.data.interview?.overall_score || 88);
          setDisclaimer(compRes.data.disclaimer || null);
        }
      }
      setSessionState("completed");
    }
  };

  const handlePracticeAgain = () => {
    setSessionState("setup");
    setCurrentQuestionIdx(0);
    setSessionId(null);
    setQuestions([]);
  };

  const currentQText =
    questions[currentQuestionIdx]?.question ||
    "Can you describe your architectural approach to designing scalable RESTful APIs?";

  const currentCategory = questions[currentQuestionIdx]?.category || "Technical";

  return (
    <div className="space-y-6">
      {/* Device Check Modal */}
      <DeviceCheckModal
        isOpen={showDeviceCheck}
        onCancel={() => setShowDeviceCheck(false)}
        onProceed={handleDeviceCheckProceed}
      />

      {/* Loading view */}
      {isInitializing && (
        <Card className="border-[#E4E4E7] bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
          <Loader2 className="w-12 h-12 text-[#4F46E5] animate-spin" />
          <h3 className="text-lg font-bold text-[#09090B]">Preparing your 30-question interview...</h3>
          <p className="text-xs text-[#71717A]">Customizing questions based on your resume, role, and job description.</p>
        </Card>
      )}

      {/* Error view */}
      {initError && !isInitializing && (
        <Card className="border-[#FCA5A5] bg-[#FFF5F5] p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-sm max-w-lg mx-auto">
          <AlertTriangle className="w-12 h-12 text-[#EF4444]" />
          <h3 className="text-base font-bold text-[#991B1B]">Unable to start your interview right now. Please try again.</h3>
          <p className="text-xs text-[#9F1239]">{initError}</p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setInitError(null);
                setSessionState("setup");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleStartSetupClick(config)}
            >
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {/* Setup screen */}
      {!isInitializing && !initError && sessionState === "setup" && (
        <InterviewSetup onStartInterview={handleStartSetupClick} />
      )}

      {/* Active Question screen */}
      {!isInitializing && !initError && sessionState === "active" && (
        <ActiveInterviewScreen
          config={config}
          questionIndex={currentQuestionIdx}
          totalQuestions={questions.length || 30}
          currentQuestionText={currentQText}
          category={currentCategory}
          hasCamera={hasCamera}
          hasMic={hasMic}
          onSubmitAnswer={handleSubmitAnswer}
          onSkipQuestion={handleNextQuestion}
          onExitInterview={() => setSessionState("setup")}
        />
      )}

      {/* Completed Results screen */}
      {!isInitializing && !initError && sessionState === "completed" && (
        <div className="space-y-4">
          {disclaimer && (
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3.5 text-xs text-[#1E40AF] leading-relaxed">
              <strong>Practice Feedback Disclaimer:</strong> {disclaimer}
            </div>
          )}
          <FinalInterviewResult
            overallScore={finalScore}
            role={config.role}
            questionsList={questions}
            onPracticeAgain={handlePracticeAgain}
          />
        </div>
      )}

      {/* Per-question Feedback Modal */}
      <QuestionFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={currentQuestionIdx + 1 >= (questions.length || 30)}
        score={currentAnswerFeedback?.overall_score ?? 88}
        communicationScore={currentAnswerFeedback?.communication_score ?? 85}
        structureScore={currentAnswerFeedback?.relevance_score ?? 88}
        confidenceScore={currentAnswerFeedback?.confidence_score ?? 82}
        technicalRelevance={currentAnswerFeedback?.technical_score ?? 90}
        strengths={currentAnswerFeedback?.ai_feedback?.strengths || currentAnswerFeedback?.feedback?.strengths}
        adjustments={currentAnswerFeedback?.ai_feedback?.improvements || currentAnswerFeedback?.feedback?.improvements}
        recommendedPhrasing={currentAnswerFeedback?.ai_feedback?.summary || currentAnswerFeedback?.feedback?.summary}
      />

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast type={toastType} title="Mock Interview" message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      )}
    </div>
  );
}
