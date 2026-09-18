"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E4E4E7] py-12 text-xs text-[#52525B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#4F46E5] text-white flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-bold text-sm text-[#09090B] tracking-tight">
            Resume<span className="text-[#4F46E5]">AI</span>
          </span>
          <span className="text-[#A1A1AA] ml-2">© 2026 ResumeAI Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-[#09090B] transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-[#09090B] transition-colors">
            Pricing
          </a>
          <Link href="/design-system" className="text-[#4F46E5] hover:underline font-medium">
            Design System UI
          </Link>
          <Link href="/privacy" className="hover:text-[#09090B] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#09090B] transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};
