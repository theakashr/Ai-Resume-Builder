"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/firebase/context";
import { updateUserProfileDoc } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Sparkles, FileText, Target, Mic, CheckCircle2, ShieldCheck, Lock } from "lucide-react";

interface TermsOnboardingModalProps {
  onAccepted: () => void;
}

export const TermsOnboardingModal: React.FC<TermsOnboardingModalProps> = ({ onAccepted }) => {
  const { user } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue = termsAccepted && privacyAccepted && !isSubmitting;

  const handleContinue = async () => {
    if (!user) {
      setError("Authenticated session required. Please sign in again.");
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      setError("Please accept both the Terms & Conditions and Privacy Policy to continue.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      await updateUserProfileDoc(user.uid, {
        termsAccepted: true,
        termsAcceptedAt: now,
        privacyAccepted: true,
        privacyAcceptedAt: now,
      });

      onAccepted();
    } catch (err: any) {
      console.error("Failed to save terms acceptance:", err);
      setError("Failed to save your agreement. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E4E4E7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-left relative overflow-hidden">
        {/* Top Decorative Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4F46E5] via-indigo-500 to-purple-600" />

        {/* Title Section */}
        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEF2FF] text-[#4F46E5] rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to ResumeAI
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#09090B] tracking-tight">
            Let's Build Your Career Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
            Welcome! ResumeAI is an intelligent career platform designed to help you build ATS-optimized resumes, scan job descriptions, and master interviews.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="bg-[#FAF9F6] border border-[#E4E4E7] rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-[#09090B] uppercase tracking-wider">What ResumeAI Provides:</h3>
          <ul className="space-y-2 text-xs text-[#3F3F46]">
            <li className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
              <span><strong>AI Resume Builder:</strong> Create recruiter-ready, ATS-tailored resumes with automatic cloud draft persistence.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Target className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
              <span><strong>ATS Scanner & Optimization:</strong> Benchmark your resume against target job descriptions for higher response rates.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mic className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
              <span><strong>AI Mock Interviews:</strong> Practice role-specific interview questions with instant AI feedback and scoring.</span>
            </li>
          </ul>
        </div>

        {/* Agreements Checklist */}
        <div className="space-y-3 border-t border-[#E4E4E7] pt-4">
          <h3 className="text-xs font-bold text-[#09090B] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#4F46E5]" /> Required Agreements
          </h3>

          <div className="space-y-2">
            <label className="flex items-start gap-3 p-3 bg-white border border-[#E4E4E7] rounded-xl hover:bg-[#FAF9F6] cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#D4D4D8] text-[#4F46E5] focus:ring-[#4F46E5]"
              />
              <span className="text-xs text-[#09090B] leading-snug">
                I agree to the <strong>Terms & Conditions</strong> governing the use of ResumeAI services.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white border border-[#E4E4E7] rounded-xl hover:bg-[#FAF9F6] cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#D4D4D8] text-[#4F46E5] focus:ring-[#4F46E5]"
              />
              <span className="text-xs text-[#09090B] leading-snug">
                I agree to the <strong>Privacy Policy</strong> regarding secure data handling and encryption.
              </span>
            </label>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B]">
            {error}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!canContinue}
            isLoading={isSubmitting}
            className="w-full h-12 font-bold text-sm shadow-md"
          >
            {isSubmitting ? "Saving Agreement..." : "Continue to ResumeAI"}
          </Button>
          <p className="text-[11px] text-[#A1A1AA] text-center mt-3 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-[#A1A1AA]" /> Authenticated via Firebase Security • Agreement required once
          </p>
        </div>
      </div>
    </div>
  );
};
