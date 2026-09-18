"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn("flex flex-col divide-y divide-[#E4E4E7] border-y border-[#E4E4E7]", className)}>
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="py-4">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => toggleItem(item.id)}
                className="flex-1 flex items-center justify-between text-left font-medium text-[#09090B] hover:text-[#4F46E5] transition-colors py-1 group select-none"
              >
                <span className="text-base font-semibold pr-4">{item.title}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#71717A] group-hover:text-[#4F46E5] transition-transform duration-200 shrink-0",
                    isOpen && "rotate-180 text-[#4F46E5]"
                  )}
                />
              </button>
              {(item.onMoveUp || item.onMoveDown) && (
                <div className="flex items-center gap-1 shrink-0">
                  {item.onMoveUp && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onMoveUp?.();
                      }}
                      disabled={index === 0}
                      className="p-1 text-[#71717A] hover:text-[#4F46E5] disabled:opacity-30 disabled:hover:text-[#71717A] transition-colors"
                      title="Move Section Up"
                    >
                      ▲
                    </button>
                  )}
                  {item.onMoveDown && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onMoveDown?.();
                      }}
                      disabled={index === items.length - 1}
                      className="p-1 text-[#71717A] hover:text-[#4F46E5] disabled:opacity-30 disabled:hover:text-[#71717A] transition-colors"
                      title="Move Section Down"
                    >
                      ▼
                    </button>
                  )}
                </div>
              )}
            </div>
            {isOpen && (
              <div className="mt-2 text-sm text-[#52525B] leading-relaxed animate-in fade-in-50 duration-150 pr-6">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
