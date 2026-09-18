"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FileText, Edit3, Eye, Sparkles, Plus, Clock } from "lucide-react";

export interface ResumeItem {
  id: string;
  name: string;
  targetRole: string;
  lastEdited: string;
  atsScore: number;
  templateName: string;
}

export const mockResumes: ResumeItem[] = [
  {
    id: "res-1",
    name: "Alex_Morgan_Product_Design_2026",
    targetRole: "Senior / Staff Product Designer",
    lastEdited: "12 mins ago",
    atsScore: 92,
    templateName: "Executive Clean",
  },
  {
    id: "res-2",
    name: "Alex_Morgan_Frontend_Architect",
    targetRole: "Lead Frontend Engineer",
    lastEdited: "2 days ago",
    atsScore: 88,
    templateName: "Modern Tech",
  },
  {
    id: "res-3",
    name: "Alex_Morgan_General_Tech",
    targetRole: "UI/UX Systems Architect",
    lastEdited: "1 week ago",
    atsScore: 78,
    templateName: "Minimalist Mono",
  },
];

export interface RecentResumesGridProps {
  resumes?: ResumeItem[];
  onCreateNew?: () => void;
  onEdit?: (id: string) => void;
  onPreview?: (id: string) => void;
}

export const RecentResumesGrid: React.FC<RecentResumesGridProps> = ({
  resumes = mockResumes,
  onCreateNew,
  onEdit,
  onPreview,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#09090B]">My Resumes</h3>
          <p className="text-xs text-[#71717A]">3 active tailored versions created</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateNew}
          leftIcon={<Plus className="w-3.5 h-3.5 text-[#4F46E5]" />}
        >
          Create Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resumes.map((res) => (
          <Card key={res.id} className="border-[#E4E4E7] bg-white hover:border-[#D4D4D8] transition-all flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-[#F4F4F5]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#EEF2FF] text-[#4F46E5] shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="text-xs font-bold text-[#09090B] truncate max-w-[140px]" title={res.name}>
                      {res.name}
                    </h4>
                    <span className="text-[11px] text-[#4F46E5] font-medium mt-0.5">{res.targetRole}</span>
                  </div>
                </div>
                <Badge
                  variant={res.atsScore >= 90 ? "success" : res.atsScore >= 80 ? "indigo" : "warning"}
                  size="sm"
                >
                  {res.atsScore}% ATS
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-3 pb-4 space-y-3">
              <div className="flex justify-between items-center text-[11px] text-[#71717A]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#A1A1AA]" /> Edited {res.lastEdited}
                </span>
                <span className="font-medium text-[#52525B]">{res.templateName}</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#F4F4F5]">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEdit?.(res.id)}
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  className="flex-1 text-xs"
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onPreview?.(res.id)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
