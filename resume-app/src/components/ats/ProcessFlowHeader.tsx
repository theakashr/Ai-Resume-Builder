"use client";

import React from "react";
import { FileText, Plus, Target, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export const ProcessFlowHeader: React.FC = () => {
  return (
    <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4F4F5] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#09090B] tracking-tight">ATS Resume Optimizer & Job Matcher</h1>
          <p className="text-xs text-[#52525B]">
            Compare your resume against any target job description to eliminate parser blockers.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF2FF] border border-[#E0E7FF] rounded-full text-xs font-semibold text-[#4F46E5]">
          <Sparkles className="w-3.5 h-3.5" /> Workday & Taleo Parser Engine
        </div>
      </div>

      {/* Visual Step-by-Step Diagram: RESUME + JOB DESCRIPTION -> AI ANALYSIS -> IMPROVEMENT PLAN */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center pt-2">
        {/* Step 1: Resume */}
        <div className="sm:col-span-2 bg-[#FAF9F6] border border-[#E4E4E7] rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#EEF2FF] text-[#4F46E5] shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Step 1</span>
            <span className="text-xs font-bold text-[#09090B]">Select Active Resume</span>
          </div>
        </div>

        {/* Plus Icon */}
        <div className="hidden sm:flex justify-center text-[#A1A1AA]">
          <Plus className="w-4 h-4" />
        </div>

        {/* Step 2: Job Description */}
        <div className="sm:col-span-2 bg-[#FAF9F6] border border-[#E4E4E7] rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FFFBEB] text-[#D97706] shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Step 2</span>
            <span className="text-xs font-bold text-[#09090B]">Paste Target Job Posting</span>
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="hidden sm:flex justify-center text-[#4F46E5]">
          <ArrowRight className="w-4 h-4" />
        </div>

        {/* Step 3: AI Improvement Plan */}
        <div className="sm:col-span-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-3.5 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white text-[#10B981] shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">Step 3</span>
            <span className="text-xs font-bold text-[#059669]">Action Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
