"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { isMockSupabase } from "@/lib/env";
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Bot,
  Target,
  Mic,
  LayoutTemplate,
  Settings,
  LogOut,
} from "lucide-react";

export interface SidebarProps {
  className?: string;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onCloseMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("User");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    async function loadUser() {
      try {
        // 1. Check local session storage set by Firebase / Auth Service
        const sessionRaw = localStorage.getItem("active_user_session");
        if (sessionRaw) {
          try {
            const parsed = JSON.parse(sessionRaw);
            const name = parsed.fullName || parsed.full_name || (parsed.email ? parsed.email.split("@")[0] : "");
            if (name) {
              setDisplayName(name);
              setUserEmail(parsed.email || "");
              return;
            }
          } catch {}
        }

        // 2. Check mock user session cookies
        const mockUserCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("mock-user="))
          ?.split("=")[1];

        if (mockUserCookie) {
          try {
            const user = JSON.parse(decodeURIComponent(mockUserCookie));
            const name = user.fullName || user.full_name || (user.email ? user.email.split("@")[0] : "");
            if (name) {
              setDisplayName(name);
              setUserEmail(user.email || "");
              return;
            }
          } catch {}
        }

        // 3. Check mock profile details
        const mockProfileRaw = localStorage.getItem("mock_profile");
        if (mockProfileRaw) {
          try {
            const profile = JSON.parse(mockProfileRaw);
            if (profile.full_name) {
              setDisplayName(profile.full_name);
              return;
            }
          } catch {}
        }

        // 4. Check Supabase session if configured
        if (!isMockSupabase()) {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setUserEmail(user.email || "");
            const { data: profile } = await (supabase as any)
              .from("profiles")
              .select("full_name")
              .eq("user_id", user.id)
              .maybeSingle();

            if (profile?.full_name) {
              setDisplayName(profile.full_name);
            } else if (user.user_metadata?.full_name || user.user_metadata?.name) {
              setDisplayName(user.user_metadata.full_name || user.user_metadata.name);
            } else if (user.email) {
              setDisplayName(user.email.split("@")[0]);
            }
          }
        }
      } catch {}
    }

    loadUser();
  }, [pathname]);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Resumes", href: "/dashboard/resumes", icon: FileText, badge: "3" },
    { label: "AI Assistant", href: "/dashboard/assistant", icon: Bot, badge: "AI" },
    { label: "ATS Analysis", href: "/dashboard/ats", icon: Target },
    { label: "Mock Interviews", href: "/dashboard/interviews", icon: Mic },
    { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
  ];

  const bottomItems = [
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "w-64 bg-white border-r border-[#E4E4E7] flex flex-col justify-between h-screen sticky top-0 z-30 select-none",
        className
      )}
    >
      {/* Brand & App Name */}
      <div className="p-5 border-b border-[#F4F4F5] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shadow-xs group-hover:bg-[#4338CA] transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-[#09090B] tracking-tight leading-none">
              Resume<span className="text-[#4F46E5]">AI</span>
            </span>
            <span className="text-[10px] text-[#71717A] font-medium mt-0.5">Career Workspace</span>
          </div>
        </Link>
      </div>

      {/* Primary Navigation */}
      <div className="px-3 py-4 flex-1 space-y-6 overflow-y-auto">
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
            Main Menu
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group",
                    isActive
                      ? "bg-[#EEF2FF] text-[#4F46E5]"
                      : "text-[#52525B] hover:text-[#09090B] hover:bg-[#FAF9F6]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-[#4F46E5]" : "text-[#71717A] group-hover:text-[#09090B]"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 text-[10px] rounded-full font-bold",
                        isActive
                          ? "bg-[#4F46E5] text-white"
                          : item.badge === "AI"
                          ? "bg-[#EEF2FF] text-[#4F46E5]"
                          : "bg-[#F4F4F5] text-[#71717A]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile & Settings */}
      <div className="p-3 border-t border-[#F4F4F5] space-y-3 bg-[#FAF9F6]/50">
        <div className="space-y-0.5">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#52525B] hover:text-[#09090B] hover:bg-white transition-colors"
              >
                <Icon className="w-4 h-4 text-[#71717A]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Card */}
        <div className="p-2.5 bg-white border border-[#E4E4E7] rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar name={displayName} size="sm" />
            <div className="flex flex-col text-left truncate">
              <span className="text-xs font-bold text-[#09090B] leading-tight truncate">{displayName}</span>
              <span className="text-[10px] text-[#059669] font-medium">Pro Plan Active</span>
            </div>
          </div>
          <button
            onClick={async () => {
              try {
                localStorage.removeItem("active_user_session");
                localStorage.removeItem("mock_profile");
                document.cookie = "mock-user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                document.cookie = "mock-profile=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                const supabase = createClient();
                await supabase.auth.signOut();
              } catch {}
              router.push("/login");
              router.refresh();
            }}
            title="Log Out"
            className="p-1 hover:bg-[#F4F4F5] rounded-md transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4 text-[#A1A1AA] hover:text-[#EF4444] transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  );
};
