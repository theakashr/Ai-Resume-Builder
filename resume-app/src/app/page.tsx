import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustSection } from "@/components/landing/TrustSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "ResumeAI — AI-Powered Resume Builder & ATS Job Matcher",
  description:
    "Build ATS-friendly resumes, optimize bullet points for target job posts, and practice mock interviews with AI.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#09090B] selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
