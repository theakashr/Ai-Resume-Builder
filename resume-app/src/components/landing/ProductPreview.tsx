"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  CheckCircle2,
  FileText,
  Zap,
  ArrowRight,
  TrendingUp,
  Layout,
  Sliders,
  Download,
  Award,
} from "lucide-react";

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"resume" | "job" | "interview">("resume");
  const [appliedSuggestion, setAppliedSuggestion] = useState(false);

  return (
    <div className="relative w-full select-none">
      {/* Soft Glow Background Accents */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Pill Top-Left: Modern Templates */}
      <div className="hidden sm:flex absolute -top-4 -left-4 z-20 items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/80 shadow-md text-xs font-semibold text-slate-800 animate-pulse">
        <Layout className="w-3.5 h-3.5 text-indigo-600" />
        <span>Modern Templates</span>
      </div>

      {/* Floating Pill Top-Right: Export to PDF */}
      <div className="hidden sm:flex absolute -top-4 -right-2 z-20 items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/80 shadow-md text-xs font-semibold text-slate-800">
        <Download className="w-3.5 h-3.5 text-indigo-600" />
        <span>Export to PDF</span>
      </div>

      {/* Main Browser-Style Card */}
      <div className="w-full bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden text-slate-900 transition-all duration-300">
        {/* Browser Top Header */}
        <div className="bg-slate-50/90 border-b border-slate-200/80 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          {/* Browser Dots */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <span className="text-xs font-medium text-slate-600 hidden sm:inline-flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Alex_Morgan_Resume.pdf
            </span>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === "resume"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Resume Optimizer
            </button>
            <button
              onClick={() => setActiveTab("job")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === "job"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Job Match
            </button>
            <button
              onClick={() => setActiveTab("interview")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === "interview"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              AI Interview
            </button>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-slate-50/50 to-white relative">
          {activeTab === "resume" && (
            <div className="space-y-4">
              {/* Document Paper Mockup */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-sm text-left relative">
                {/* Resume Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">Alex Morgan</h3>
                    <p className="text-sm font-semibold text-indigo-600">Software Engineer</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      San Francisco, CA • alex.morgan@email.com • github.com/alexmorgan
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Status</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> ATS Ready
                    </span>
                  </div>
                </div>

                {/* Section: Professional Summary */}
                <div className="mb-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200/60 pb-1 mb-1.5">
                    Professional Summary
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Results-driven Software Engineer with 5+ years of experience designing cloud-native microservices, optimizing low-latency APIs, and deploying scalable distributed systems across AWS and GCP.
                  </p>
                </div>

                {/* Section: Experience */}
                <div className="mb-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200/60 pb-1 mb-2">
                    Experience
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-900">
                      <span>Senior Software Engineer — CloudScale Technologies</span>
                      <span className="text-slate-400 font-normal">2022 – Present</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                      <li>
                        {appliedSuggestion ? (
                          <span className="bg-emerald-50 text-emerald-800 font-medium px-1.5 py-0.5 rounded border border-emerald-200 transition-all">
                            Architected distributed streaming pipeline processing 12M events/day, cutting latency by 38% and cloud costs by $180K/yr.
                          </span>
                        ) : (
                          <span>Designed and built event streaming pipelines for user data processing and real-time notifications.</span>
                        )}
                      </li>
                      <li>Led migration of monolith API to modular microservices, boosting system uptime to 99.99%.</li>
                    </ul>
                  </div>
                </div>

                {/* Section: Skills & Education */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200/60 pb-1 mb-1.5">
                      Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Docker", "AWS"].map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200/60 pb-1 mb-1.5">
                      Education
                    </h4>
                    <p className="text-xs font-semibold text-slate-900">B.S. Computer Science</p>
                    <p className="text-[11px] text-slate-500">University of California, Berkeley • Magna Cum Laude</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "job" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Senior Software Engineer — Stripe</h3>
                  <p className="text-xs text-slate-500">Target Role Match Analysis</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-700">88% High Match</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Required Skills</span>
                  <span className="text-sm font-bold text-slate-900">92% Matched</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Seniority Alignment</span>
                  <span className="text-sm font-bold text-emerald-600">Strong Alignment</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Target Keywords</span>
                  <span className="text-sm font-bold text-indigo-600">14 of 16 Found</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "interview" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">AI Mock Interview Simulator</h3>
                  <p className="text-xs text-slate-500">Technical & Behavioral Practice</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Live Coach Active
                </span>
              </div>
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Sample Question:
                </span>
                <p className="text-xs font-semibold text-slate-900">
                  "Describe a challenging architectural decision you made when transitioning from a monolith to microservices. What trade-offs did you consider?"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Card: 92% ATS Score Card (Top-Right / Overlapping) */}
      <div className="absolute -top-6 -right-2 sm:-right-6 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-xl shadow-slate-900/10 flex items-center gap-3.5 hover:scale-105 transition-transform duration-200">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-indigo-600"
              strokeDasharray="92, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-xs font-extrabold text-slate-900">92%</span>
        </div>
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">ATS Score</span>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Excellent
          </p>
        </div>
      </div>

      {/* Floating Card: AI Resume Optimizer (Bottom-Left / Overlapping) */}
      <div className="absolute -bottom-6 -left-2 sm:-left-6 z-30 max-w-[280px] sm:max-w-xs bg-white/95 backdrop-blur-md border border-indigo-100 rounded-2xl p-3.5 sm:p-4 shadow-xl shadow-indigo-500/10 text-left hover:scale-102 transition-transform duration-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Optimizer</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
            High Priority
          </span>
        </div>
        <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
          Your lead experience bullet lacks metric quantification. Add numbers to increase ATS score to 96%.
        </p>
        <button
          onClick={() => setAppliedSuggestion(!appliedSuggestion)}
          className="w-full py-1.5 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
        >
          {appliedSuggestion ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Applied (+4% ATS)
            </>
          ) : (
            <>
              <Zap className="w-3 h-3 text-amber-300" /> Improve with AI →
            </>
          )}
        </button>
      </div>

      {/* Floating Pill Bottom-Right: Fully Customizable */}
      <div className="hidden sm:flex absolute -bottom-3 right-8 z-20 items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/80 shadow-md text-xs font-semibold text-slate-800">
        <Sliders className="w-3.5 h-3.5 text-indigo-600" />
        <span>Fully Customizable</span>
      </div>

      {/* Subtle Handwritten / Decorative Style Labels */}
      <div className="hidden lg:block absolute -top-12 left-1/3 z-10 -rotate-6 font-mono text-[11px] font-medium text-indigo-500/80 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-200/60 shadow-2xs">
        ✦ Choose Your Style
      </div>
      <div className="hidden lg:block absolute -bottom-10 right-1/4 z-10 rotate-3 font-mono text-[11px] font-medium text-violet-500/80 bg-violet-50/80 px-2 py-0.5 rounded border border-violet-200/60 shadow-2xs">
        ✦ Same Skills. Bigger Opportunities.
      </div>
    </div>
  );
};
