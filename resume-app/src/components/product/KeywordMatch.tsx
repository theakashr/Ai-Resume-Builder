"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check, Plus } from "lucide-react";

export interface KeywordMatchProps {
  foundKeywords?: string[];
  missingKeywords?: string[];
  onAddKeyword?: (keyword: string) => void;
}

export const KeywordMatch: React.FC<KeywordMatchProps> = ({
  foundKeywords = ["React", "TypeScript", "Design Systems", "Tailwind CSS", "A/B Testing"],
  missingKeywords = ["GraphQL", "CI/CD Pipeline", "Kubernetes", "OKRs"],
  onAddKeyword,
}) => {
  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Job Keyword Analyzer</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              {foundKeywords.length} Matched
            </Badge>
            <Badge variant="warning" size="sm">
              {missingKeywords.length} Missing
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-4">
        {/* Found */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-2">
            Matched Keywords ({foundKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {foundKeywords.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-medium"
              >
                <Check className="w-3 h-3 stroke-[3]" />
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-2">
            Recommended Missing Keywords ({missingKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => onAddKeyword?.(kw)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] hover:bg-[#FEF3C7] font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                {kw}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
