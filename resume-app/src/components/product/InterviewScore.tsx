"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Mic, CheckCircle2 } from "lucide-react";

export interface InterviewScoreProps {
  overallScore?: number;
  completedSessions?: number;
  readinessRating?: string;
  technicalMatch?: number;
  behavioralMatch?: number;
}

export const InterviewScore: React.FC<InterviewScoreProps> = ({
  overallScore = 89,
  completedSessions = 4,
  readinessRating = "High Interview Readiness",
  technicalMatch = 92,
  behavioralMatch = 86,
}) => {
  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#4F46E5]" />
            <CardTitle className="text-base font-semibold">Mock Interview Readiness</CardTitle>
          </div>
          <Badge variant="success" size="sm">
            {readinessRating}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col sm:flex-row items-center gap-6">
        <ProgressRing score={overallScore} label="Overall Score" sublabel={`${completedSessions} Sessions`} size={110} />
        <div className="flex-1 w-full flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg">
            <span className="text-[#52525B] font-medium">Technical Deep Dive Score</span>
            <span className="font-bold text-[#09090B]">{technicalMatch}%</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg">
            <span className="text-[#52525B] font-medium">Behavioral & Communication</span>
            <span className="font-bold text-[#09090B]">{behavioralMatch}%</span>
          </div>
          <p className="text-[11px] text-[#059669] font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Staff-level interviews
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
