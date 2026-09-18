"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Target, CheckCircle2 } from "lucide-react";

export interface JobMatchScoreProps {
  matchScore?: number;
  jobTitle?: string;
  companyName?: string;
  hardSkillsMatch?: number;
  softSkillsMatch?: number;
  experienceMatch?: number;
}

export const JobMatchScore: React.FC<JobMatchScoreProps> = ({
  matchScore = 88,
  jobTitle = "Senior Product Designer",
  companyName = "Stripe",
  hardSkillsMatch = 92,
  softSkillsMatch = 85,
  experienceMatch = 90,
}) => {
  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#4F46E5]" />
            <div>
              <CardTitle className="text-base font-semibold">{jobTitle}</CardTitle>
              <p className="text-xs text-[#71717A]">{companyName} Target Posting</p>
            </div>
          </div>
          <Badge variant="indigo" size="md" className="font-bold">
            {matchScore}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-3">
        <ProgressBar
          label="Technical & Hard Skills Match"
          value={hardSkillsMatch}
          variant="indigo"
          size="sm"
        />
        <ProgressBar
          label="Seniority & Experience Duration"
          value={experienceMatch}
          variant="success"
          size="sm"
        />
        <ProgressBar
          label="Leadership & Soft Skills Alignment"
          value={softSkillsMatch}
          variant="warning"
          size="sm"
        />

        <div className="mt-2 p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg flex items-start gap-2.5 text-xs text-[#059669]">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Strong alignment with <strong>{companyName}</strong> design systems requirements. Adding 1 keyword will boost match to 94%.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
