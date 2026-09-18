import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Use | ResumeAI",
  description: "Terms of Use and career preparation disclaimers for ResumeAI applications and services.",
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#09090B] flex flex-col">
      {/* Top Header Navigation */}
      <header className="border-b border-[#E4E4E7] bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Resume<span className="text-[#4F46E5]">AI</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52525B] hover:text-[#09090B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-3 border-b border-[#E4E4E7] pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold">
            <FileText className="w-3.5 h-3.5" /> Terms & Service
          </div>
          <h1 className="text-3xl font-extrabold text-[#09090B] tracking-tight">Terms of Use</h1>
          <p className="text-xs text-[#71717A]">Effective Date: August 11, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-[#3F3F46] leading-relaxed bg-white p-6 sm:p-8 rounded-xl border border-[#E4E4E7] shadow-xs">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">1. Agreement to Terms</h2>
            <p>
              By creating an account or accessing ResumeAI, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">2. Description of Service</h2>
            <p>
              ResumeAI provides AI-assisted software for resume creation, ATS formatting analysis, and career interview practice simulations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">3. Career Preparation & AI Disclaimer</h2>
            <p className="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg text-xs text-[#4338CA] font-medium leading-relaxed">
              <strong>IMPORTANT CAREER DISCLAIMER:</strong> All ATS match scores, STAR metrics, and AI interview evaluations provided by ResumeAI are designed exclusively for self-directed career preparation practice. They do not guarantee job placement, employment offers, or hiring outcomes with any third-party employer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">4. Acceptable Use Policy</h2>
            <p>
              You agree to use ResumeAI only for lawful personal career preparation purposes. You may not attempt to reverse engineer, scrape, or exploit the platform or introduce malicious scripts into backend endpoints.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">5. Subscriptions & Billing</h2>
            <p>
              ResumeAI offers free and premium tier memberships. Subscriptions renew automatically on a recurring monthly or annual basis unless cancelled prior to the billing date through your Account Settings page.
            </p>
          </section>

          <section className="space-y-2 border-t border-[#F4F4F5] pt-4">
            <h2 className="text-base font-bold text-[#09090B]">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ResumeAI shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform or reliance on AI-generated career recommendations.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4E4E7] bg-white py-6 text-center text-xs text-[#71717A]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="font-bold text-[#4F46E5] hover:underline">Terms of Use</Link>
            <Link href="/privacy" className="hover:text-[#09090B] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
