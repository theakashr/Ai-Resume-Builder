"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, ArrowRight, Target } from "lucide-react";

export interface NextBestActionCardProps {
  onOptimizeClick?: () => void;
}

export const NextBestActionCard: React.FC<NextBestActionCardProps> = ({ onOptimizeClick }) => {
  return (
    <Card className="border-[#E0E7FF] bg-gradient-to-r from-white via-[#EEF2FF]/40 to-white shadow-2xs">
      <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF] shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                Smart Recommendation
              </span>
              <Badge variant="indigo" size="sm">
                Highest ROI Action
              </Badge>
            </div>
            <h3 className="text-base font-bold text-[#09090B]">
              Your primary resume is missing 4 critical keywords for Senior Product Designer roles.
            </h3>
            <p className="text-xs text-[#52525B] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#D97706]" /> Adding <strong>GraphQL, Design System Governance, CI/CD, OKRs</strong> will boost ATS parse match from 74% to 92%.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOptimizeClick}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="shrink-0 font-semibold shadow-xs"
        >
          Optimize My Resume
        </Button>
      </CardContent>
    </Card>
  );
};
