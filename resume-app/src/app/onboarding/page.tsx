"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { ProgressIndicator } from "@/components/product/ProgressIndicator";
import { Sparkles, ArrowRight, FilePlus, Upload, Target, CheckCircle2, ShieldCheck, FileText, Check } from "lucide-react";
import { useAuth } from "@/lib/firebase/context";
import { updateUserProfileDoc } from "@/lib/firebase/firestore";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const [termsStepComplete, setTermsStepComplete] = useState(false);
  const [isSubmittingTerms, setIsSubmittingTerms] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [targetRole, setTargetRole] = useState("Software Developer");
  const [pathChoice, setPathChoice] = useState<"template" | "upload">("template");
  const [primaryGoal, setPrimaryGoal] = useState("ats");

  useEffect(() => {
    if (profile?.termsAccepted && profile?.privacyAccepted) {
      setTermsStepComplete(true);
    }
  }, [profile]);

  const handleAcceptLegal = async () => {
    if (!hasAcceptedTerms || !hasAcceptedPrivacy) return;
    setIsSubmittingTerms(true);

    const now = new Date().toISOString();
    try {
      if (user?.uid) {
        await updateUserProfileDoc(user.uid, {
          termsAccepted: true,
          termsAcceptedAt: now,
          privacyAccepted: true,
          privacyAcceptedAt: now,
        });
      }
      setTermsStepComplete(true);
    } catch (err) {
      console.error("Failed to save legal acceptance:", err);
      setTermsStepComplete(true);
    } finally {
      setIsSubmittingTerms(false);
    }
  };

  const steps = [
    { id: 1, label: "Target Role" },
    { id: 2, label: "Starting Point" },
    { id: 3, label: "Primary Goal" },
  ];

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push("/dashboard");
    }
  };

  // Render Terms Acceptance Screen if user has not yet accepted
  if (!authLoading && !termsStepComplete) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#09090B] flex flex-col justify-between p-4 sm:p-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-4">
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-[#09090B] tracking-tight">
              Resume<span className="text-[#4F46E5]">AI</span>
            </span>
          </div>
          <span className="text-xs font-semibold text-[#71717A]">Terms & Privacy Agreement</span>
        </div>

        <div className="max-w-md mx-auto w-full my-auto py-8 space-y-6 text-left">
          <Card className="border-[#E4E4E7] bg-white p-6 sm:p-8 shadow-sm">
            <CardHeader className="p-0 pb-6 border-b border-[#F4F4F5]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Welcome to ResumeAI
                </div>
                <CardTitle className="text-2xl font-extrabold text-[#09090B]">
                  Welcome to ResumeAI
                </CardTitle>
                <p className="text-xs text-[#52525B]">
                  Build better resumes, improve ATS compatibility, and practice interviews with AI.
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-6 space-y-6">
              <div className="space-y-2 text-xs text-[#3F3F46]">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E4E4E7]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Build professional ATS-friendly resumes</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E4E4E7]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Improve ATS compatibility for target jobs</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E4E4E7]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Practice realistic mock interviews with AI</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-[#F4F4F5] pt-4">
                <p className="text-xs font-semibold text-[#09090B]">Before continuing, please review:</p>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#09090B]">
                    <Checkbox
                      checked={hasAcceptedTerms}
                      onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                    />
                    <span>
                      I agree to the{" "}
                      <Link href="/terms" target="_blank" className="text-[#4F46E5] font-bold hover:underline">
                        Terms & Conditions
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#09090B]">
                    <Checkbox
                      checked={hasAcceptedPrivacy}
                      onChange={(e) => setHasAcceptedPrivacy(e.target.checked)}
                    />
                    <span>
                      I agree to the{" "}
                      <Link href="/privacy" target="_blank" className="text-[#4F46E5] font-bold hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAcceptLegal}
                disabled={!hasAcceptedTerms || !hasAcceptedPrivacy || isSubmittingTerms}
                isLoading={isSubmittingTerms}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full font-bold shadow-xs py-3 mt-2"
              >
                Continue to ResumeAI
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-xs text-[#A1A1AA] py-4">
          © 2026 ResumeAI Inc. All rights reserved.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#09090B] flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-[#09090B] tracking-tight">
            Resume<span className="text-[#4F46E5]">AI</span>
          </span>
        </div>
        <span className="text-xs font-semibold text-[#71717A]">Quick Setup (Step {currentStep + 1} of 3)</span>
      </div>

      {/* Main Wizard Container */}
      <div className="max-w-xl mx-auto w-full my-auto py-8 space-y-6 text-left">
        <ProgressIndicator steps={steps} currentStep={currentStep} />

        <Card className="border-[#E4E4E7] bg-white p-6 sm:p-8 shadow-sm">
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">What is your target job role?</CardTitle>
                <p className="text-xs text-[#52525B]">
                  We'll tailor your ATS keyword recommendations and mock interview questions for this position.
                </p>
              </div>

              <Input
                label="Target Job Title"
                placeholder="e.g. Senior Product Designer, Software Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">How would you like to start?</CardTitle>
                <p className="text-xs text-[#52525B]">Choose whether to import an existing resume or start fresh.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div
                  onClick={() => setPathChoice("template")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                    pathChoice === "template"
                      ? "border-[#4F46E5] bg-[#EEF2FF]/40 ring-2 ring-[#4F46E5]"
                      : "border-[#E4E4E7] bg-white hover:border-[#D4D4D8]"
                  }`}
                >
                  <FilePlus className="w-6 h-6 text-[#4F46E5]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#09090B]">Start with Fresh Template</h4>
                    <p className="text-xs text-[#71717A] mt-0.5">Use recruiter-approved ATS templates.</p>
                  </div>
                </div>

                <div
                  onClick={() => setPathChoice("upload")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                    pathChoice === "upload"
                      ? "border-[#4F46E5] bg-[#EEF2FF]/40 ring-2 ring-[#4F46E5]"
                      : "border-[#E4E4E7] bg-white hover:border-[#D4D4D8]"
                  }`}
                >
                  <Upload className="w-6 h-6 text-[#4F46E5]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#09090B]">Upload Existing PDF/Word</h4>
                    <p className="text-xs text-[#71717A] mt-0.5">Auto-extract contact info & work history.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">What is your primary career goal today?</CardTitle>
                <p className="text-xs text-[#52525B]">We'll prioritize your dashboard widgets accordingly.</p>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { id: "ats", label: "Pass ATS Scanners for a specific job application", icon: Target },
                  { id: "interview", label: "Practice AI Mock Interviews & refine answers", icon: Sparkles },
                  { id: "polish", label: "General resume formatting & bullet point quantification", icon: CheckCircle2 },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = primaryGoal === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setPrimaryGoal(item.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? "border-[#4F46E5] bg-[#EEF2FF]/40 ring-1 ring-[#4F46E5]"
                          : "border-[#E4E4E7] bg-white hover:border-[#D4D4D8]"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-[#4F46E5]" />
                      <span className="text-xs font-bold text-[#09090B]">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-[#F4F4F5] mt-6">
            {currentStep > 0 ? (
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep((prev) => prev - 1)}>
                Previous
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold px-6 shadow-xs"
            >
              {currentStep === 2 ? "Enter Career Workspace" : "Continue"}
            </Button>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-[#A1A1AA] py-4">
        © 2026 ResumeAI Inc. All rights reserved.
      </div>
    </div>
  );
}
