"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export interface RecommendationItem {
  id: string;
  title: string;
  category: string;
  whyItMatters: string;
  impactBadge: "High" | "Medium";
  suggestedAction: string;
  targetSection: string;
}

export const mockRecommendations: RecommendationItem[] = [
  {
    id: "rec-1",
    title: "Inject missing GraphQL & CI/CD keywords into experience bullets",
    category: "Technical Skill Alignment",
    whyItMatters:
      "Stripe's job posting mentions GraphQL and CI/CD deployment pipelines 4 times as core requirements. Adding these keywords boosts ATS parsing match by +8%.",
    impactBadge: "High",
    suggestedAction: "Optimize Experience Bullets",
    targetSection: "experience",
  },
  {
    id: "rec-2",
    title: "Align Professional Summary with Senior Design System Governance terms",
    category: "Summary Optimization",
    whyItMatters:
      "Recruiter screening algorithms prioritize resumes with explicit governance and multi-team lead experience in the top 3 lines.",
    impactBadge: "High",
    suggestedAction: "Optimize Summary",
    targetSection: "summary",
  },
  {
    id: "rec-3",
    title: "Quantify achievements in Vanguard Systems role",
    category: "Metric Quantification",
    whyItMatters:
      "Bullet points without quantitative metrics (percentages, revenue, team velocity) score 15% lower on recruiter readability indexes.",
    impactBadge: "Medium",
    suggestedAction: "Quantify Metrics",
    targetSection: "experience",
  },
];

export interface AiRecommendationListProps {
  recommendations?: RecommendationItem[];
  onOptimizeClick?: (section: string) => void;
}

export const AiRecommendationList: React.FC<AiRecommendationListProps> = ({
  recommendations = mockRecommendations,
  onOptimizeClick,
}) => {
  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4F46E5]" />
            <CardTitle className="text-base font-semibold">Actionable AI Improvement Recommendations</CardTitle>
          </div>
          <Badge variant="indigo" size="sm">
            {recommendations.length} Actionable Items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 bg-[#FAF9F6] border border-[#E4E4E7] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D4D4D8] transition-colors"
          >
            <div className="space-y-1.5 text-left max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#09090B]">{rec.title}</span>
                <Badge variant={rec.impactBadge === "High" ? "error" : "warning"} size="sm">
                  {rec.impactBadge} Priority
                </Badge>
              </div>

              <div className="p-2.5 bg-white border border-[#E4E4E7] rounded-lg text-xs text-[#52525B] flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#09090B] block mb-0.5">Why this matters:</span>
                  <span>{rec.whyItMatters}</span>
                </div>
              </div>
            </div>

            <Link href="/dashboard/resumes/builder" className="shrink-0 self-end sm:self-auto">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOptimizeClick?.(rec.targetSection)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="font-semibold text-xs shadow-2xs"
              >
                {rec.suggestedAction}
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
