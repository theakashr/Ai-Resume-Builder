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
    <section id="features" className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold uppercase tracking-wider text-indigo-700">
            Complete Career Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for every step of your application process.
          </h2>
          <p className="text-base text-slate-600">
            From your initial resume draft to acing your final interview rounds.
          </p>
        </div>

        {/* 01 BUILD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-200/90 bg-white rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
          <div className="lg:col-span-5 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100">
                01
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileEdit className="w-4 h-4 text-indigo-600" /> BUILD
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Intuitive Resume Builder with Instant AI Quantifier
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transform vague job responsibilities into high-impact, metric-driven achievements. Our editor provides real-time bullet suggestions optimized for reader engagement.
            </p>
            <div className="pt-2 text-xs font-semibold text-indigo-600">
              ✓ Real-time formatting check • Live preview • Multi-format export
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResumeEditor />
            <ResumePreview scale={0.8} />
          </div>
        </div>

        {/* 02 OPTIMIZE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-200/90 bg-white rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 order-2 lg:order-1">
            <ATSScoreCard />
            <KeywordMatch />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4 text-left order-1 lg:order-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100">
                02
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600" /> OPTIMIZE
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Job Description Matcher & ATS Scanner
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Paste target job descriptions to identify missing technical keywords and parser blockers before submitting your application.
            </p>
            <div className="pt-2 text-xs font-semibold text-indigo-600">
              ✓ Parses Workday, Taleo, Greenhouse • Missing Keyword Cloud • Score Boost
            </div>
          </div>
        </div>

        {/* 03 PRACTICE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-200/90 bg-white rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
          <div className="lg:col-span-5 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100">
                03
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-indigo-600" /> PRACTICE
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              AI Interactive Mock Interview Coach
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Simulate realistic behavioral and technical interview questions custom-tailored to your resume and targeted company role.
            </p>
            <div className="pt-2 text-xs font-semibold text-indigo-600">
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
