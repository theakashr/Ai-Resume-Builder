"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TrendingUp, Sparkles } from "lucide-react";

export const CareerProgressCard: React.FC = () => {
  return (
    <Card className="border-[#E4E4E7] bg-white shadow-2xs">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
            <div>
              <CardTitle className="text-base font-semibold">Career Progress</CardTitle>
              <p className="text-xs text-[#71717A]">Overall application preparedness rating</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#059669] flex items-center gap-1 bg-[#ECFDF5] px-2.5 py-1 rounded-md border border-[#A7F3D0]">
            <Sparkles className="w-3 h-3" /> +12% this week
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ProgressBar
          label="Resume Completeness"
          value={82}
          variant="indigo"
          size="md"
        />
        <ProgressBar
          label="ATS Scanner Readiness"
          value={74}
          variant="warning"
          size="md"
        />
        <ProgressBar
          label="Mock Interview Preparedness"
          value={61}
          variant="indigo"
          size="md"
        />
      </CardContent>
    </Card>
  );
};
