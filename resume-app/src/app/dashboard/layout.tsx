"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TermsOnboardingModal } from "@/components/auth/TermsOnboardingModal";
import { useAuth } from "@/lib/firebase/context";
import { X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, profile, loading } = useAuth();
  const [termsLocallyAccepted, setTermsLocallyAccepted] = useState(false);

  const needsTermsAcceptance =
    !loading &&
    !!user &&
    !termsLocallyAccepted &&
    (!profile?.termsAccepted || !profile?.privacyAccepted);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#09090B] flex flex-col md:flex-row relative">
      {/* First-Login Terms & Conditions Onboarding Overlay */}
      {needsTermsAcceptance && (
        <TermsOnboardingModal onAccepted={() => setTermsLocallyAccepted(true)} />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-[#71717A] hover:bg-[#F4F4F5]"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenMobileMenu={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
