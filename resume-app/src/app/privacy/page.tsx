import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | ResumeAI",
  description: "ResumeAI Privacy Policy detailing data protection, account security, AI processing, and browser media coaching disclosures.",
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" /> Legal & Privacy
          </div>
          <h1 className="text-3xl font-extrabold text-[#09090B] tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-[#71717A]">Effective Date: August 11, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-[#3F3F46] leading-relaxed bg-white p-6 sm:p-8 rounded-xl border border-[#E4E4E7] shadow-xs">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">1. Overview & Commitment</h2>
            <p>
              ResumeAI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed to protecting your personal data. This Privacy Policy outlines how we collect, use, process, and safeguard information when you use our AI Resume Builder, ATS Analyzer, and AI Mock Interview Simulator.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Credentials:</strong> Email address, password, profile name, and authentication tokens provided during registration or OAuth sign-in.</li>
              <li><strong>Resume Content:</strong> Employment history, education, skills, certifications, and target job descriptions uploaded or entered for resume generation and ATS scoring.</li>
              <li><strong>Mock Interview Responses:</strong> Spoken or written interview answers, audio transcripts, and STAR evaluation parameters.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">3. Camera & Microphone Browser Features</h2>
            <p>
              ResumeAI includes optional browser-side camera and microphone coaching features for interview preparation:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Browser-Side Analysis Only:</strong> Webcam video frames are processed locally within your browser using HTML Canvas image data to provide feedback on positioning and lighting. Raw video streams are <strong>never recorded or stored on remote servers</strong>.</li>
              <li><strong>Coaching Purpose Only:</strong> Positioning feedback is provided solely as browser-side practice guidance and does not calculate medical, psychological, honesty, or intelligence metrics.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">4. AI Processing & Third-Party Services</h2>
            <p>
              We utilize secure cloud infrastructure (Supabase Auth & Database) and Google Gemini AI APIs to generate evaluation feedback, STAR metrics, and ATS matching reports. Your data is never sold to third-party data brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#09090B]">5. Your Data Rights & Control</h2>
            <p>
              You maintain full control over your data. You may edit or permanently delete your resumes, ATS analyses, and mock interview reports at any time through your Account Settings panel.
            </p>
          </section>

          <section className="space-y-2 border-t border-[#F4F4F5] pt-4">
            <h2 className="text-base font-bold text-[#09090B]">6. Contact Us</h2>
            <p>
              If you have any questions or privacy inquiries regarding ResumeAI, please contact our support team at <span className="font-semibold text-[#4F46E5]">privacy@resumeai.com</span>.
            </p>
          </section>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-[#E4E4E7] bg-white py-6 text-center text-xs text-[#71717A]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-[#09090B] transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="font-bold text-[#4F46E5] hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
