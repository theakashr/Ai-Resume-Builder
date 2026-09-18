"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, Award } from "lucide-react";

export interface QuestionFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  score?: number;
  communicationScore?: number;
  structureScore?: number;
  confidenceScore?: number;
  technicalRelevance?: number;
  strengths?: string[];
  adjustments?: string[];
  recommendedPhrasing?: string;
}

export const QuestionFeedbackModal: React.FC<QuestionFeedbackProps> = ({
  isOpen,
  onClose,
  onNextQuestion,
  isLastQuestion,
  score = 91,
  communicationScore = 92,
  structureScore = 90,
  confidenceScore = 88,
  technicalRelevance = 94,
  strengths = [
    "Structured response using Situation, Task, Action, and Result (STAR).",
    "Strong technical relevance mentioning design system component velocity (+42%).",
    "Clear, confident communication tone.",
  ],
  adjustments = [
    "Briefly elaborate on how you aligned with product managers during the initial conflict.",
  ],
  recommendedPhrasing = "When product leadership questioned design system scope, I facilitated a 2-week pilot measuring component reuse, proving a 34% velocity boost before full rollout.",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Question AI Evaluation"
      description="Instant STAR format & technical relevance feedback"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Review Response
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onNextQuestion}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="font-bold px-5"
          >
            {isLastQuestion ? "View Complete Results" : "Next Question"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        {/* Overall Score Badge */}
        <div className="p-4 bg-[#FAF9F6] border border-[#E4E4E7] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#09090B]">Question Score</span>
              <p className="text-xs text-[#71717A]">Pass Grade A (Top 10% candidate)</p>
            </div>
          </div>
          <Badge variant="indigo" size="md" className="font-extrabold text-sm">
            {score}/100
          </Badge>
        </div>

        {/* Granular metric grid: Communication, Structure, Confidence, Technical Relevance */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="p-2.5 bg-white border border-[#E4E4E7] rounded-lg">
            <span className="text-[10px] font-bold uppercase text-[#71717A]">Communication</span>
            <p className="text-sm font-bold text-[#09090B] mt-0.5">{communicationScore}%</p>
          </div>
          <div className="p-2.5 bg-white border border-[#E4E4E7] rounded-lg">
            <span className="text-[10px] font-bold uppercase text-[#71717A]">STAR Structure</span>
            <p className="text-sm font-bold text-[#09090B] mt-0.5">{structureScore}%</p>
          </div>
          <div className="p-2.5 bg-white border border-[#E4E4E7] rounded-lg">
            <span className="text-[10px] font-bold uppercase text-[#71717A]">Confidence</span>
            <p className="text-sm font-bold text-[#09090B] mt-0.5">{confidenceScore}%</p>
          </div>
          <div className="p-2.5 bg-white border border-[#E4E4E7] rounded-lg">
            <span className="text-[10px] font-bold uppercase text-[#71717A]">Technical</span>
            <p className="text-sm font-bold text-[#09090B] mt-0.5">{technicalRelevance}%</p>
          </div>
        </div>

        {/* Strengths */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Key Strengths
          </h4>
          <ul className="space-y-1 text-xs text-[#52525B] pl-5 list-disc">
            {strengths.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Adjustments */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#D97706] flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Recommended Adjustments
          </h4>
          <ul className="space-y-1 text-xs text-[#52525B] pl-5 list-disc">
            {adjustments.map((adj, idx) => (
              <li key={idx}>{adj}</li>
            ))}
          </ul>
        </div>

        {/* Recommended Phrasing */}
        {recommendedPhrasing && (
          <div className="p-3 bg-[#EEF2FF]/70 border border-[#E0E7FF] rounded-lg text-xs space-y-1">
            <span className="font-bold text-[#4F46E5] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> High-Impact Recommended Phrasing
            </span>
            <p className="text-[#09090B] italic">"{recommendedPhrasing}"</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
