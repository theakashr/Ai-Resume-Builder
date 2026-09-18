"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, FilePlus, ArrowRight, ShieldCheck } from "lucide-react";

export interface DashboardEmptyStateProps {
  onCreateFirstResume?: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({
  onCreateFirstResume,
}) => {
  return (
    <Card className="border-dashed border-2 border-[#D4D4D8] bg-white p-8 sm:p-12 text-center">
      <CardContent className="max-w-md mx-auto flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center border border-[#E0E7FF] shadow-2xs">
          <FilePlus className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#09090B]">Your career workspace starts here.</h3>
          <p className="text-xs text-[#52525B] leading-relaxed">
            Create an ATS-optimized resume in minutes, tailor it for specific job applications, and practice mock interviews with AI feedback.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onCreateFirstResume}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="font-semibold shadow-md mt-2"
        >
          Create Your First Resume
        </Button>

        <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Takes under 3 minutes • ATS Ready
        </p>
      </CardContent>
    </Card>
  );
};
