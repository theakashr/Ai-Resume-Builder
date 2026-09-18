"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FullResumeState } from "./LiveResumePaperPreview";
import { Plus, Trash2 } from "lucide-react";

export interface EducationFormProps {
  education: FullResumeState["education"];
  onChange: (education: FullResumeState["education"]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  const handleUpdate = (id: string, field: string, value: string) => {
    const updated = education.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    onChange(updated);
  };

  const handleAdd = () => {
    const newItem = {
      id: `edu-${Date.now()}`,
      degree: "B.S. in Computer Science",
      institution: "University Name",
      year: "2018 — 2022",
    };
    onChange([...education, newItem]);
  };

  const handleDelete = (id: string) => {
    onChange(education.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
          Education ({education.length})
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          leftIcon={<Plus className="w-3.5 h-3.5 text-[#4F46E5]" />}
          className="text-xs"
        >
          Add Education
        </Button>
      </div>

      <div className="space-y-3">
        {education.map((edu) => (
          <div key={edu.id} className="p-3.5 bg-white border border-[#E4E4E7] rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#09090B]">{edu.degree || "Degree Title"}</span>
              <button
                onClick={() => handleDelete(edu.id)}
                className="text-[#A1A1AA] hover:text-[#EF4444] p-1 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Degree / Major"
                value={edu.degree}
                onChange={(e) => handleUpdate(edu.id, "degree", e.target.value)}
              />
              <Input
                label="University / Institution"
                value={edu.institution}
                onChange={(e) => handleUpdate(edu.id, "institution", e.target.value)}
              />
              <Input
                label="Year / Graduation Date"
                value={edu.year}
                onChange={(e) => handleUpdate(edu.id, "year", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
