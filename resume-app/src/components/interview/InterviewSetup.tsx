"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Mic, Sparkles, ArrowRight, Video, Clock, FileText, Briefcase, HelpCircle } from "lucide-react";

export interface InterviewConfig {
  role: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  questionsCount: number;
  resumeId?: string;
  jobDescription?: string;
  hasCamera?: boolean;
  hasMic?: boolean;
}

export interface InterviewSetupProps {
  onStartInterview: (config: InterviewConfig) => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartInterview }) => {
  const [role, setRole] = useState("Software Developer");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [interviewType, setInterviewType] = useState("Mixed");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionsCount, setQuestionsCount] = useState<number>(30);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumesList, setResumesList] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load resumes from local storage / API
    try {
      const mockResumesRaw = localStorage.getItem("mock_resumes") || "[]";
      const parsed = JSON.parse(mockResumesRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const options = parsed.map((r: any) => ({
          label: `${r.title || 'Untitled Resume'} (ATS ${r.ats_score || 85}%)`,
          value: r.id,
        }));
        setResumesList(options);
        setSelectedResumeId(options[0].value);
      } else {
        setResumesList([
          { label: "Default Full-Stack Developer Resume", value: "res_default_01" }
        ]);
        setSelectedResumeId("res_default_01");
      }
    } catch {
      setResumesList([
        { label: "Default Full-Stack Developer Resume", value: "res_default_01" }
      ]);
      setSelectedResumeId("res_default_01");
    }
  }, []);

  const experienceOptions = [
    { label: "Student / Intern", value: "Student" },
    { label: "Entry Level (0 - 2 yrs)", value: "Entry Level" },
    { label: "Mid Level (2 - 5 yrs)", value: "Mid Level" },
    { label: "Senior / Lead (5+ yrs)", value: "Senior Level" },
  ];

  const typeOptions = [
    { label: "Mixed Full Interview (Recommended)", value: "Mixed", description: "Balanced mix of Technical, Behavioral, Situational & Resume deep-dives." },
    { label: "Technical & System Architecture", value: "Technical", description: "System design, code architecture, and problem solving." },
    { label: "Behavioral & STAR Method", value: "Behavioral", description: "Leadership, teamwork, conflict resolution, and metrics." },
    { label: "HR & Culture Fit", value: "HR", description: "Career outlook, background, and cultural alignment." },
  ];

  const questionCountOptions = [
    { label: "30 Questions (Standard)", value: 30, desc: "~30-40 min full simulation" },
    { label: "35 Questions (Extended)", value: 35, desc: "~45 min deep practice" },
    { label: "40 Questions (Mastery)", value: 40, desc: "~60 min comprehensive" },
  ];

  const difficultyOptions = [
    { label: "Easy", value: "Easy" },
    { label: "Medium", value: "Medium" },
    { label: "Hard", value: "Hard" },
    { label: "Adaptive", value: "Adaptive" },
  ];

  return (
    <Card className="border-[#E4E4E7] bg-white shadow-xs">
      <CardHeader className="pb-4 border-b border-[#F4F4F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-[#09090B] tracking-tight">
                AI Mock Interview Setup
              </CardTitle>
              <p className="text-xs text-[#71717A]">
                Configure personalized 30+ question role simulation
              </p>
            </div>
          </div>
          <Badge variant="indigo" size="sm" className="hidden sm:flex">
            <Sparkles className="w-3 h-3 mr-1" /> 30+ Personalized Questions
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Target Job Role & Experience Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Target Job Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Full-Stack Developer, Product Designer"
            required
          />
          <Select
            label="Experience Level"
            options={experienceOptions}
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          />
        </div>

        {/* Select Resume & Paste Job Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#4F46E5]" /> Select Resume Context
            </label>
            <Select
              options={resumesList}
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#4F46E5]" /> Job Description Context (Optional)
            </label>
            <textarea
              rows={2}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job description to customize questions to job requirements..."
              className="w-full p-2.5 rounded-lg border border-[#E4E4E7] bg-white text-xs text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]"
            />
          </div>
        </div>

        {/* Interview Type Selection */}
        <div className="space-y-2">
          <RadioGroup
            name="interview-type"
            label="Select Interview Focus Area"
            options={typeOptions}
            selectedValue={interviewType}
            onChange={setInterviewType}
          />
        </div>

        {/* Question Count Selection (Minimum 30) */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#4F46E5]" /> Number of Primary Questions (Min. 30)
          </span>
          <div className="grid grid-cols-3 gap-3">
            {questionCountOptions.map((opt) => {
              const isSelected = questionsCount === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setQuestionsCount(opt.value)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs"
                      : "bg-white text-[#52525B] border-[#E4E4E7] hover:border-[#D4D4D8]"
                  }`}
                >
                  <div className="text-sm font-bold">{opt.label}</div>
                  <div className={`text-2xs mt-0.5 ${isSelected ? "text-white/80" : "text-[#71717A]"}`}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
            Select Question Difficulty
          </span>
          <div className="grid grid-cols-4 gap-3">
            {difficultyOptions.map((opt) => {
              const isSelected = difficulty === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDifficulty(opt.value)}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                    isSelected
                      ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-2xs"
                      : "bg-white text-[#52525B] border-[#E4E4E7] hover:border-[#D4D4D8]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Session Summary Banner */}
        <div className="p-4 bg-[#FAF9F6] border border-[#E4E4E7] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#09090B] font-bold">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4F46E5]" />
              Interview Summary: {questionsCount} Primary Questions
            </span>
            <span className="text-[#10B981] font-semibold flex items-center gap-1">
              <Video className="w-3.5 h-3.5" /> Webcam & Voice Enabled
            </span>
          </div>
          <p className="text-xs text-[#52525B] leading-relaxed">
            Your interview will contain at least {questionsCount} personalized questions tailored to your selected resume and job role. Includes real-time voice synthesis, microphone capture, posture coaching, and comprehensive report generation.
          </p>
        </div>

        {/* Start Action */}
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() =>
              onStartInterview({
                role,
                experienceLevel,
                interviewType,
                difficulty,
                questionsCount,
                resumeId: selectedResumeId,
                jobDescription,
              })
            }
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto font-bold px-8 shadow-xs py-3"
          >
            Start {questionsCount}-Question Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
