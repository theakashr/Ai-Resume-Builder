"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Sparkles, Target, Zap, FileText } from "lucide-react";

export interface JobDescriptionInputProps {
  onAnalyze: (jobText: string, resumeId: string) => void;
  isAnalyzing?: boolean;
}

export const sampleJobPosting = `Stripe is hiring a Senior Product Designer & Design Systems Engineer.

Key Responsibilities:
- Architect and maintain enterprise React design systems adopted across 15+ frontend micro-applications.
- Collaborate closely with product managers and engineers to establish UI component accessibility standards (WCAG 2.1 AA).
- Utilize GraphQL APIs to power dynamic financial dashboard UI components.
- Implement CI/CD pipelines for component library npm deployment and automated visual regression testing.
- Define design system governance and quarterly OKRs to measure developer velocity.

Requirements:
- 5+ years of experience building design systems with React, TypeScript, and Tailwind CSS.
- Demonstrated experience with GraphQL, CI/CD, component accessibility, and A/B testing frameworks.`;

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onAnalyze,
  isAnalyzing = false,
}) => {
  const [selectedResume, setSelectedResume] = useState("res-1");
  const [jobText, setJobText] = useState(sampleJobPosting);

  const resumeOptions = [
    { label: "Alex_Morgan_Senior_Product_Designer_2026.pdf (Primary)", value: "res-1" },
    { label: "Alex_Morgan_Frontend_Architect.pdf", value: "res-2" },
    { label: "Alex_Morgan_General_Tech.pdf", value: "res-3" },
  ];

  const handleLoadSample = () => {
    setJobText(sampleJobPosting);
  };

  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#4F46E5]" />
            <CardTitle className="text-base font-semibold">Job Posting Analysis Input</CardTitle>
          </div>
          <button
            onClick={handleLoadSample}
            className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5" /> Load Stripe Sample Job Description
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <Select
              label="1. Select Resume Version"
              options={resumeOptions}
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
            />
          </div>
          <div className="sm:col-span-7 flex items-end">
            <p className="text-xs text-[#71717A] pb-2">
              Selected: <strong>92% Base ATS Score</strong> • Updated 12 mins ago
            </p>
          </div>
        </div>

        <Textarea
          label="2. Paste Target Job Description"
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          rows={6}
          placeholder="Paste the full job posting requirements, responsibilities, and qualifications here..."
          helperText="Tip: Include both responsibilities and qualifications sections for maximum keyword accuracy."
        />

        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            size="lg"
            isLoading={isAnalyzing}
            onClick={() => onAnalyze(jobText, selectedResume)}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="font-semibold shadow-xs px-6 w-full sm:w-auto"
          >
            Analyze Resume vs. Job Posting
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
