"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FullResumeState } from "./LiveResumePaperPreview";
import { Sparkles, Plus, Trash2, ChevronDown, ChevronUp, Check, RefreshCw } from "lucide-react";

export interface ExperienceFormProps {
  experience: FullResumeState["experience"];
  onChange: (updated: FullResumeState["experience"]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);
  const [enhancingIndex, setEnhancingIndex] = useState<{ expId: string; bulletIdx: number } | null>(null);
  const [aiBulletSuggestion, setAiBulletSuggestion] = useState<{
    expId: string;
    bulletIdx: number;
    text: string;
  } | null>(null);

  const handleUpdateExperience = (id: string, field: string, value: any) => {
    const updated = experience.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    onChange(updated);
  };

  const handleUpdateBullet = (expId: string, bulletIdx: number, text: string) => {
    const updated = experience.map((item) => {
      if (item.id === expId) {
        const newBullets = [...item.bullets];
        newBullets[bulletIdx] = text;
        return { ...item, bullets: newBullets };
      }
      return item;
    });
    onChange(updated);
  };

  const handleAddBullet = (expId: string) => {
    const updated = experience.map((item) => {
      if (item.id === expId) {
        return { ...item, bullets: [...item.bullets, "New key achievement or responsibility..."] };
      }
      return item;
    });
    onChange(updated);
  };

  const handleDeleteBullet = (expId: string, bulletIdx: number) => {
    const updated = experience.map((item) => {
      if (item.id === expId) {
        return { ...item, bullets: item.bullets.filter((_, idx) => idx !== bulletIdx) };
      }
      return item;
    });
    onChange(updated);
  };

  const handleAddExperience = () => {
    const newId = `exp-${Date.now()}`;
    const newItem = {
      id: newId,
      role: "Software / Product Role",
      company: "Company Name",
      period: "2024 — Present",
      bullets: ["Led development of key features resulting in measurable impact."],
    };
    onChange([...experience, newItem]);
    setExpandedId(newId);
  };

  const handleDeleteExperience = (id: string) => {
    onChange(experience.filter((item) => item.id !== id));
  };

  const handleAiBulletEnhance = (expId: string, bulletIdx: number, currentText: string) => {
    setEnhancingIndex({ expId, bulletIdx });
    setTimeout(() => {
      setAiBulletSuggestion({
        expId,
        bulletIdx,
        text: `Engineered and deployed scalable ${currentText.toLowerCase().replace(".", "")}, driving +28% performance improvement and reducing user bounce rate.`,
      });
      setEnhancingIndex(null);
    }, 700);
  };

  const handleAcceptAiBullet = () => {
    if (aiBulletSuggestion) {
      handleUpdateBullet(aiBulletSuggestion.expId, aiBulletSuggestion.bulletIdx, aiBulletSuggestion.text);
      setAiBulletSuggestion(null);
    }
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
          Work Experience ({experience.length})
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddExperience}
          leftIcon={<Plus className="w-3.5 h-3.5 text-[#4F46E5]" />}
          className="text-xs"
        >
          Add Experience
        </Button>
      </div>

      <div className="space-y-3">
        {experience.map((exp) => {
          const isExpanded = expandedId === exp.id;
          return (
            <div
              key={exp.id}
              className="border border-[#E4E4E7] rounded-xl bg-white overflow-hidden transition-all"
            >
              {/* Item Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                className="p-3.5 bg-[#FAF9F6] flex items-center justify-between cursor-pointer hover:bg-[#F4F4F5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#09090B]">{exp.role || "Untitled Role"}</span>
                  <span className="text-xs text-[#71717A]">• {exp.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#A1A1AA]">{exp.period}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#71717A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#71717A]" />
                  )}
                </div>
              </div>

              {/* Item Body */}
              {isExpanded && (
                <div className="p-4 space-y-4 border-t border-[#F4F4F5]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Role / Title"
                      value={exp.role}
                      onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)}
                    />
                    <Input
                      label="Company Name"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                    />
                    <Input
                      label="Period / Dates"
                      value={exp.period}
                      onChange={(e) => handleUpdateExperience(exp.id, "period", e.target.value)}
                    />
                  </div>

                  {/* Bullet Points List */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
                        Key Achievements & Bullets
                      </span>
                      <button
                        onClick={() => handleAddBullet(exp.id)}
                        className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {exp.bullets.map((bText, bIdx) => {
                      const isEnhancingThis =
                        enhancingIndex?.expId === exp.id && enhancingIndex?.bulletIdx === bIdx;
                      const hasAiSuggestion =
                        aiBulletSuggestion?.expId === exp.id && aiBulletSuggestion?.bulletIdx === bIdx;

                      return (
                        <div key={bIdx} className="space-y-2">
                          <div className="flex items-start gap-2">
                            <textarea
                              value={bText}
                              onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                              rows={2}
                              className="flex-1 p-2 bg-white border border-[#E4E4E7] rounded-lg text-xs text-[#09090B] focus:border-[#4F46E5] focus:outline-none"
                            />
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                isLoading={isEnhancingThis}
                                onClick={() => handleAiBulletEnhance(exp.id, bIdx, bText)}
                                title="AI Rewrite & Quantify"
                                className="h-7 px-2 text-[11px] text-[#4F46E5] border-[#E0E7FF] hover:bg-[#EEF2FF]"
                              >
                                <Sparkles className="w-3 h-3" />
                              </Button>
                              <button
                                onClick={() => handleDeleteBullet(exp.id, bIdx)}
                                className="p-1 text-[#A1A1AA] hover:text-[#EF4444] rounded transition-colors self-center"
                                title="Delete Bullet"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Embedded AI Bullet Suggestion Banner */}
                          {hasAiSuggestion && (
                            <div className="p-3 bg-[#EEF2FF]/80 border border-[#E0E7FF] rounded-lg space-y-2 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-[#4F46E5] flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5" /> Quantified AI Bullet Recommendation
                                </span>
                                <Badge variant="indigo" size="sm">
                                  +14% ATS Score
                                </Badge>
                              </div>
                              <p className="text-[#09090B] italic bg-white p-2 rounded border border-[#E0E7FF]">
                                "{aiBulletSuggestion.text}"
                              </p>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setAiBulletSuggestion(null)}
                                  className="h-7 px-2 text-[11px]"
                                >
                                  Dismiss
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAiBulletEnhance(exp.id, bIdx, bText)}
                                  leftIcon={<RefreshCw className="w-3 h-3" />}
                                  className="h-7 px-2 text-[11px]"
                                >
                                  Try Again
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={handleAcceptAiBullet}
                                  leftIcon={<Check className="w-3 h-3" />}
                                  className="h-7 px-2 text-[11px]"
                                >
                                  Accept Bullet
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2 border-t border-[#F4F4F5]">
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="text-xs text-[#EF4444] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Experience Block
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
