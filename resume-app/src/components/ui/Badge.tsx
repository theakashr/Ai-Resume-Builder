"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "indigo" | "success" | "warning" | "error" | "neutral" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}) => {
  const base = "inline-flex items-center font-medium rounded-md tracking-wide select-none";

  const variants = {
    default: "bg-[#F4F4F5] text-[#09090B] border border-[#E4E4E7]",
    indigo: "bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]",
    success: "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]",
    warning: "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]",
    error: "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]",
    neutral: "bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]",
    outline: "bg-transparent text-[#52525B] border border-[#E4E4E7]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <div className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </div>
  );
};
