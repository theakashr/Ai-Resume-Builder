"use client";

import React from "react";
import { FilePlus, Sliders, Award } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      icon: <FilePlus className="w-6 h-6 text-[#4F46E5]" />,
      title: "Create your resume",
      description: "Import your background or start fresh with professional ATS-ready templates.",
    },
    {
      number: "02",
      icon: <Sliders className="w-6 h-6 text-[#4F46E5]" />,
      title: "Tailor it to your target job",
      description: "Paste the job post to auto-scan missing keywords and boost your match score.",
    },
    {
      number: "03",
      icon: <Award className="w-6 h-6 text-[#4F46E5]" />,
      title: "Practice your interview",
      description: "Run simulated mock interviews with AI feedback tailored to your experience.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
            Simple 3-Step Flow
          </span>
          <h2 className="text-3xl font-extrabold text-[#09090B] tracking-tight">
            How ResumeAI works
          </h2>
          <p className="text-sm text-[#52525B]">
            A seamless path from application draft to offer letter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#FAF9F6] border border-[#E4E4E7] rounded-xl p-6 flex flex-col gap-4 relative hover:border-[#D4D4D8] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white border border-[#E4E4E7] rounded-xl shadow-2xs">
                  {step.icon}
                </div>
                <span className="text-2xl font-black text-[#E4E4E7]">{step.number}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#09090B] mb-1">{step.title}</h3>
                <p className="text-xs text-[#52525B] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
