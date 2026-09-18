"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Check, RefreshCw, X } from "lucide-react";

export interface SummaryFormProps {
  summary: string;
  onChange: (summary: string) => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ summary, onChange }) => {
  const [isImproving, setIsImproving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const handleImproveWithAi = () => {
    setIsImproving(true);
    setTimeout(() => {
      setAiSuggestion(
        "Results-oriented Senior Product Designer & Frontend Engineer with 7+ years driving design system adoption and CRO for high-growth enterprise SaaS platforms. Proven track record boosting user retention (+18%) and accelerating engineering velocity by 42% through accessible component architectures."
      );
      setIsImproving(false);
    }, 700);
  };

  const handleAcceptAi = () => {
    if (aiSuggestion) {
      onChange(aiSuggestion);
      setAiSuggestion(null);
    }
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
          Professional Summary
        </span>
        <Button
          variant="outline"
          size="sm"
          isLoading={isImproving}
          onClick={handleImproveWithAi}
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />}
          className="text-[#4F46E5] border-[#E0E7FF] hover:bg-[#EEF2FF] text-xs font-medium"
        >
          Improve with AI
        </Button>
      </div>

      <Textarea
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Write a concise 2-3 sentence overview highlighting your background, key technical strengths, and measurable impact..."
        helperText="Tip: Keep summary under 300 characters for optimal recruiter scanning."
      />

      {/* Embedded AI Suggestion Banner */}
      {aiSuggestion && (
        <div className="p-4 bg-[#EEF2FF]/70 border border-[#E0E7FF] rounded-xl space-y-3 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F46E5]">
              <Sparkles className="w-4 h-4" /> Embedded AI Suggestion
            </div>
            <Badge variant="indigo" size="sm">
              High Impact Phrasing
            </Badge>
          </div>

          <p className="text-xs text-[#09090B] leading-relaxed italic bg-white p-3 rounded-lg border border-[#E0E7FF]">
            "{aiSuggestion}"
          </p>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAiSuggestion(null)}
              leftIcon={<X className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Dismiss
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImproveWithAi}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Try Again
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAcceptAi}
              leftIcon={<Check className="w-3.5 h-3.5" />}
              className="text-xs font-semibold"
            >
              Accept Suggestion
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
