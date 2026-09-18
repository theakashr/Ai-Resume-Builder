"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  label?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  className,
  label,
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
          {label}
        </span>
      )}
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border border-[#E4E4E7] bg-white cursor-pointer transition-all hover:border-[#D4D4D8]",
                isSelected && "border-[#4F46E5] bg-[#EEF2FF]/40 ring-1 ring-[#4F46E5]"
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange?.(opt.value)}
                className="sr-only"
              />
              <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border border-[#D4D4D8] bg-white transition-all flex items-center justify-center",
                    isSelected && "border-[#4F46E5]"
                  )}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#4F46E5]" />}
                </div>
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-medium text-[#09090B] leading-tight">{opt.label}</span>
                {opt.description && (
                  <span className="text-xs text-[#71717A] mt-0.5">{opt.description}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
