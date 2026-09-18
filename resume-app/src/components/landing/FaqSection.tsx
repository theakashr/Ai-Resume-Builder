"use client";

import React from "react";
import { Accordion, AccordionItemData } from "@/components/ui/Accordion";

export const FaqSection: React.FC = () => {
  const faqs: AccordionItemData[] = [
    {
      id: "free-plan",
      title: "Is there a completely free plan available?",
      content:
        "Yes! ResumeAI provides a permanent free plan that allows you to build, edit, and export your base resume. You can upgrade to Pro anytime for unlimited AI bullet optimization and mock interview sessions.",
    },
    {
      id: "ats-optimization",
      title: "How does the ATS Optimization scanner work?",
      content:
        "Our ATS scanner parses your resume using industry-standard parsing algorithms matching Workday, Taleo, Greenhouse, and Lever engines. It identifies missing keywords from target job posts, formatting errors, and unreadable sections.",
    },
    {
      id: "templates",
      title: "Are the resume templates recruiter-approved?",
      content:
        "All templates are designed with input from senior recruiters at Fortune 500 tech companies. They prioritize clean single-column readability, standard fonts, clear typography hierarchy, and zero parsing errors.",
    },
    {
      id: "ai-features",
      title: "Will the AI invent fake work experience for me?",
      content:
        "No. ResumeAI enhances your actual experience by quantifying achievements, correcting syntax, and recommending impact verbs. It never invents false titles, dates, or credentials.",
    },
    {
      id: "mock-interviews",
      title: "How does the AI Mock Interview practice work?",
      content:
        "You can practice using voice recording or text responses. The AI generates tailored behavioral and technical questions based on your resume and target job role, followed by instant scoring in STAR format.",
    },
    {
      id: "privacy",
      title: "Is my personal resume data kept private?",
      content:
        "Yes. Your personal information, work history, and contact details are stored securely. We do not sell user data nor use your personal documents to train public machine learning models.",
    },
    {
      id: "cancellation",
      title: "Can I cancel my subscription anytime?",
      content:
        "Absolutely. You can cancel or downgrade your plan directly inside your account settings with a single click at any time without hassle.",
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-[#E4E4E7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-[#09090B] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#52525B]">
            Everything you need to know about ResumeAI plans, features, and security.
          </p>
        </div>

        <Accordion items={faqs} defaultOpenIds={["free-plan"]} />
      </div>
    </section>
  );
};
