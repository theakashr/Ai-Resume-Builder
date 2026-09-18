"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export const ConnectedOptimizeBar: React.FC = () => {
  return (
    <div className="p-6 bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#3730A3] text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-indigo-200 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Connected Action Plan Ready
        </div>
        <h3 className="text-xl font-extrabold tracking-tight">
          Ready to apply these 3 optimizations to your resume?
        </h3>
        <p className="text-xs text-indigo-100 max-w-xl">
          Clicking below transfers these recommended keywords & AI rephrasings directly into your active Resume Builder workspace.
        </p>
      </div>

      <Link href="/dashboard/resumes/builder" className="shrink-0">
        <Button
          variant="secondary"
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4 text-[#4F46E5]" />}
          className="bg-white text-[#09090B] hover:bg-[#FAF9F6] font-bold px-6 shadow-sm border-none"
        >
          Optimize My Resume Now
        </Button>
      </Link>
    </div>
  );
};
