"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[#52525B]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-[#A1A1AA] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full h-10 px-3.5 bg-white border border-[#E4E4E7] rounded-lg text-sm text-[#09090B] placeholder-[#A1A1AA] transition-all duration-150 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] disabled:bg-[#F4F4F5] disabled:text-[#A1A1AA] disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#A1A1AA] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";
