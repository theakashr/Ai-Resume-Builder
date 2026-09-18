"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { Accordion } from "@/components/ui/Accordion";
import { ProgressBar, ProgressRing } from "@/components/ui/ProgressBar";
import { Toast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

import { ResumeScoreCard } from "@/components/product/ResumeScoreCard";
import { ATSScoreCard } from "@/components/product/ATSScoreCard";
import { ResumePreview } from "@/components/product/ResumePreview";
import { ResumeEditor } from "@/components/product/ResumeEditor";
import { KeywordMatch } from "@/components/product/KeywordMatch";
import { AIRecommendation } from "@/components/product/AIRecommendation";
import { JobMatchScore } from "@/components/product/JobMatchScore";
import { InterviewQuestion } from "@/components/product/InterviewQuestion";
import { InterviewFeedback } from "@/components/product/InterviewFeedback";
import { InterviewScore } from "@/components/product/InterviewScore";
import { ProgressIndicator } from "@/components/product/ProgressIndicator";

import { ArrowLeft, Sparkles, Search, Mail, Send } from "lucide-react";

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [radioValue, setRadioValue] = useState("pro");
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [wizardStep, setWizardStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#09090B] pb-24">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E4E4E7] py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[#52525B] hover:text-[#09090B] flex items-center gap-1 text-xs font-semibold">
              <ArrowLeft className="w-4 h-4" /> Landing Page
            </Link>
            <span className="text-[#D4D4D8]">|</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F46E5]" />
              <h1 className="font-bold text-base">ResumeAI — Design System & Component Library</h1>
            </div>
          </div>
          <Badge variant="indigo">v1.0 Light-First Tokens</Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Color Palette Tokens */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-[#E4E4E7] pb-2">1. Color Palette Tokens</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#FAF9F6] border border-[#E4E4E7] font-mono">
              <span className="font-bold block">#FAF9F6</span>
              <span className="text-[#71717A]">Warm Off-White</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E4E4E7] font-mono">
              <span className="font-bold block">#FFFFFF</span>
              <span className="text-[#71717A]">Card Pure White</span>
            </div>
            <div className="p-3 rounded-lg bg-[#09090B] text-white font-mono">
              <span className="font-bold block">#09090B</span>
              <span className="text-[#A1A1AA]">Primary Text</span>
            </div>
            <div className="p-3 rounded-lg bg-[#52525B] text-white font-mono">
              <span className="font-bold block">#52525B</span>
              <span className="text-[#D4D4D8]">Secondary Text</span>
            </div>
            <div className="p-3 rounded-lg bg-[#4F46E5] text-white font-mono">
              <span className="font-bold block">#4F46E5</span>
              <span className="text-indigo-100">Accent Indigo</span>
            </div>
            <div className="p-3 rounded-lg bg-[#10B981] text-white font-mono">
              <span className="font-bold block">#10B981</span>
              <span className="text-emerald-100">Success Green</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F59E0B] text-white font-mono">
              <span className="font-bold block">#F59E0B</span>
              <span className="text-amber-100">Warning Amber</span>
            </div>
            <div className="p-3 rounded-lg bg-[#EF4444] text-white font-mono">
              <span className="font-bold block">#EF4444</span>
              <span className="text-red-100">Error Red</span>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-[#E4E4E7] pb-2">2. Button Variants & States</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link Button</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" leftIcon={<Send className="w-4 h-4" />}>Icon Left</Button>
          </div>
        </section>

        {/* Form Controls */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-[#E4E4E7] pb-2">3. Form Input Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Target Role" placeholder="e.g. Senior Frontend Engineer" leftIcon={<Search className="w-4 h-4" />} />
            <Input label="Email Address" type="email" error="Please enter a valid email address" leftIcon={<Mail className="w-4 h-4" />} />
            <Select label="Experience Level" options={[{ label: "Senior (5+ yrs)", value: "senior" }, { label: "Staff (8+ yrs)", value: "staff" }]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Textarea label="Bullet Description" placeholder="Describe your key achievements..." maxLength={200} />
            <div className="flex flex-col gap-4 pt-2">
              <Checkbox label="Enable ATS Scanner Auto-Sync" description="Automatically re-score when text changes." checked={checkboxValue} onChange={(e) => setCheckboxValue(e.target.checked)} />
              <RadioGroup name="plan-select" label="Choose Tier" selectedValue={radioValue} onChange={setRadioValue} options={[{ label: "Pro ($19/mo)", value: "pro", description: "Unlimited AI rewrites" }, { label: "Premium ($39/mo)", value: "premium", description: "Includes mock interviews" }]} />
            </div>
          </div>
        </section>

        {/* UI Feedback & Indicators */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-[#E4E4E7] pb-2">4. Badges, Progress, Toasts & Dialogs</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="indigo">Indigo Badge</Badge>
            <Badge variant="success">Success Badge</Badge>
            <Badge variant="warning">Warning Badge</Badge>
            <Badge variant="error">Error Badge</Badge>
            <Badge variant="neutral">Neutral Badge</Badge>
            <Tooltip content="Tooltip contextual hint message">
              <span className="text-xs font-semibold text-[#4F46E5] underline cursor-pointer">Hover for Tooltip</span>
            </Tooltip>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>Open Modal Dialog</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <ProgressBar value={88} label="ATS Score Gauge" variant="indigo" />
            <ProgressBar value={95} label="Keyword Density" variant="success" />
            <div className="flex items-center gap-4">
              <Avatar name="Alex Morgan" size="lg" />
              <div className="space-y-1">
                <SkeletonLoader width={120} height={16} />
                <SkeletonLoader width={80} height={12} />
              </div>
            </div>
          </div>

          <Toast type="success" title="Resume Saved" message="Your bullet points were successfully updated." />
        </section>

        {/* Product Components Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold border-b border-[#E4E4E7] pb-2">5. Domain Product Components (Interactive Mock Data)</h2>
          
          <ProgressIndicator
            steps={[{ id: 1, label: "Create" }, { id: 2, label: "Tailor Job" }, { id: 3, label: "Mock Practice" }]}
            currentStep={wizardStep}
            onStepClick={setWizardStep}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResumeScoreCard />
            <ATSScoreCard />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResumeEditor />
            <KeywordMatch />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AIRecommendation />
            <JobMatchScore />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InterviewQuestion />
            <InterviewFeedback />
          </div>

          <InterviewScore />

          <div className="pt-4">
            <h3 className="text-base font-bold mb-3">Live Paper Resume Preview Component</h3>
            <ResumePreview />
          </div>
        </section>
      </main>

      {/* Modal Demo */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="AI Keyword Optimizer"
        description="Select keywords to automatically inject into your active resume experience."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>Inject Keywords</Button>
          </>
        }
      >
        <p className="text-sm text-[#52525B]">
          Missing keywords detected: <strong>GraphQL</strong>, <strong>CI/CD</strong>, <strong>Kubernetes</strong>.
        </p>
      </Modal>
    </div>
  );
}
