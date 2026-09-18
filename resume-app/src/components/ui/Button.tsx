"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg select-none";

    const variants = {
      primary:
        "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:bg-[#3730A3] shadow-sm hover:shadow",
      secondary:
        "bg-[#F4F4F5] text-[#09090B] hover:bg-[#E4E4E7] active:bg-[#D4D4D8] border border-[#E4E4E7]",
      outline:
        "border border-[#E4E4E7] bg-white text-[#09090B] hover:bg-[#FAF9F6] hover:border-[#D4D4D8] active:bg-[#F4F4F5]",
      ghost:
        "text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5] active:bg-[#E4E4E7]",
      destructive:
        "bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] shadow-sm",
      link:
        "text-[#4F46E5] underline-offset-4 hover:underline p-0 h-auto font-normal",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          variant !== "link" && sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
