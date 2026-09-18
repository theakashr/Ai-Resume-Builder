"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Sparkles } from "lucide-react";

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      description: "Essential resume builder to start your application process.",
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        "1 ATS-Friendly Resume Template",
        "Basic Bullet Point Editor",
        "PDF Export with ResumeAI Watermark",
        "1 Job Match Scan / month",
      ],
      cta: "Start Free",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      description: "Everything you need to tailor resumes and ace interviews.",
      priceMonthly: 19,
      priceYearly: 14,
      features: [
        "Unlimited Professional Templates",
        "Unlimited AI Bullet Quantifier & Rewrites",
        "Unlimited ATS Job Description Matcher",
        "5 AI Mock Interview Practice Sessions",
        "PDF & Word DOCX Clean Exports",
      ],
      cta: "Start Pro 7-Day Trial",
      variant: "primary" as const,
      popular: true,
    },
    {
      name: "Premium",
      description: "Maximum AI power for aggressive career transitions.",
      priceMonthly: 39,
      priceYearly: 29,
      features: [
        "Everything in Pro Plan",
        "Unlimited AI Mock Interview Sessions",
        "Priority Voice Interview AI Processing",
        "1-on-1 AI Salary Negotiation Prompts",
        "Dedicated Email & Chat Support",
      ],
      cta: "Get Premium",
      variant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#09090B] tracking-tight">
            Invest in your next career milestone.
          </h2>
          <p className="text-base text-[#52525B]">
            No hidden lock-ins. Cancel or downgrade anytime in your dashboard settings.
          </p>

          {/* Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center bg-white border border-[#E4E4E7] p-1 rounded-xl shadow-2xs">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-[#4F46E5] text-white shadow-xs"
                    : "text-[#52525B] hover:text-[#09090B]"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-[#4F46E5] text-white shadow-xs"
                    : "text-[#52525B] hover:text-[#09090B]"
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 text-[10px] bg-[#ECFDF5] text-[#059669] rounded font-bold">
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? "border-2 border-[#4F46E5] shadow-lg ring-4 ring-[#EEF2FF]"
                    : "border border-[#E4E4E7] shadow-xs hover:border-[#D4D4D8]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="indigo" size="sm" className="shadow-xs font-bold px-3">
                      <Sparkles className="w-3 h-3 mr-1" /> Most Popular Candidate Choice
                    </Badge>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-[#09090B]">{plan.name}</h3>
                  </div>
                  <p className="text-xs text-[#52525B] min-h-[36px]">{plan.description}</p>

                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-[#09090B] tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs text-[#71717A] ml-1">/ month</span>
                    {billingCycle === "yearly" && price > 0 && (
                      <p className="text-[11px] text-[#059669] font-medium mt-1">
                        Billed annually (${price * 12}/yr)
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 border-t border-[#F4F4F5] pt-6 mb-8 text-xs text-[#52525B]">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5 stroke-[3]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant={plan.variant}
                  size="lg"
                  onClick={() => {
                    if (price === 0) {
                      window.location.href = "/signup";
                    } else {
                      alert(`${plan.name} Plan Checkout (Coming Soon) — Live Stripe subscription processing is coming soon! You can use all features during the free preview.`);
                    }
                  }}
                  className="w-full font-semibold"
                >
                  {plan.priceMonthly === 0 ? "Start Free" : `${plan.cta}`}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
