"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#FAF9F6] border-t border-[#E4E4E7] text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#09090B] tracking-tight max-w-2xl mx-auto">
            Your next opportunity starts with a better application.
          </h2>
          <p className="text-base text-[#52525B] max-w-xl mx-auto">
            Join candidates who build ATS-optimized resumes and practice mock interviews with AI.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/signup">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto font-semibold px-8 shadow-md"
            >
              Build My Resume Free
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium">
              Try AI Mock Interview
            </Button>
          </Link>
        </div>

        <p className="text-xs text-[#71717A] flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" /> No credit card required. Free to get started.
        </p>
      </div>
    </section>
  );
};
