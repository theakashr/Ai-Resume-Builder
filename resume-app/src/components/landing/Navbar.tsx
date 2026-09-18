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
      if (window.scrollY > 15) {
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
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3"
          : "bg-white/80 backdrop-blur-xs border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 select-none group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">AI</span>
          </span>
        </Link>

        {/* Center: Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60 shadow-2xs">
          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-full text-slate-900 bg-white shadow-xs"
          >
            Home
          </Link>
          <a
            href="#features"
            className="text-xs font-medium px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-xs font-medium px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#templates"
            className="text-xs font-medium px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            Templates
          </a>
          <a
            href="#pricing"
            className="text-xs font-medium px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-xs font-medium px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            Resources
          </a>
          <Link
            href="/design-system"
            className="text-[11px] font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
          >
            Design System
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-700 hover:text-slate-900 font-semibold px-4"
            >
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-4 shadow-sm shadow-indigo-600/20"
            >
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 flex flex-col gap-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold text-slate-900 py-1.5 border-b border-slate-100"
          >
            Home
          </Link>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-600 py-1.5 border-b border-slate-100"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-600 py-1.5 border-b border-slate-100"
          >
            How It Works
          </a>
          <a
            href="#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-600 py-1.5 border-b border-slate-100"
          >
            Templates
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-600 py-1.5 border-b border-slate-100"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-600 py-1.5 border-b border-slate-100"
          >
            Resources
          </a>
          <Link
            href="/design-system"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-semibold py-1.5 text-indigo-600"
          >
            Design System UI Catalog
          </Link>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="md" className="w-full">
                Log In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Get Started Free →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
