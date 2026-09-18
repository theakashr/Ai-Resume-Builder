"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  FileText,
  Zap,
  Layout,
  Sliders,
  Award,
  Download,
} from "lucide-react";

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"resume" | "job" | "interview">("resume");
  const [appliedSuggestion, setAppliedSuggestion] = useState(false);

  return (
    <div className="relative w-full select-none">
      {/* Background Soft Glows */}
      <div className="absolute -top-12 -right-8 w-80 h-80 bg-[#F5F3FF] rounded-full blur-3xl pointer-events-none -z-10 opacity-80" />
      <div className="absolute -bottom-12 -left-8 w-80 h-80 bg-[#EEF2FF] rounded-full blur-3xl pointer-events-none -z-10 opacity-80" />

      {/* Decorative Handwritten-Style Floating Label Top: Choose Your Style */}
      <div className="hidden lg:block absolute -top-8 left-1/4 z-20 -rotate-6 font-mono text-[11px] font-bold text-[#6366F1] bg-[#F5F3FF] px-2.5 py-1 rounded-full border border-purple-200/80 shadow-2xs">
        ✦ Choose Your Style
      </div>

      {/* Floating Pill Top-Left: Modern Templates */}
      <div className="hidden sm:flex absolute -top-3 left-4 z-20 items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-slate-200 shadow-sm text-xs font-semibold text-[#0F172A]">
        <Layout className="w-3.5 h-3.5 text-[#4F46E5]" />
        <span>Modern Templates</span>
      </div>

      {/* Main Browser / Application Window Mockup */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl shadow-indigo-500/10 overflow-hidden text-[#0F172A] transition-all duration-300">
        {/* Top Browser Bar */}
        <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          {/* Window Dots & Filename */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline-flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#4F46E5]" />
              My_Resume.pdf
            </span>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === "resume"
                  ? "bg-white text-[#0F172A] shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Resume Optimizer
            </button>
            <button
              onClick={() => setActiveTab("job")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === "job"
                  ? "bg-white text-[#0F172A] shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Job Match
            </button>
            <button
              onClick={() => setActiveTab("interview")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === "interview"
                  ? "bg-white text-[#0F172A] shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              AI Interview
            </button>
          </div>
        </div>

        {/* Inner Content Area: Realistic Resume Paper */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-slate-50/40 to-white relative min-h-[460px]">
          {activeTab === "resume" && (
            <div className="space-y-3.5">
              {/* Actual Polished Resume Paper */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm text-left">
                {/* Candidate Header */}
                <div className="border-b border-slate-200/70 pb-3 mb-3 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">Alex Morgan</h3>
                    <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">Software Engineer</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      San Francisco, CA • alex.morgan@email.com • (555) 234-5678 • linkedin.com/in/alexmorgan
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> ATS Verified
                  </span>
                </div>

                {/* Section: Professional Summary */}
                <div className="mb-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200/60 pb-0.5 mb-1">
                    Professional Summary
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Innovative Software Engineer with 5+ years of experience building high-performance distributed systems, designing low-latency REST/GraphQL APIs, and scaling microservices serving 10M+ daily active users.
                  </p>
                </div>

                {/* Section: Experience */}
                <div className="mb-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200/60 pb-0.5 mb-1.5">
                    Experience
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Senior Software Engineer — Apex Cloud Systems</span>
                      <span className="text-slate-400 font-normal">2022 – Present</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>
                        {appliedSuggestion ? (
                          <span className="bg-emerald-50 text-emerald-900 font-medium px-1.5 py-0.5 rounded border border-emerald-200 transition-all">
                            Architected distributed event streaming pipeline processing 14M events/day, cutting API latency by 42% and cloud costs by $180K/yr.
                          </span>
                        ) : (
                          <span>Designed and built event streaming pipelines for user data processing and real-time notifications.</span>
                        )}
                      </li>
                      <li>Spearheaded migration of legacy monolith into 8 containerized microservices with zero downtime.</li>
                    </ul>
                  </div>
                </div>

                {/* Section: Education & Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 mb-1">
                      Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {["TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "Docker", "AWS", "CI/CD"].map((skill) => (
                        <span key={skill} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 mb-1">
                      Education & Certifications
                    </h4>
                    <p className="text-xs font-semibold text-slate-900">B.S. in Computer Science</p>
                    <p className="text-[11px] text-slate-500">UC Berkeley • AWS Certified Solutions Architect</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "job" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Software Engineer — Stripe</h3>
                  <p className="text-xs text-slate-500">Target Role Match Breakdown</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">88% High Match</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Required Skills</span>
                  <span className="text-sm font-bold text-slate-900">92% Matched</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Experience Level</span>
                  <span className="text-sm font-bold text-emerald-600">Full Alignment</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Keywords Extracted</span>
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
                  <p className="text-xs text-slate-500">Real-Time STAR Performance Feedback</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Live Coach Active
                </span>
              </div>
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wider block mb-1">
                  Generated Interview Question:
                </span>
                <p className="text-xs font-semibold text-slate-900">
                  "Describe a challenging architectural decision you made when transitioning from a monolith to microservices. What trade-offs did you consider?"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TOP-RIGHT FLOATING ROW: ATS SCORE CARD & JOB MATCH CARD SIDE-BY-SIDE */}
      <div className="absolute -top-6 -right-2 sm:-right-4 z-30 flex items-center gap-2.5 animate-float">
        {/* ATS SCORE CARD: 92% Excellent (Green progress circle) */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-lg shadow-slate-900/10 flex items-center gap-3">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#10B981]"
                strokeDasharray="92, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-[#0F172A]">92%</span>
          </div>
          <div className="text-left">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">ATS SCORE</span>
            <p className="text-xs font-bold text-[#10B981]">Excellent</p>
          </div>
        </div>

        {/* JOB MATCH CARD: 88% High Match (Blue progress circle) */}
        <div className="hidden sm:flex bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-lg shadow-slate-900/10 items-center gap-3">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#3B82F6]"
                strokeDasharray="88, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-[#0F172A]">88%</span>
          </div>
          <div className="text-left">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">JOB MATCH</span>
            <p className="text-xs font-bold text-[#3B82F6]">High Match</p>
          </div>
        </div>
      </div>

      {/* FLOATING AI RESUME OPTIMIZER CARD (Partially overlapping bottom-left) */}
      <div className="absolute -bottom-6 -left-2 sm:-left-6 z-30 max-w-[290px] sm:max-w-xs bg-white/95 backdrop-blur-md border border-indigo-100 rounded-2xl p-3.5 sm:p-4 shadow-xl shadow-indigo-500/10 text-left hover:scale-102 transition-transform duration-200">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F46E5]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>✦ AI Resume Optimizer</span>
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
          className="w-full py-1.5 px-3 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all mb-2"
        >
          {appliedSuggestion ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Applied to Resume (+4% ATS)
            </>
          ) : (
            <>
              <Zap className="w-3 h-3 text-amber-300" /> Improve with AI →
            </>
          )}
        </button>

        {/* Suggested Phrasing Box */}
        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px]">
          <span className="font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            Suggested Phrasing:
          </span>
          <p className="text-slate-800 font-medium italic leading-tight">
            "Architected pipeline processing 14M events/day, cutting latency by 42%."
          </p>
        </div>
      </div>

      {/* Floating Pill Bottom-Right: Fully Customizable */}
      <div className="hidden sm:flex absolute -bottom-3 right-8 z-20 items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200 shadow-md text-xs font-semibold text-[#0F172A]">
        <Sliders className="w-3.5 h-3.5 text-[#4F46E5]" />
        <span>Fully Customizable</span>
      </div>

      {/* Decorative Handwritten-Style Floating Label Bottom: Same Skills. Bigger Opportunities. */}
      <div className="hidden lg:block absolute -bottom-10 right-1/4 z-10 rotate-3 font-mono text-[11px] font-bold text-[#7C3AED] bg-[#F5F3FF] px-2.5 py-1 rounded-full border border-purple-200/80 shadow-2xs">
        ✦ Same Skills. Bigger Opportunities.
      </div>
    </div>
  );
};
