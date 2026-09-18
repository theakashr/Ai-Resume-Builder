"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check, X, ShieldCheck } from "lucide-react";

export interface ATSScoreCardProps {
  score?: number;
  parserCompatibility?: string;
  checks?: { label: string; passed: boolean }[];
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({
  score = 92,
  parserCompatibility = "Greenlight (Workday, Taleo, Greenhouse)",
  checks = [
    { label: "Standard Font & Typography", passed: true },
    { label: "Parsable Section Headers", passed: true },
    { label: "No Embedded Tables/Graphics", passed: true },
    { label: "Contact Info Parse Rate", passed: true },
    { label: "Dates & Location Formatting", passed: true },
  ],
}) => {
  return (
    <Card className="border-[#E4E4E7] bg-white shadow-sm">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            <CardTitle className="text-base font-semibold">ATS Scanner Compatibility</CardTitle>
          </div>
          <Badge variant="indigo" size="sm">
            {score}% Passed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-3">
        <div className="p-3 bg-[#FAF9F6] rounded-lg border border-[#E4E4E7] text-xs">
          <span className="font-semibold text-[#09090B]">ATS Engines Tested: </span>
          <span className="text-[#52525B]">{parserCompatibility}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {checks.map((c, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              {c.passed ? (
                <div className="w-4 h-4 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0">
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              <span className={c.passed ? "text-[#09090B] font-medium" : "text-[#EF4444] font-medium"}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
