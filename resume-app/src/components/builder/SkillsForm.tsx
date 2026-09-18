"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, X, Sparkles } from "lucide-react";

export interface SkillsFormProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onChange }) => {
  const [newSkill, setNewSkill] = useState("");
  const recommendedMissing = ["GraphQL", "CI/CD Pipeline", "Kubernetes", "OKRs", "A/B Testing"];

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
          Skills & Competencies ({skills.length})
        </span>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type a skill and press Enter..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSkill(newSkill);
            }
          }}
          className="h-9 text-xs"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleAddSkill(newSkill)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="h-9 text-xs"
        >
          Add
        </Button>
      </div>

      {/* Active Skills Cloud */}
      <div className="flex flex-wrap gap-1.5 p-3 bg-[#FAF9F6] border border-[#E4E4E7] rounded-xl min-h-[50px]">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-white border border-[#E4E4E7] text-[#09090B] font-medium shadow-2xs"
          >
            {skill}
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="text-[#A1A1AA] hover:text-[#EF4444] transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Recommended Missing Keywords */}
      <div className="p-3 bg-[#EEF2FF]/60 border border-[#E0E7FF] rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between font-bold text-[#4F46E5]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Recommended Target Job Keywords
          </span>
          <Badge variant="indigo" size="sm">
            +8% ATS Score
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {recommendedMissing.map((kw, i) => {
            const isAdded = skills.includes(kw);
            if (isAdded) return null;
            return (
              <button
                key={i}
                onClick={() => handleAddSkill(kw)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-white text-[#D97706] border border-[#FDE68A] hover:bg-[#FFFBEB] font-medium transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-3 h-3" /> {kw}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
