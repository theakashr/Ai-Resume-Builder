"use client";

import React from "react";
import { FilePlus, Sliders, Award } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      icon: <FilePlus className="w-6 h-6 text-indigo-600" />,
      title: "Create your resume",
      description: "Import your background or start fresh with professional ATS-ready templates.",
    },
    {
      number: "02",
      icon: <Sliders className="w-6 h-6 text-indigo-600" />,
      title: "Tailor it to your target job",
      description: "Paste the job post to auto-scan missing keywords and boost your match score.",
    },
    {
      number: "03",
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      title: "Practice your interview",
      description: "Run simulated mock interviews with AI feedback tailored to your experience.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold uppercase tracking-wider text-indigo-700">
            Simple 3-Step Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How ResumeAI works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A seamless path from application draft to offer letter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 relative hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-slate-200">{step.number}</span>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
