"use client";

import React from "react";
import { ResumeEditor } from "@/components/product/ResumeEditor";
import { ResumePreview } from "@/components/product/ResumePreview";
import { KeywordMatch } from "@/components/product/KeywordMatch";
import { ATSScoreCard } from "@/components/product/ATSScoreCard";
import { InterviewQuestion } from "@/components/product/InterviewQuestion";
import { InterviewFeedback } from "@/components/product/InterviewFeedback";
import { FileEdit, Target, Mic } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 space-y-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
            Complete Career Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#09090B] tracking-tight">
            Designed for every step of your application process.
          </h2>
          <p className="text-base text-[#52525B]">
            From your initial resume draft to acing your final interview rounds.
          </p>
        </div>

        {/* 01 BUILD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#E4E4E7] bg-white rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="lg:col-span-5 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#4F46E5] px-2.5 py-1 bg-[#EEF2FF] rounded-md border border-[#E0E7FF]">
                01
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#71717A] flex items-center gap-1.5">
                <FileEdit className="w-4 h-4 text-[#4F46E5]" /> BUILD
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#09090B] tracking-tight">
              Intuitive Resume Builder with Instant AI Quantifier
            </h3>
            <p className="text-sm text-[#52525B] leading-relaxed">
              Transform vague job responsibilities into high-impact, metric-driven achievements. Our editor provides real-time bullet suggestions optimized for reader engagement.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#4F46E5]">
              ✓ Real-time formatting check • Live preview • Multi-format export
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResumeEditor />
            <ResumePreview scale={0.8} />
          </div>
        </div>

        {/* 02 OPTIMIZE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#E4E4E7] bg-white rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 order-2 lg:order-1">
            <ATSScoreCard />
            <KeywordMatch />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4 text-left order-1 lg:order-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#4F46E5] px-2.5 py-1 bg-[#EEF2FF] rounded-md border border-[#E0E7FF]">
                02
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#71717A] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#4F46E5]" /> OPTIMIZE
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#09090B] tracking-tight">
              Job Description Matcher & ATS Scanner
            </h3>
            <p className="text-sm text-[#52525B] leading-relaxed">
              Paste target job descriptions to identify missing technical keywords and parser blockers before submitting your application.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#4F46E5]">
              ✓ Parses Workday, Taleo, Greenhouse • Missing Keyword Cloud • Score Boost
            </div>
          </div>
        </div>

        {/* 03 PRACTICE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#E4E4E7] bg-white rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="lg:col-span-5 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#4F46E5] px-2.5 py-1 bg-[#EEF2FF] rounded-md border border-[#E0E7FF]">
                03
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#71717A] flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-[#4F46E5]" /> PRACTICE
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#09090B] tracking-tight">
              AI Interactive Mock Interview Coach
            </h3>
            <p className="text-sm text-[#52525B] leading-relaxed">
              Simulate realistic behavioral and technical interview questions custom-tailored to your resume and targeted company role.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#4F46E5]">
              ✓ Voice recording • STAR format evaluation • Improved phrasing suggestions
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InterviewQuestion />
            <InterviewFeedback />
          </div>
        </div>
      </div>
    </section>
  );
};
