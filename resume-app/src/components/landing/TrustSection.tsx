"use client";

import React from "react";
import { ShieldCheck, Sparkles, LayoutTemplate, Lock } from "lucide-react";

export const TrustSection: React.FC = () => {
  const trustSignals = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#10B981]" />,
      title: "ATS-Friendly",
      description: "Formats structured to parse cleanly on Workday, Taleo, Greenhouse, and Lever engines.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#4F46E5]" />,
      title: "AI-Powered",
      description: "Instant bullet point rewrites, keyword density analysis, and metric quantification.",
    },
    {
      icon: <LayoutTemplate className="w-5 h-5 text-[#4F46E5]" />,
      title: "Professional Templates",
      description: "Clean, battle-tested typography layouts crafted by tech product leaders.",
    },
    {
      icon: <Lock className="w-5 h-5 text-[#52525B]" />,
      title: "Privacy-Focused",
      description: "Your personal details and work history are never sold or trained on public LLMs.",
    },
  ];

  return (
    <section className="py-12 border-y border-[#E4E4E7] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustSignals.map((signal, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E4E4E7] shrink-0">
                {signal.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-semibold text-[#09090B]">{signal.title}</h3>
                <p className="text-xs text-[#52525B] leading-relaxed">{signal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
