"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductPreview } from "@/components/landing/ProductPreview";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
} from "lucide-react";

export const Hero: React.FC = () => {
  const companies = [
    { name: "Google", font: "font-semibold tracking-tight" },
    { name: "Microsoft", font: "font-medium tracking-tight" },
    { name: "amazon", font: "font-bold lowercase tracking-normal" },
    { name: "TCS", font: "font-bold tracking-wider" },
    { name: "Infosys", font: "font-medium tracking-wide" },
    { name: "accenture", font: "font-semibold lowercase tracking-tight" },
  ];

  return (
    <section className="pt-24 pb-12 sm:pt-28 sm:pb-20 overflow-hidden relative bg-[#FFFFFF]">
      {/* Background Effect: Soft Lavender Gradient & Blurred Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[750px] pointer-events-none -z-10 overflow-hidden">
        {/* Soft Lavender Glow */}
        <div className="absolute -top-32 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-[#F5F3FF] via-[#EEF2FF] to-transparent rounded-full blur-3xl opacity-80" />
        {/* Subtle Blue Glow behind Product Mockup */}
        <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-bl from-[#EEF2FF] via-[#F5F7FF] to-transparent rounded-full blur-3xl opacity-90" />
        {/* Soft Purple Light Center */}
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Hero Grid: ~45% left content, ~55% right visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT HERO: 45% (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left space-y-5">
            {/* Small Rounded Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F3FF] border border-[#E0E7FF] text-xs font-semibold text-[#4F46E5] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>✦ AI-Powered Career Toolkit</span>
            </div>

            {/* Main Heading: 58-70px desktop, tight line height, strong visual hierarchy */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-[#0F172A] leading-[1.08]">
              Build a resume that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#3B82F6] block mt-1">
                gets you noticed.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-lg font-normal">
              Create an ATS-friendly resume, tailor it to the job, and practice your interview with AI.
            </p>

            {/* Feature Highlights: Compact horizontal feature items with small purple checkmarks */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-semibold text-[#0F172A]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                ATS-Optimized
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                AI Suggestions
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                Professional Templates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                Interview Practice
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <Link href="/signup">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto font-semibold bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white rounded-full px-7 shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all"
                >
                  Build My Resume — It’s Free →
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-semibold rounded-full border-slate-300 hover:bg-slate-50 text-[#0F172A] px-6"
                >
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Trust Information */}
            <div className="flex items-center gap-3 text-xs text-[#475569] pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> No credit card required
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5]" /> Save your work automatically
              </span>
            </div>

            {/* Statistics Row: 500K+ Resumes, 3x Calls, 94% Satisfaction */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200/70 w-full max-w-md text-left">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight block">500K+</span>
                <span className="text-[11px] font-medium text-[#475569] leading-tight block">Resumes Created</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#4F46E5] tracking-tight block">3x</span>
                <span className="text-[11px] font-medium text-[#475569] leading-tight block">Higher Interview Calls</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#10B981] tracking-tight block">94%</span>
                <span className="text-[11px] font-medium text-[#475569] leading-tight block">User Satisfaction</span>
              </div>
            </div>

            {/* Trusted Companies Inline for compact hero continuity */}
            <div className="pt-2 w-full">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Trusted by students and professionals at
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
                {companies.map((company, idx) => (
                  <span
                    key={idx}
                    className={`text-slate-600 hover:text-slate-900 text-sm sm:text-base ${company.font} select-none`}
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT HERO: 55% (lg:col-span-7) Product Mockup */}
          <div className="lg:col-span-7 w-full pt-4 lg:pt-0">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
