"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export interface ToastProps {
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  type = "info",
  title,
  message,
  onClose,
  className,
}) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#4F46E5] shrink-0" />,
  };

  const borders = {
    success: "border-l-4 border-l-[#10B981]",
    error: "border-l-4 border-l-[#EF4444]",
    warning: "border-l-4 border-l-[#F59E0B]",
    info: "border-l-4 border-l-[#4F46E5]",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 bg-white border border-[#E4E4E7] rounded-xl shadow-lg max-w-sm w-full animate-in slide-in-from-bottom-2 duration-200",
        borders[type],
        className
      )}
    >
      {icons[type]}
      <div className="flex-1 pr-2">
        <h4 className="text-sm font-semibold text-[#09090B]">{title}</h4>
        {message && <p className="text-xs text-[#52525B] mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[#A1A1AA] hover:text-[#09090B] p-0.5 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
