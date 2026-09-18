"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TemplateCard {
  id: string;
  name: string;
  category: string;
  colorHex: string;
  atsScore: number;
  description: string;
  accentClass: string;
}

export const TemplatesSection: React.FC = () => {
  const templates: TemplateCard[] = [
    {
      id: "modern-professional",
      name: "Modern Professional",
      category: "Tech & Corporate",
      colorHex: "#4F46E5",
      atsScore: 98,
      description: "Clean two-column header with ATS-scannable bullet points and skills tags.",
      accentClass: "from-indigo-500 to-indigo-600",
    },
    {
      id: "minimal-clean",
      name: "Minimal Clean",
      category: "Software Engineering",
      colorHex: "#059669",
      atsScore: 96,
      description: "Monospaced hierarchy, generous whitespace, and zero parser blockers.",
      accentClass: "from-emerald-500 to-emerald-600",
    },
    {
      id: "dark-professional",
      name: "Dark Professional",
      category: "Senior Leadership",
      colorHex: "#0F172A",
      atsScore: 95,
      description: "High-contrast slate accents for management and executive applications.",
      accentClass: "from-slate-800 to-slate-950",
    },
    {
      id: "creative-modern",
      name: "Creative Modern",
      category: "Design & Product",
      colorHex: "#7C3AED",
      atsScore: 94,
      description: "Vibrant accent highlights with portfolio callouts and core competencies.",
      accentClass: "from-purple-500 to-violet-600",
    },
    {
      id: "elegant-classic",
      name: "Elegant Classic",
      category: "Finance & Consulting",
      colorHex: "#2563EB",
      atsScore: 97,
      description: "Timeless single-column typography designed for traditional recruiters.",
      accentClass: "from-blue-600 to-indigo-700",
    },
    {
      id: "modern-gradient",
      name: "Modern Gradient",
      category: "Marketing & Growth",
      colorHex: "#D97706",
      atsScore: 93,
      description: "Subtle gradient section badges optimized for creative and tech roles.",
      accentClass: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <section id="templates" className="py-20 sm:py-24 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 text-left max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <Sparkles className="w-3.5 h-3.5" /> Popular Templates
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Professional Templates for Every Career
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Choose from 50+ ATS-optimized templates designed by hiring experts and verified against top applicant tracking systems.
            </p>
          </div>

          <Link href="/dashboard/templates" className="shrink-0">
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="rounded-full border-slate-300 font-semibold text-slate-800 hover:bg-white shadow-2xs"
            >
              View All Templates
            </Button>
          </Link>
        </div>

        {/* 6 Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden flex flex-col text-left"
            >
              {/* Template Preview Top Visual */}
              <div className="h-44 sm:h-48 bg-gradient-to-br from-slate-100 to-slate-50 p-4 border-b border-slate-100 relative overflow-hidden flex items-center justify-center">
                {/* Paper mini mockup */}
                <div className="w-48 h-56 bg-white rounded-t-lg shadow-md border border-slate-200/80 p-3 flex flex-col gap-1.5 transform group-hover:-translate-y-2 transition-transform duration-300">
                  <div className={`h-2 w-16 rounded bg-gradient-to-r ${template.accentClass}`} />
                  <div className="h-1.5 w-28 bg-slate-200 rounded" />
                  <div className="h-px w-full bg-slate-100 my-1" />
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-slate-100 rounded" />
                    <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
                    <div className="h-1.5 w-4/6 bg-slate-100 rounded" />
                  </div>
                  <div className="h-px w-full bg-slate-100 my-1" />
                  <div className="flex gap-1">
                    <div className="h-2 w-8 bg-slate-100 rounded" />
                    <div className="h-2 w-8 bg-slate-100 rounded" />
                    <div className="h-2 w-8 bg-slate-100 rounded" />
                  </div>
                </div>

                {/* ATS Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {template.atsScore}% ATS
                </div>
              </div>

              {/* Template Details Bottom */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {template.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 block mb-2">
                    {template.category}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/dashboard/resumes/builder?template=${template.id}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group/btn"
                  >
                    Use This Template
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                  <span className="text-[11px] font-medium text-slate-400">ATS Certified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Templates Bottom CTA */}
        <div className="mt-12 text-center">
          <Link href="/dashboard/templates">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 shadow-sm hover:shadow-md"
            >
              Explore All Templates
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
