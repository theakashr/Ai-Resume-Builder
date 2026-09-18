"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepItem {
  id: string | number;
  label: string;
  description?: string;
}

export interface ProgressIndicatorProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn("w-full py-2", className)}>
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-0 top-4 right-0 h-0.5 bg-[#E4E4E7] -z-0" />
        
        {/* Active track line */}
        <div
          className="absolute left-0 top-4 h-0.5 bg-[#4F46E5] transition-all duration-300 -z-0"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.id}
              onClick={() => isCompleted && onStepClick?.(idx)}
              className={cn(
                "flex flex-col items-center gap-1.5 z-10 group select-none",
                isCompleted ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all bg-white",
                  isCompleted
                    ? "border-[#4F46E5] bg-[#4F46E5] text-white"
                    : isCurrent
                    ? "border-[#4F46E5] text-[#4F46E5] ring-4 ring-[#EEF2FF]"
                    : "border-[#E4E4E7] text-[#71717A]"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <div className="text-center hidden sm:block">
                <p
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isCurrent ? "text-[#09090B] font-bold" : isCompleted ? "text-[#52525B]" : "text-[#A1A1AA]"
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
