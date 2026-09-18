"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, AlertCircle, Sparkles, Award } from "lucide-react";

export interface InterviewFeedbackProps {
  score?: number;
  clarityScore?: number;
  relevanceScore?: number;
  starStructureScore?: number;
  strengths?: string[];
  improvements?: string[];
  improvedAnswerSnippet?: string;
}

export const InterviewFeedback: React.FC<InterviewFeedbackProps> = ({
  score = 90,
  clarityScore = 92,
  relevanceScore = 88,
  starStructureScore = 90,
  strengths = [
    "Clear STAR method structure with clear Situation setup.",
    "Strong metrics referenced (34% velocity gain).",
    "Confident communication tone.",
  ],
  improvements = [
    "Elaborate more on how you handled the product manager's counter-arguments.",
    "Briefly highlight how you measured developer adoption after 60 days.",
  ],
  improvedAnswerSnippet = "When product leadership questioned design system scope, I facilitated a 2-week pilot measuring component reuse, proving a 34% velocity boost before full rollout.",
}) => {
  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#4F46E5]" />
            <CardTitle className="text-base font-semibold">AI Interviewer Evaluation</CardTitle>
          </div>
          <Badge variant="indigo" size="md" className="font-bold">
            Grade A ({score}/100)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-4">
        {/* Metric pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-[#71717A]">Clarity</span>
            <p className="text-sm font-bold text-[#09090B] mt-0.5">{clarityScore}%</p>
          </div>
          <div className="p-2.5 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-[#71717A]">Role Relevance</span>
            <p className="text-sm font-bold text-[#09090B] mt-0.5">{relevanceScore}%</p>
          </div>
          <div className="p-2.5 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-[#71717A]">STAR Format</span>
            <p className="text-sm font-bold text-[#09090B] mt-0.5">{starStructureScore}%</p>
          </div>
        </div>

        {/* Strengths */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#059669] mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Key Strengths
          </h4>
          <ul className="flex flex-col gap-1 text-xs text-[#52525B] pl-5 list-disc">
            {strengths.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D97706] mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Recommended Adjustments
          </h4>
          <ul className="flex flex-col gap-1 text-xs text-[#52525B] pl-5 list-disc">
            {improvements.map((imp, idx) => (
              <li key={idx}>{imp}</li>
            ))}
          </ul>
        </div>

        {/* Improved Snippet */}
        {improvedAnswerSnippet && (
          <div className="p-3 bg-[#EEF2FF]/60 border border-[#E0E7FF] rounded-lg text-xs">
            <span className="font-bold text-[#4F46E5] flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> High-Impact Recommended Phrasing
            </span>
            <p className="text-[#09090B] italic">"{improvedAnswerSnippet}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
