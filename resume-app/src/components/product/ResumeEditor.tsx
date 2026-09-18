"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Sparkles, Plus, Trash2 } from "lucide-react";

export const ResumeEditor: React.FC = () => {
  const [role, setRole] = useState("Staff Product Designer");
  const [company, setCompany] = useState("Acme SaaS Inc.");
  const [bullet, setBullet] = useState(
    "Led cross-functional team of designers to build design systems."
  );
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleAiEnhance = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setBullet(
        "Architected scalable design system adopted across 8 micro-apps, reducing sprint cycle friction by 34% and boosting team velocity."
      );
      setIsEnhancing(false);
    }, 800);
  };

  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Resume Editor</CardTitle>
          <Button variant="ghost" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Section
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Target Job Title" value={role} onChange={(e) => setRole(e.target.value)} />
          <Input label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              Bullet Point (Achievement)
            </span>
            <Button
              variant="outline"
              size="sm"
              isLoading={isEnhancing}
              onClick={handleAiEnhance}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />}
              className="text-[#4F46E5] border-[#E0E7FF] hover:bg-[#EEF2FF]"
            >
              AI Rewrite & Quantify
            </Button>
          </div>
          <Textarea
            value={bullet}
            onChange={(e) => setBullet(e.target.value)}
            rows={3}
            helperText="Tip: Use action verbs and include metrics (e.g. %, $, team size)."
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#F4F4F5]">
          <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
            Discard
          </Button>
          <Button variant="primary" size="sm">
            Save Bullet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
