"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { LayoutTemplate, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Star } from "lucide-react";

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  atsScore: number;
  isPopular?: boolean;
  colorHex: string;
}

const templatesCatalog: TemplateItem[] = [
  {
    id: "executive-clean",
    name: "Executive Clean",
    category: "Executive & Management",
    description: "Classic typography, crisp line dividers, and high-density recruiter readability.",
    atsScore: 98,
    isPopular: true,
    colorHex: "#4F46E5",
  },
  {
    id: "tech-specialist",
    name: "Tech Specialist",
    category: "Software & Data Science",
    description: "Optimized for GitHub links, technical skills grouping, and project metrics.",
    atsScore: 95,
    isPopular: true,
    colorHex: "#059669",
  },
  {
    id: "minimalist-mono",
    name: "Minimalist Mono",
    category: "Design & Product",
    description: "Monospaced sub-headers, generous whitespace, and elegant clean hierarchy.",
    atsScore: 92,
    colorHex: "#7C3AED",
  },
  {
    id: "modern-tech",
    name: "Modern Tech",
    category: "Engineering & Operations",
    description: "Vibrant accent highlights with side-by-side core competence tags.",
    atsScore: 94,
    colorHex: "#2563EB",
  },
  {
    id: "creative-bold",
    name: "Creative Bold",
    category: "Marketing & Strategy",
    description: "Bold header profile layout with distinct visual callouts for key achievements.",
    atsScore: 90,
    colorHex: "#D97706",
  },
  {
    id: "ats-standard",
    name: "ATS Universal Standard",
    category: "All Industries",
    description: "Guaranteed 100% Workday & Taleo parser compliance with plain formatting.",
    atsScore: 100,
    isPopular: true,
    colorHex: "#111827",
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setToastMessage(`Selected template "${templateId}". Opening Resume Builder...`);
    setTimeout(() => {
      router.push(`/dashboard/resumes/builder?template=${templateId}`);
    }, 500);
  };

  return (
    <div className="space-y-6 bg-[#FAF9F6]">
      {/* Page Title & Eyebrow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-xs font-semibold text-[#4F46E5] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruiter-Approved Templates</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#09090B] tracking-tight">Resume Templates Catalog</h1>
          <p className="text-xs text-[#52525B]">
            Select an ATS-tested layout to format your resume content instantly.
          </p>
        </div>

        <Link href="/dashboard/resumes/builder">
          <Button variant="outline" size="sm" className="font-bold">
            Skip to Builder
          </Button>
        </Link>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templatesCatalog.map((tmpl) => (
          <Card
            key={tmpl.id}
            className={`border-[#E4E4E7] bg-white transition-all flex flex-col justify-between shadow-xs hover:shadow-md relative overflow-hidden group ${
              selectedTemplate === tmpl.id ? "ring-2 ring-[#4F46E5] border-[#4F46E5]" : ""
            }`}
          >
            {/* Visual Thumbnail Banner */}
            <div className="h-32 bg-[#FAF9F6] border-b border-[#F4F4F5] p-4 flex flex-col justify-between relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-xl pointer-events-none"
                style={{ backgroundColor: tmpl.colorHex }}
              />
              <div className="flex items-center justify-between z-10">
                <span className="text-[11px] font-bold text-[#52525B] px-2 py-0.5 bg-white border border-[#E4E4E7] rounded-md shadow-2xs">
                  {tmpl.category}
                </span>
                {tmpl.isPopular && (
                  <Badge variant="indigo" size="sm" className="flex items-center gap-1 font-bold">
                    <Star className="w-3 h-3 fill-[#4F46E5]" /> Popular
                  </Badge>
                )}
              </div>

              {/* Sample Resume Header Simulation */}
              <div className="bg-white p-2.5 rounded-lg border border-[#E4E4E7] shadow-2xs space-y-1.5 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="h-2.5 bg-[#09090B] rounded w-2/3" />
                <div className="h-2 bg-[#A1A1AA] rounded w-1/2" />
              </div>
            </div>

            {/* Content Details */}
            <CardHeader className="pb-2 pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-[#09090B]">{tmpl.name}</CardTitle>
                <Badge variant="success" size="sm" className="font-semibold">
                  {tmpl.atsScore}% ATS
                </Badge>
              </div>
              <p className="text-xs text-[#52525B] leading-relaxed pt-1">{tmpl.description}</p>
            </CardHeader>

            <CardContent className="pt-2 pb-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleSelect(tmpl.id)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full font-bold shadow-xs py-2.5 text-xs mt-2"
              >
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <Toast
            type="success"
            title="Template Selected"
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}
    </div>
  );
}
