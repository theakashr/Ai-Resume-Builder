"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Mail, Phone, MapPin, Globe } from "lucide-react";

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    bullets: string[];
    aiOptimized?: boolean;
  }>;
  skills: string[];
}

export interface ResumePreviewProps {
  data?: ResumeData;
  highlightSkills?: string[];
  scale?: number;
}

export const mockResumeData: ResumeData = {
  name: "Alex Morgan",
  title: "Senior Product Designer & Frontend Architect",
  email: "alex.morgan@career.ai",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  website: "alexmorgan.design",
  summary:
    "Product designer & engineer with 7+ years building enterprise SaaS platforms. Specialized in scalable design systems, UX conversion optimization, and modern React/TypeScript web apps.",
  experience: [
    {
      role: "Lead Staff Designer",
      company: "Apex Tech Labs",
      period: "2022 — Present",
      aiOptimized: true,
      bullets: [
        "Architected scalable design system adopted across 14 micro-frontends, cutting design-to-code velocity by 42%.",
        "Engineered AI-driven candidate workflow engine generating $2.4M ARR in new seat upgrades.",
        "Mentored cross-functional team of 6 designers and frontend engineers across US & EU timezones.",
      ],
    },
    {
      role: "Senior UI/UX Engineer",
      company: "Vanguard Systems",
      period: "2019 — 2022",
      bullets: [
        "Led redesign of core B2B analytics platform resulting in +18% increase in 30-day retention.",
        "Created custom component library with 100% WCAG 2.1 AA accessibility compliance.",
      ],
    },
  ],
  skills: ["Design Systems", "React / Next.js", "TypeScript", "Tailwind CSS", "User Research", "CRO & Analytics"],
};

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  data = mockResumeData,
  highlightSkills = [],
}) => {
  return (
    <div className="w-full bg-white border border-[#E4E4E7] rounded-xl p-6 sm:p-8 shadow-sm font-sans text-[#09090B]">
      {/* Header */}
      <div className="border-b border-[#F4F4F5] pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#09090B] tracking-tight">{data.name}</h1>
            <p className="text-sm font-semibold text-[#4F46E5] mt-0.5">{data.title}</p>
          </div>
          <Badge variant="indigo" size="sm" className="hidden sm:inline-flex gap-1">
            <Sparkles className="w-3 h-3" /> ATS Ready
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#52525B]">
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-[#A1A1AA]" /> {data.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#A1A1AA]" /> {data.phone}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#A1A1AA]" /> {data.location}
          </span>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#A1A1AA]" /> {data.website}
          </span>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] mb-2">
          Professional Summary
        </h2>
        <p className="text-xs text-[#52525B] leading-relaxed">{data.summary}</p>
      </div>

      {/* Work Experience */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] mb-3">
          Work Experience
        </h2>
        <div className="flex flex-col gap-5">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#09090B]">{exp.role}</span>
                <span className="text-[11px] text-[#A1A1AA]">{exp.period}</span>
              </div>
              <span className="text-xs font-medium text-[#4F46E5]">{exp.company}</span>
              <ul className="mt-1 flex flex-col gap-1 pl-4 list-disc text-xs text-[#52525B]">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Competencies */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] mb-2">
          Key Skills
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill, sIdx) => {
            const isMatch = highlightSkills.includes(skill);
            return (
              <span
                key={sIdx}
                className={`px-2 py-0.5 text-[11px] rounded font-medium ${
                  isMatch
                    ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                    : "bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]"
                }`}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
