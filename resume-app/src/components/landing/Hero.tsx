"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-xs font-medium text-[#4F46E5]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-powered career toolkit</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#09090B] tracking-tight leading-[1.1]">
              Build a resume that <span className="text-[#4F46E5]">gets you noticed.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#52525B] leading-relaxed max-w-xl font-normal">
              Create an ATS-friendly resume, tailor it to the job, and practice your interview with AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <Link href="/signup">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Build My Resume — It's Free
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-medium"
                >
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Below CTA Trust indicators */}
            <div className="flex items-center gap-4 text-xs text-[#71717A] pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> No credit card required
              </span>
              <span className="text-[#D4D4D8]">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5]" /> Save your work automatically
              </span>
            </div>
          </div>

          {/* Right Column / Visual Centerpiece: Product Preview */}
          <div className="lg:col-span-6 w-full">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
