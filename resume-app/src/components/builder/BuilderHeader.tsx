import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressBar";
import { ArrowLeft, Save, Download, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export interface BuilderHeaderProps {
  onSave?: () => void;
  onDownloadPdf?: () => void;
  templateStyle?: "modern" | "executive" | "minimalist" | "creative";
  onTemplateStyleChange?: (style: "modern" | "executive" | "minimalist" | "creative") => void;
  docName?: string;
  onDocNameChange?: (name: string) => void;
  saveStatus?: "saved" | "saving" | "failed" | "unsaved";
  saveStatusMessage?: string;
  isDownloadingPdf?: boolean;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  onSave,
  onDownloadPdf,
  templateStyle = "modern",
  onTemplateStyleChange,
  docName = "My Resume Draft",
  onDocNameChange,
  saveStatus = "saved",
  saveStatusMessage,
  isDownloadingPdf = false,
}) => {
  const templates: Array<{ id: "modern" | "executive" | "minimalist" | "creative"; name: string }> = [
    { id: "modern", name: "Modern Tech" },
    { id: "executive", name: "Executive" },
    { id: "minimalist", name: "Minimalist" },
    { id: "creative", name: "Creative" },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E4E4E7] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left: Back Link & Editable Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-1.5 rounded-lg text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5] transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={docName}
            onChange={(e) => onDocNameChange?.(e.target.value)}
            placeholder="Resume Title"
            className="text-sm font-bold text-[#09090B] bg-transparent border border-transparent hover:border-[#E4E4E7] focus:border-[#4F46E5] focus:bg-white rounded px-2 py-1 transition-all focus:outline-none max-w-[180px] sm:max-w-xs truncate"
          />

          {saveStatus === "saving" && (
            <span className="text-[11px] text-[#4F46E5] flex items-center gap-1.5 font-medium hidden sm:inline-flex">
              <Loader2 className="w-3 h-3 animate-spin text-[#4F46E5]" /> {saveStatusMessage || "Saving..."}
            </span>
          )}

          {saveStatus === "saved" && (
            <span className="text-[11px] text-[#059669] flex items-center gap-1 font-medium hidden sm:inline-flex">
              <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> {saveStatusMessage || "Saved just now"}
            </span>
          )}

          {saveStatus === "failed" && (
            <button
              onClick={onSave}
              className="text-[11px] text-[#DC2626] hover:underline flex items-center gap-1 font-semibold hidden sm:inline-flex cursor-pointer"
            >
              <AlertCircle className="w-3 h-3 text-[#EF4444]" /> {saveStatusMessage || "Save failed — Retry"}
            </button>
          )}

          {saveStatus === "unsaved" && (
            <span className="text-[11px] text-[#D97706] font-medium hidden sm:inline-flex">
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Center: Template Picker & Resume Health Meter */}
      <div className="hidden lg:flex items-center gap-4 bg-[#FAF9F6] border border-[#E4E4E7] px-3.5 py-1.5 rounded-xl">
        <div className="flex items-center gap-1 bg-white border border-[#E4E4E7] p-1 rounded-lg">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTemplateStyleChange?.(t.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                templateStyle === t.id
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-[#E4E4E7]" />

        <div className="flex items-center gap-2">
          <ProgressRing score={88} size={36} strokeWidth={4} />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#09090B]">88% Strength</span>
            <span className="text-[10px] text-[#71717A]">Grade A Resume</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          isLoading={saveStatus === "saving"}
          leftIcon={<Save className="w-3.5 h-3.5" />}
          className="text-xs hidden sm:inline-flex font-semibold"
        >
          Save Draft
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onDownloadPdf}
          isLoading={isDownloadingPdf}
          leftIcon={<Download className="w-4 h-4" />}
          className="font-semibold shadow-xs text-xs px-4"
        >
          {isDownloadingPdf ? "Generating PDF..." : "Download PDF"}
        </Button>
      </div>
    </header>
  );
};
