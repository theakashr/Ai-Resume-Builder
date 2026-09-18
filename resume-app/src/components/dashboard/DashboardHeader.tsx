"use client";

import React from "react";
import Link from "next/link";
import { Search, Bell, Menu, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";

export interface DashboardHeaderProps {
  onOpenMobileMenu?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenMobileMenu }) => {
  return (
    <header className="h-16 bg-white border-b border-[#E4E4E7] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 rounded-lg text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold text-[#71717A]">Workspace</span>
          <span className="text-[#D4D4D8]">/</span>
          <span className="text-xs font-bold text-[#09090B]">Dashboard Overview</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <Input
          placeholder="Search resumes, ATS reports, or mock questions..."
          leftIcon={<Search className="w-4 h-4" />}
          className="h-9 text-xs"
        />
      </div>

      {/* Right: Quick Links & Actions */}
      <div className="flex items-center gap-3 ml-auto">
        <Link
          href="/design-system"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold hover:bg-[#E0E7FF] transition-colors"
        >
          <Sparkles className="w-3 h-3" /> UI Design System
        </Link>

        <button className="relative p-2 text-[#52525B] hover:text-[#09090B] rounded-lg hover:bg-[#FAF9F6] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4F46E5] ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};
