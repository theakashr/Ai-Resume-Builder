"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, onChange, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-start gap-3 select-none cursor-pointer group",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 rounded border border-[#D4D4D8] bg-white transition-all peer-checked:bg-[#4F46E5] peer-checked:border-[#4F46E5] peer-focus-visible:ring-2 peer-focus-visible:ring-[#4F46E5] peer-focus-visible:ring-offset-1 group-hover:border-[#A1A1AA]"
            )}
          />
          <Check className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none stroke-[3]" />
        </div>
        {(label || description) && (
          <div className="flex flex-col text-sm">
            {label && <span className="font-medium text-[#09090B] leading-tight">{label}</span>}
            {description && <span className="text-xs text-[#71717A] mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
