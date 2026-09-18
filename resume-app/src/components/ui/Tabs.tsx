"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  className?: string;
  onChange?: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId, className, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      <div className="flex items-center gap-1 border-b border-[#E4E4E7] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px select-none",
                isActive
                  ? "border-[#4F46E5] text-[#4F46E5]"
                  : "border-transparent text-[#71717A] hover:text-[#09090B] hover:border-[#D4D4D8]"
              )}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] rounded-full font-semibold",
                    isActive ? "bg-[#EEF2FF] text-[#4F46E5]" : "bg-[#F4F4F5] text-[#71717A]"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="pt-2">{activeContent}</div>
    </div>
  );
};
