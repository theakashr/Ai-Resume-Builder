"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = "User", size = "md", className }) => {
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
    xl: "w-14 h-14 text-lg",
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-[#EEF2FF] text-[#4F46E5] font-semibold border border-[#E0E7FF] select-none shrink-0",
        sizes[size],
        className
      )}
    >
      {src ? (
        // eslint-disable-next-next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
