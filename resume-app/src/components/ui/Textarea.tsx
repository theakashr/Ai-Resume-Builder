"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, maxLength, id, value, onChange, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label
              htmlFor={textareaId}
              className="text-xs font-semibold uppercase tracking-wider text-[#52525B]"
            >
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-xs text-[#A1A1AA]">
              {charCount} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={cn(
            "w-full min-h-[100px] p-3 bg-white border border-[#E4E4E7] rounded-lg text-sm text-[#09090B] placeholder-[#A1A1AA] transition-all duration-150 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] disabled:bg-[#F4F4F5] disabled:cursor-not-allowed resize-y",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[#EF4444] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#71717A]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
