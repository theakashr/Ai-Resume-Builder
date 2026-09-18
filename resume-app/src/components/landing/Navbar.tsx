"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#E4E4E7] shadow-xs py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 select-none group">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shadow-xs group-hover:bg-[#4338CA] transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-[#09090B] tracking-tight">
            Resume<span className="text-[#4F46E5]">AI</span>
          </span>
        </Link>

        {/* Center: Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-[#52525B] hover:text-[#09090B] transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-[#52525B] hover:text-[#09090B] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#templates"
            className="text-sm font-medium text-[#52525B] hover:text-[#09090B] transition-colors"
          >
            Templates
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-[#52525B] hover:text-[#09090B] transition-colors"
          >
            Pricing
          </a>
          <Link
            href="/design-system"
            className="text-xs font-semibold px-2 py-1 bg-[#EEF2FF] text-[#4F46E5] rounded hover:bg-[#E0E7FF] transition-colors"
          >
            Design System UI
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#52525B] hover:text-[#09090B] rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E4E4E7] px-4 pt-3 pb-6 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-[#52525B] py-1.5 border-b border-[#F4F4F5]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-[#52525B] py-1.5 border-b border-[#F4F4F5]"
          >
            How It Works
          </a>
          <a
            href="#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-[#52525B] py-1.5 border-b border-[#F4F4F5]"
          >
            Templates
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-[#52525B] py-1.5 border-b border-[#F4F4F5]"
          >
            Pricing
          </a>
          <Link
            href="/design-system"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-semibold py-2 text-[#4F46E5]"
          >
            Design System UI Component Catalog
          </Link>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="md" className="w-full">
                Log In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
