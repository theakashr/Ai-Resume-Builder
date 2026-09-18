"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";

export interface ResumeScoreCardProps {
  score?: number;
  brevityScore?: number;
  impactScore?: number;
  formattingScore?: number;
  lastUpdated?: string;
  onImproveClick?: () => void;
}

export const ResumeScoreCard: React.FC<ResumeScoreCardProps> = ({
  score = 92,
  brevityScore = 95,
  impactScore = 88,
  formattingScore = 94,
  lastUpdated = "2 mins ago",
  onImproveClick,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
        <div>
          <CardTitle className="text-base font-semibold text-[#09090B]">Resume Health Score</CardTitle>
          <p className="text-xs text-[#71717A] mt-0.5">Updated {lastUpdated}</p>
        </div>
        <Badge variant="success" size="sm">
          Top 8% Candidate
        </Badge>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing score={score} label="Overall Score" sublabel="Grade A+" size={110} />
          
          <div className="flex-1 w-full flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#52525B] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Impact & Verbs
              </span>
              <span className="font-semibold text-[#09090B]">{impactScore}/100</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#52525B] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> ATS Formatting
              </span>
              <span className="font-semibold text-[#09090B]">{formattingScore}/100</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#52525B] font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" /> Conciseness & Length
              </span>
              <span className="font-semibold text-[#09090B]">{brevityScore}/100</span>
            </div>

            {onImproveClick && (
              <button
                onClick={onImproveClick}
                className="mt-1 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1 transition-colors self-start"
              >
                <span>Run AI Bullet Point Optimizer</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
