"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CareerProgressCard } from "@/components/dashboard/CareerProgressCard";
import { NextBestActionCard } from "@/components/dashboard/NextBestActionCard";
import { RecentResumesGrid, ResumeItem } from "@/components/dashboard/RecentResumesGrid";
import { RecentInterviewsList, InterviewSession } from "@/components/dashboard/RecentInterviewsList";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { Plus, Mic, Sparkles, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api-client";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [planId, setPlanId] = useState<string>("free");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const sessionRaw = localStorage.getItem("active_user_session");
        if (sessionRaw) {
          try {
            const parsed = JSON.parse(sessionRaw);
            const name = parsed.fullName || parsed.full_name || (parsed.email ? parsed.email.split("@")[0] : "");
            if (name) setUserName(name.split(" ")[0]);
          } catch {}
        }
        // Fetch resumes
        const resResumes = await fetchApi<{ items: any[] }>("/api/resumes?limit=3");
        if (resResumes.success && resResumes.data?.items) {
          setResumes(
            resResumes.data.items.map((r: any) => ({
              id: r.id,
              name: r.title,
              targetRole: r.target_role || "Software Engineer",
              lastEdited: new Date(r.updated_at || r.created_at).toLocaleDateString(),
              atsScore: r.ats_score || 85,
              templateName: r.resume_templates?.name || "Modern Tech",
            }))
          );
        }

        // Fetch interviews
        const resInterviews = await fetchApi<{ items: any[] }>("/api/interviews?limit=3");
        if (resInterviews.success && resInterviews.data?.items) {
          setInterviews(
            resInterviews.data.items.map((i: any) => ({
              id: i.id,
              role: i.target_role,
              date: new Date(i.created_at).toLocaleDateString(),
              score: i.overall_score || 80,
              type: i.interview_type,
              questionsCount: 5,
            }))
          );
        }

        // Fetch subscription
        const resSub = await fetchApi<any>("/api/billing/subscription");
        if (resSub.success && resSub.data?.plan_id) {
          setPlanId(resSub.data.plan_id);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleCreateNewResume = async () => {
    const res = await fetchApi("/api/resumes", {
      method: "POST",
      body: JSON.stringify({
        title: "Untitled Resume",
        status: "draft",
      }),
    });
    if (res.success && res.data?.id) {
      router.push(`/dashboard/resumes/builder?id=${res.data.id}`);
    } else {
      router.push("/dashboard/resumes/builder");
    }
  };

  const handleStartInterview = () => {
    router.push("/dashboard/interviews");
  };

  const showEmptyState = !loading && resumes.length === 0 && interviews.length === 0;

  return (
    <div className="space-y-6">
      {/* Top Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4E7] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#09090B] tracking-tight">
              Welcome back{userName ? `, ${userName}` : ""}
            </h1>
            <Badge variant={planId === "free" ? "neutral" : "indigo"} size="sm">
              <Sparkles className="w-3 h-3 mr-1" /> {planId.toUpperCase()} Member
            </Badge>
          </div>
          <p className="text-xs text-[#52525B]">
            Let's get you one step closer to your next opportunity.
          </p>
        </div>

        {/* Header Action CTAs */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={handleStartInterview}
            leftIcon={<Mic className="w-4 h-4 text-[#4F46E5]" />}
          >
            Start Mock Interview
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleCreateNewResume}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-semibold shadow-xs"
          >
            Create New Resume
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="h-28 rounded-xl bg-[#E4E4E7]/40 animate-pulse border border-[#E4E4E7]" />
          <div className="h-36 rounded-xl bg-[#E4E4E7]/40 animate-pulse border border-[#E4E4E7]" />
          <div className="h-48 rounded-xl bg-[#E4E4E7]/40 animate-pulse border border-[#E4E4E7]" />
        </div>
      ) : showEmptyState ? (
        <DashboardEmptyState onCreateFirstResume={handleCreateNewResume} />
      ) : (
        <>
          {/* Next Best Action Card */}
          <NextBestActionCard onOptimizeClick={() => router.push("/dashboard/ats")} />

          {/* Career Progress Area */}
          <CareerProgressCard />

          {/* Recent Resumes Grid */}
          <RecentResumesGrid
            resumes={resumes.length > 0 ? resumes : undefined}
            onCreateNew={handleCreateNewResume}
            onEdit={(id) => router.push(`/dashboard/resumes/builder?id=${id}`)}
          />

          {/* Recent Interviews & Feedback */}
          <RecentInterviewsList
            interviews={interviews.length > 0 ? interviews : undefined}
            onStartNew={handleStartInterview}
          />
        </>
      )}
    </div>
  );
}
