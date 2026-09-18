"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressBar";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  FileText,
  Mic,
  Plus,
} from "lucide-react";

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"resume" | "job" | "interview">("resume");
  const [appliedSuggestion, setAppliedSuggestion] = useState(false);

  return (
    <div className="w-full bg-white border border-[#E4E4E7] rounded-2xl shadow-xl overflow-hidden text-[#09090B]">
      {/* Top App Header / Bar */}
      <div className="bg-[#FAF9F6] border-b border-[#E4E4E7] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
            <div className="w-3 h-3 rounded-full bg-[#10B981]/80" />
          </div>
          <div className="h-4 w-px bg-[#E4E4E7] hidden sm:block" />
          <span className="text-xs font-semibold text-[#52525B] hidden sm:inline-flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#4F46E5]" /> Demo_Candidate_Resume.pdf
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EEF2FF] text-[#4F46E5] px-2 py-0.5 rounded border border-[#E0E7FF] hidden md:inline-block">
            Interactive Demo Resume — Fictional Data
          </span>
        </div>

        {/* Tab selector bar inside app */}
        <div className="flex items-center gap-1 bg-[#E4E4E7]/60 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab("resume")}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === "resume" ? "bg-white text-[#09090B] shadow-xs font-semibold" : "text-[#71717A] hover:text-[#09090B]"
            }`}
          >
            Resume Optimizer
          </button>
          <button
            onClick={() => setActiveTab("job")}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === "job" ? "bg-white text-[#09090B] shadow-xs font-semibold" : "text-[#71717A] hover:text-[#09090B]"
            }`}
          >
            Job Match (88%)
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === "interview" ? "bg-white text-[#09090B] shadow-xs font-semibold" : "text-[#71717A] hover:text-[#09090B]"
            }`}
          >
            AI Interview Practice
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="success" size="sm">
            <Zap className="w-3 h-3 mr-1" /> Live Sync
          </Badge>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="p-4 sm:p-6 bg-[#FAF9F6]">
        {activeTab === "resume" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Live Mini Resume Render */}
            <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-xl p-5 shadow-2xs flex flex-col gap-4 text-left">
              <div className="flex justify-between items-start border-b border-[#F4F4F5] pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#09090B]">Alex Morgan</h3>
                  <p className="text-xs font-semibold text-[#4F46E5]">Staff Product Designer & Engineer</p>
                </div>
                <Badge variant="indigo" size="sm">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Workday & Taleo Parsable
                </Badge>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1">
                  Professional Experience
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-[#09090B]">Lead Staff Designer — Apex Tech Labs</span>
                    <span className="text-[#A1A1AA]">2022 – Present</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[#52525B]">
                    <li>
                      {appliedSuggestion ? (
                        <span className="bg-[#ECFDF5] text-[#059669] font-medium p-0.5 rounded transition-all">
                          Architected scalable design system adopted across 14 micro-frontends, cutting design-to-code velocity by 42%.
                        </span>
                      ) : (
                        <span>Designed and built company design system for product engineering teams.</span>
                      )}
                    </li>
                    <li>Engineered AI-driven candidate workflow engine generating $2.4M ARR upgrades.</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1">
                  Key Skills
                </h4>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-medium">
                    Design Systems
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-medium">
                    React / Next.js
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-medium">
                    TypeScript
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] font-medium">
                    + Add Missing: GraphQL
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: AI Suggestions & Score Widgets */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Score Badges Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-[#E4E4E7] rounded-xl p-3.5 flex items-center gap-3">
                  <ProgressRing score={92} size={50} strokeWidth={5} />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#71717A]">ATS Score</span>
                    <p className="text-sm font-bold text-[#09090B]">92% (Pass)</p>
                  </div>
                </div>

                <div className="bg-white border border-[#E4E4E7] rounded-xl p-3.5 flex items-center gap-3">
                  <ProgressRing score={88} size={50} strokeWidth={5} />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#71717A]">Job Match</span>
                    <p className="text-sm font-bold text-[#09090B]">88% Match</p>
                  </div>
                </div>
              </div>

              {/* Actionable AI Recommendation Card */}
              <div className="bg-white border border-[#E0E7FF] rounded-xl p-4 shadow-2xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F46E5]">
                    <Sparkles className="w-4 h-4" /> AI Impact Optimizer
                  </div>
                  <Badge variant="error" size="sm">High Priority</Badge>
                </div>

                <p className="text-xs text-[#52525B]">
                  Your lead experience bullet lacks metric quantification. Quantify results to increase ATS score to 96%.
                </p>

                <div className="p-2.5 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block mb-0.5">Suggested Phrasing:</span>
                  <p className="text-[#09090B] font-medium italic">
                    "Architected design system across 14 apps, cutting design-to-code velocity by 42%."
                  </p>
                </div>

                <Button
                  variant={appliedSuggestion ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => setAppliedSuggestion(!appliedSuggestion)}
                  rightIcon={appliedSuggestion ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  className="w-full justify-between"
                >
                  {appliedSuggestion ? "Applied to Resume!" : "Improve Resume Bullet"}
                </Button>
              </div>

              {/* Missing Keywords Bar */}
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-3.5 text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-[#09090B] flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-[#D97706]" /> Recommended Missing Keywords
                  </span>
                  <span className="text-[#D97706]">2 Keywords</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] rounded text-[11px] font-medium flex items-center gap-1">
                    <Plus className="w-3 h-3" /> GraphQL
                  </span>
                  <span className="px-2 py-0.5 bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] rounded text-[11px] font-medium flex items-center gap-1">
                    <Plus className="w-3 h-3" /> CI/CD
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "job" && (
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-6 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#09090B]">Senior Product Designer — Stripe</h3>
                <p className="text-xs text-[#71717A]">Job Description Alignment Analysis</p>
              </div>
              <Badge variant="indigo" size="md" className="font-bold">88% Match</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg">
                <span className="text-[11px] font-medium text-[#71717A]">Hard Skills</span>
                <p className="text-sm font-bold text-[#09090B]">92% Matched</p>
              </div>
              <div className="p-3 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg">
                <span className="text-[11px] font-medium text-[#71717A]">Experience Level</span>
                <p className="text-sm font-bold text-[#09090B]">90% Matched</p>
              </div>
              <div className="p-3 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg">
                <span className="text-[11px] font-medium text-[#71717A]">Keywords Found</span>
                <p className="text-sm font-bold text-[#059669]">14 of 16 Found</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "interview" && (
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-6 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="text-base font-bold text-[#09090B]">AI Mock Interview Coach</h3>
              </div>
              <Badge variant="success" size="sm">Session Active</Badge>
            </div>
            <div className="p-4 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg text-xs">
              <span className="font-bold text-[#4F46E5] block mb-1">Question 2 of 5:</span>
              <p className="text-[#09090B] font-semibold text-sm">
                "Tell me about a time you faced technical disagreement with product leadership on design system scope."
              </p>
            </div>
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-[#52525B]">AI Feedback: Excellent STAR structure. Score: 90/100</span>
              <Button variant="primary" size="sm">Practice Next Question</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
