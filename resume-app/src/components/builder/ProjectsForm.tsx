"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FullResumeState } from "./LiveResumePaperPreview";
import { Plus, Trash2 } from "lucide-react";

export interface ProjectsFormProps {
  projects: FullResumeState["projects"];
  onChange: (projects: FullResumeState["projects"]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects, onChange }) => {
  const handleUpdate = (id: string, field: string, value: string) => {
    const updated = projects.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    onChange(updated);
  };

  const handleAdd = () => {
    const newItem = {
      id: `proj-${Date.now()}`,
      title: "Project Title",
      description: "Brief summary of tech stack, user impact, or live URL...",
      link: "github.com/username/project",
    };
    onChange([...projects, newItem]);
  };

  const handleDelete = (id: string) => {
    onChange(projects.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
          Featured Projects ({projects.length})
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          leftIcon={<Plus className="w-3.5 h-3.5 text-[#4F46E5]" />}
          className="text-xs"
        >
          Add Project
        </Button>
      </div>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div key={proj.id} className="p-3.5 bg-white border border-[#E4E4E7] rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#09090B]">{proj.title || "Project Title"}</span>
              <button
                onClick={() => handleDelete(proj.id)}
                className="text-[#A1A1AA] hover:text-[#EF4444] p-1 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Project Title"
                value={proj.title}
                onChange={(e) => handleUpdate(proj.id, "title", e.target.value)}
              />
              <Input
                label="Repository / Demo URL"
                value={proj.link}
                onChange={(e) => handleUpdate(proj.id, "link", e.target.value)}
              />
            </div>
            <Textarea
              label="Description & Achievements"
              value={proj.description}
              onChange={(e) => handleUpdate(proj.id, "description", e.target.value)}
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
