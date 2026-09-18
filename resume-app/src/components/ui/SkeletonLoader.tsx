"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
  style,
  ...props
}) => {
  const roundedClass = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  }[variant];

  return (
    <div
      className={cn("bg-[#E4E4E7]/60 animate-pulse", roundedClass, className)}
      style={{
        width: width !== undefined ? width : undefined,
        height: height !== undefined ? height : undefined,
        ...style,
      }}
      {...props}
    />
  );
};
