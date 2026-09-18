"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-[#52525B]"
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-10 pl-3.5 pr-10 bg-white border border-[#E4E4E7] rounded-lg text-sm text-[#09090B] appearance-none cursor-pointer transition-all duration-150 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] disabled:bg-[#F4F4F5] disabled:cursor-not-allowed",
              error && "border-[#EF4444]",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-[#EF4444] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#71717A]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
