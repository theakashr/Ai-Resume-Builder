"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check, Plus, AlertCircle, Sparkles } from "lucide-react";

export interface KeywordBreakdownProps {
  matchedKeywords?: string[];
  missingKeywords?: string[];
  recommendedKeywords?: { name: string; priority: "High" | "Medium" }[];
  onAddKeyword?: (keyword: string) => void;
}

export const KeywordBreakdown: React.FC<KeywordBreakdownProps> = ({
  matchedKeywords = [
    "React",
    "TypeScript",
    "Design Systems",
    "Tailwind CSS",
    "Figma",
    "User Research",
    "A/B Testing",
    "WCAG 2.1 AA",
    "Component Architecture",
  ],
  missingKeywords = ["GraphQL", "CI/CD Pipeline", "Kubernetes", "OKRs"],
  recommendedKeywords = [
    { name: "GraphQL", priority: "High" },
    { name: "CI/CD Pipeline", priority: "High" },
    { name: "Design System Governance", priority: "Medium" },
    { name: "OKRs", priority: "Medium" },
  ],
  onAddKeyword,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<"all" | "hard" | "soft" | "tools">("all");

  // Keyword categorization mock mapping
  const categorizedMatched = matchedKeywords.filter((kw) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "hard") return ["React", "TypeScript", "WCAG 2.1 AA", "Component Architecture"].includes(kw);
    if (activeCategory === "soft") return ["User Research", "A/B Testing"].includes(kw);
    if (activeCategory === "tools") return ["Figma", "Tailwind CSS", "Design Systems"].includes(kw);
    return true;
  });

  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">Keyword Heatmap & Density Analysis</CardTitle>
            <p className="text-xs text-[#71717A]">Optimized for ATS parser algorithm score density</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              {matchedKeywords.length} Matched
            </Badge>
            <Badge variant="warning" size="sm">
              {missingKeywords.length} Missing
            </Badge>
            <Badge variant="indigo" size="sm">
              Density Score: 8.4/10
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-5">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#F4F4F5] pb-3">
          {[
            { id: "all", label: "All Categories" },
            { id: "hard", label: "Hard Skills" },
            { id: "soft", label: "Soft Skills & Leadership" },
            { id: "tools", label: "Tools & Frameworks" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#4F46E5] text-white shadow-2xs"
                  : "bg-[#F4F4F5] text-[#52525B] hover:bg-[#E4E4E7]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Matched Keywords */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#059669] mb-2.5 flex items-center gap-1.5">
            <Check className="w-4 h-4 stroke-[3]" /> Matched Job Keywords ({categorizedMatched.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {categorizedMatched.map((kw, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-medium"
              >
                <Check className="w-3 h-3 stroke-[3]" />
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D97706] mb-2.5 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Missing Target Job Keywords ({missingKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw, idx) => (
              <button
                key={idx}
                onClick={() => onAddKeyword?.(kw)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] hover:bg-[#FEF3C7] font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Recommended Keywords */}
        <div className="p-3.5 bg-[#EEF2FF]/60 border border-[#E0E7FF] rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-[#4F46E5] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> High-Impact Recommended Additions
          </h4>
          <div className="flex flex-wrap gap-2 pt-1">
            {recommendedKeywords.map((rec, idx) => (
              <div
                key={idx}
                onClick={() => onAddKeyword?.(rec.name)}
                className="px-3 py-1 bg-white border border-[#E0E7FF] rounded-lg flex items-center gap-2 text-xs font-semibold text-[#09090B] cursor-pointer hover:border-[#4F46E5] transition-colors shadow-2xs"
              >
                <span>{rec.name}</span>
                <Badge variant={rec.priority === "High" ? "error" : "warning"} size="sm">
                  {rec.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
