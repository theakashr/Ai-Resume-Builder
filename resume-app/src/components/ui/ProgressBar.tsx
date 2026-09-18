"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: "indigo" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  variant = "indigo",
  size = "md",
  className,
}) => {
  const percentage = Math.min(Math.max(0, Math.round((value / max) * 100)), 100);

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variants = {
    indigo: "bg-[#4F46E5]",
    success: "bg-[#10B981]",
    warning: "bg-[#F59E0B]",
    error: "bg-[#EF4444]",
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-medium">
          {label && <span className="text-[#52525B]">{label}</span>}
          {showValue && <span className="text-[#09090B] font-semibold">{percentage}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-[#E4E4E7] rounded-full overflow-hidden", heights[size])}>
        <div
          className={cn("h-full transition-all duration-500 rounded-full", variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export interface ProgressRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "#4F46E5"; // default indigo
  if (score >= 85) strokeColor = "#10B981"; // success green
  else if (score >= 70) strokeColor = "#4F46E5"; // indigo
  else if (score >= 50) strokeColor = "#F59E0B"; // warning amber
  else strokeColor = "#EF4444"; // error red

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E4E4E7"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-[#09090B] leading-none tracking-tight">{score}%</span>
        {label && <span className="text-[11px] font-medium text-[#71717A] mt-1">{label}</span>}
        {sublabel && <span className="text-[10px] text-[#A1A1AA]">{sublabel}</span>}
      </div>
    </div>
  );
};
