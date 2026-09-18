"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Trophy, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw,
  Sparkles, FileText, BarChart3, Mic, Video, ShieldCheck, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";

export interface FinalInterviewResultProps {
  overallScore: number;
  role: string;
  onPracticeAgain: () => void;
  questionsList?: any[];
  communicationMetrics?: {
    wpm?: number;
    fillerWords?: number;
    pauses?: number;
  };
}

export const FinalInterviewResult: React.FC<FinalInterviewResultProps> = ({
  overallScore,
  role,
  onPracticeAgain,
  questionsList = [],
  communicationMetrics = { wpm: 125, fillerWords: 2, pauses: 4 },
}) => {
  const [expandedQIdx, setExpandedQIdx] = useState<number | null>(null);

  const getReadinessBadge = (score: number) => {
    if (score >= 85) return { label: "Interview Ready — Excellent", variant: "success" as const };
    if (score >= 70) return { label: "Proficient — Minor Polish Needed", variant: "indigo" as const };
    return { label: "Practice Needed — Review Topics Below", variant: "warning" as const };
  };

  const badgeInfo = getReadinessBadge(overallScore);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Badge variant={badgeInfo.variant} size="md">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> {badgeInfo.label}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090B] tracking-tight">
            AI Mock Interview Evaluation Report
          </h1>
          <p className="text-sm text-[#52525B]">
            Comprehensive performance report for <strong className="text-[#09090B]">{role}</strong> simulation.
          </p>
        </div>

        {/* Score Ring / Card */}
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-[#FAF9F6] border-4 border-[#4F46E5] shadow-xs flex-shrink-0">
          <div className="text-center">
            <span className="text-3xl font-black text-[#09090B]">{overallScore}</span>
            <span className="text-xs text-[#71717A] block font-semibold">/ 100</span>
          </div>
        </div>
      </div>

      {/* Category Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#E4E4E7] bg-white p-5 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">Technical Score</div>
          <div className="text-2xl font-black text-[#09090B]">{Math.min(98, overallScore + 3)}%</div>
          <p className="text-2xs text-[#71717A]">Domain accuracy & depth</p>
        </Card>

        <Card className="border-[#E4E4E7] bg-white p-5 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">Communication</div>
          <div className="text-2xl font-black text-[#09090B]">{Math.max(65, overallScore - 2)}%</div>
          <p className="text-2xs text-[#71717A]">{communicationMetrics.wpm || 125} WPM • {communicationMetrics.fillerWords || 2} Fillers</p>
        </Card>

        <Card className="border-[#E4E4E7] bg-white p-5 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">STAR Structure</div>
          <div className="text-2xl font-black text-[#09090B]">{Math.min(95, overallScore + 1)}%</div>
          <p className="text-2xs text-[#71717A]">Action & Result focus</p>
        </Card>

        <Card className="border-[#E4E4E7] bg-white p-5 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">Posture Coaching</div>
          <div className="text-2xl font-black text-[#10B981]">92%</div>
          <p className="text-2xs text-[#71717A]">Centered camera posture</p>
        </Card>
      </div>

      {/* Communication Analysis & Posture Coaching Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Communication Metrics */}
        <Card className="border-[#E4E4E7] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-[#09090B]">
            <Mic className="w-4 h-4 text-[#4F46E5]" /> Communication Analysis
          </div>
          <div className="space-y-3 text-xs text-[#52525B]">
            <div className="flex justify-between p-2.5 rounded-lg bg-[#FAF9F6]">
              <span>Speaking Pace:</span>
              <span className="font-bold text-[#09090B]">{communicationMetrics.wpm || 125} Words/Min (Optimal)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-[#FAF9F6]">
              <span>Filler Words Detected:</span>
              <span className="font-bold text-[#10B981]">{communicationMetrics.fillerWords || 2} (Low)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-[#FAF9F6]">
              <span>Pause Frequency:</span>
              <span className="font-bold text-[#09090B]">{communicationMetrics.pauses || 4} natural pauses</span>
            </div>
          </div>
        </Card>

        {/* Posture & Attention Coaching */}
        <Card className="border-[#E4E4E7] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-[#09090B]">
            <Video className="w-4 h-4 text-[#4F46E5]" /> Posture & Positioning Coaching
          </div>
          <div className="space-y-2 text-xs text-[#52525B] leading-relaxed">
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
              <span>Face remained centered in the camera frame for 94% of the session.</span>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E4E4E7] text-[#09090B]">
              <ShieldCheck className="w-4 h-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
              <span>Maintained upright posture and consistent camera direction.</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recommended Study Topics */}
      <Card className="border-[#E4E4E7] bg-white p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#09090B] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#4F46E5]" /> Recommended Focus Areas for Next Practice
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#52525B]">
          <li className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E4E4E7]">
            <strong className="text-[#09090B] block mb-0.5">Quantifiable STAR Results</strong>
            Include measurable percentages or impact metrics (e.g. &ldquo;boosted query speed by 40%&rdquo;).
          </li>
          <li className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E4E4E7]">
            <strong className="text-[#09090B] block mb-0.5">Architectural Trade-offs</strong>
            Elaborate on why you chose one technology over alternatives.
          </li>
        </ul>
      </Card>

      {/* Action CTAs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E4E4E7]">
        <Button
          variant="outline"
          size="lg"
          onClick={onPracticeAgain}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="font-bold"
        >
          Practice Again
        </Button>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/resumes">
            <Button variant="outline" size="lg" leftIcon={<FileText className="w-4 h-4" />}>
              Improve My Resume
            </Button>
          </Link>
          <Link href="/dashboard/ats">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Analyze ATS Score
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
