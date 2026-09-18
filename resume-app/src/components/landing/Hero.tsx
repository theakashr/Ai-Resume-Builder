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
  Target,
  FileCheck2,
  Layout,
  Mic2,
} from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden relative bg-white">
      {/* Subtle Background Radial Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/60 via-purple-50/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute -top-20 right-1/4 w-[450px] h-[450px] bg-gradient-to-bl from-blue-100/50 via-indigo-50/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Headline, Highlights, and CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/80 text-xs font-semibold text-indigo-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
              <span>✦ AI-Powered Career Toolkit</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Build a resume that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600">
                gets you noticed.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              Create an ATS-friendly resume, tailor it to the job, and practice your interview with AI — all in one place.
            </p>

            {/* 4 Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3.5 w-full pt-1">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="p-1.5 rounded-lg bg-indigo-100/70 text-indigo-600 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">ATS Optimized</h4>
                  <p className="text-[11px] text-slate-500">Get past filters</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="p-1.5 rounded-lg bg-violet-100/70 text-violet-600 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">AI Suggestions</h4>
                  <p className="text-[11px] text-slate-500">Improve instantly</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="p-1.5 rounded-lg bg-blue-100/70 text-blue-600 shrink-0">
                  <Layout className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Professional Templates</h4>
                  <p className="text-[11px] text-slate-500">50+ modern designs</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-600 shrink-0">
                  <Mic2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Interview Practice</h4>
                  <p className="text-[11px] text-slate-500">Be job ready</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <Link href="/signup">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all"
                >
                  Build My Resume — It's Free
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-medium rounded-full border-slate-300 hover:bg-slate-50 text-slate-800"
                >
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No credit card required
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Save your work automatically
              </span>
            </div>
          </div>

          {/* Right Column: High-Impact Product Mockup */}
          <div className="lg:col-span-6 w-full pt-6 lg:pt-0">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
