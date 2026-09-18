"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export interface AtsScoreSummaryProps {
  atsScore?: number;
  keywordMatch?: number;
  skillsMatch?: number;
  formattingScore?: number;
}

export const AtsScoreSummary: React.FC<AtsScoreSummaryProps> = ({
  atsScore = 92,
  keywordMatch = 88,
  skillsMatch = 91,
  formattingScore = 96,
}) => {
  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            <CardTitle className="text-base font-semibold">ATS Compatibility & Match Score</CardTitle>
          </div>
          <Badge variant="indigo" size="sm">
            Estimated ATS compatibility
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-6 items-center text-center">
        {/* ATS Overall */}
        <div className="flex flex-col items-center gap-2">
          <ProgressRing score={atsScore} label="Overall ATS" size={90} strokeWidth={8} />
          <span className="text-xs font-bold text-[#09090B]">ATS Compatibility</span>
        </div>

        {/* Keyword Match */}
        <div className="flex flex-col items-center gap-2">
          <ProgressRing score={keywordMatch} label="Keywords" size={90} strokeWidth={8} />
          <span className="text-xs font-bold text-[#09090B]">Keyword Match</span>
        </div>

        {/* Skills Match */}
        <div className="flex flex-col items-center gap-2">
          <ProgressRing score={skillsMatch} label="Skills" size={90} strokeWidth={8} />
          <span className="text-xs font-bold text-[#09090B]">Skills Alignment</span>
        </div>

        {/* Formatting */}
        <div className="flex flex-col items-center gap-2">
          <ProgressRing score={formattingScore} label="Formatting" size={90} strokeWidth={8} />
          <span className="text-xs font-bold text-[#09090B]">Parser Formatting</span>
        </div>
      </CardContent>
    </Card>
  );
};
