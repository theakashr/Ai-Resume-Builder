"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";

export interface AIRecommendationProps {
  category?: string;
  impactLevel?: "High" | "Medium" | "Low";
  suggestion?: string;
  beforeText?: string;
  afterText?: string;
  onApply?: () => void;
}

export const AIRecommendation: React.FC<AIRecommendationProps> = ({
  category = "Bullet Point Impact",
  impactLevel = "High",
  suggestion = "Quantify your achievements in Apex Tech Labs role to increase ATS parsing score.",
  beforeText = "Designed design systems for company projects.",
  afterText = "Architected scalable design system adopted across 14 micro-frontends, cutting design-to-code velocity by 42%.",
  onApply,
}) => {
  return (
    <Card className="border-[#E0E7FF] bg-gradient-to-br from-white to-[#EEF2FF]/30">
      <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#09090B]">{category}</span>
          </div>
          <Badge
            variant={impactLevel === "High" ? "error" : impactLevel === "Medium" ? "warning" : "indigo"}
            size="sm"
          >
            {impactLevel} Impact
          </Badge>
        </div>

        <p className="text-xs text-[#52525B] leading-relaxed">{suggestion}</p>

        {beforeText && afterText && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs p-3 bg-white border border-[#E4E4E7] rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase text-[#A1A1AA]">Before</span>
              <span className="text-[#71717A] line-through">{beforeText}</span>
            </div>
            <div className="flex flex-col gap-1 sm:border-l sm:border-[#F4F4F5] sm:pl-3">
              <span className="text-[10px] font-bold uppercase text-[#4F46E5]">AI Recommendation</span>
              <span className="text-[#09090B] font-medium">{afterText}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <Button
            variant="primary"
            size="sm"
            onClick={onApply}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Apply Suggestion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
