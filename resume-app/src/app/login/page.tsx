"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, Check, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { loginUser, loginWithGoogle, sendPasswordReset } from "@/lib/firebase/auth";

/* ─── Google "G" logo SVG ─── */
function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCreateButton, setShowCreateButton] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Forgot Password Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Google OAuth Handler with Guaranteed finally Cleanup ──
  const handleGoogleSignIn = async () => {
    if (googleLoading) return;
    
    try {
      setGoogleLoading(true);
      setGoogleError(null);
      setErrorMessage(null);
      
      await loginWithGoogle();
      window.location.href = redirectTo;
    } catch (err: any) {
      setGoogleError(err.message || "Unable to sign in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Password Reset Handler ──
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetLoading(true);

    try {
      await sendPasswordReset(resetEmail);
      setToastMessage({
        type: "success",
        text: "Password reset link sent! Check your inbox to set a new password.",
      });
      setResetModalOpen(false);
      setResetEmail("");
    } catch (err: any) {
      setToastMessage({
        type: "error",
        text: err.message || "Failed to send reset email.",
      });
    } finally {
      setResetLoading(false);
    }
  };

  // ── Email / Password Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setShowCreateButton(false);
    setIsLoading(true);

    try {
      await loginUser(email, password);
      window.location.href = redirectTo;
    } catch (err: any) {
      const msg = err.message || "Incorrect email or password.";
      if (msg.includes("not found")) {
        setShowCreateButton(true);
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#09090B] flex flex-col justify-between p-4 sm:p-6">
      {/* Top Logo Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 select-none group">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-[#09090B] tracking-tight">
            Resume<span className="text-[#4F46E5]">AI</span>
          </span>
        </Link>
        <Link href="/" className="text-xs font-semibold text-[#52525B] hover:text-[#09090B]">
          Back to Home
        </Link>
      </div>

      {/* Main Login Card Layout */}
      <div className="max-w-md mx-auto w-full my-auto py-8 space-y-6 text-left">
        <Card className="border-[#E4E4E7] bg-white p-6 sm:p-8 shadow-sm">
          <CardHeader className="p-0 pb-6 border-b border-[#F4F4F5]">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-extrabold text-[#09090B] tracking-tight">
                Log in to ResumeAI
              </CardTitle>
              <p className="text-xs text-[#52525B]">
                Welcome back! Enter your credentials to access your career workspace.
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0 pt-6 space-y-4">
            {showCreateButton ? (
              <div className="space-y-4 py-2">
                <p className="text-sm font-semibold text-[#EF4444] text-center">
                  Account not found. Please create an account first.
                </p>
                <Link href="/signup" className="block w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full font-bold shadow-xs py-3"
                  >
                    Create Account
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateButton(false);
                    setErrorMessage(null);
                  }}
                  className="w-full text-center text-xs font-bold text-[#4F46E5] hover:underline"
                >
                  Back to Log In
                </button>
              </div>
            ) : (
              <>
                {googleError && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-red-800">Google Sign-In Notice</p>
                      <p className="text-xs text-red-600 leading-relaxed">{googleError}</p>
                    </div>
                  </div>
                )}

                {/* Continue with Google button */}
                <button
                  id="google-signin-btn"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  aria-label="Continue with Google"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-[#E4E4E7] bg-white text-sm font-semibold text-[#09090B] transition-all duration-150 hover:bg-[#F4F4F5] hover:border-[#D4D4D8] hover:shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#4F46E5]" />
                      <span>Connecting to Google...</span>
                    </>
                  ) : (
                    <>
                      <GoogleLogo />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* OR divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#E4E4E7]" />
                  <span className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-[#E4E4E7]" />
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Work / Personal Email"
                    type="email"
                    placeholder="alex.morgan@career.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                  />

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#09090B]">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setResetModalOpen(true);
                        }}
                        className="text-xs font-semibold text-[#4F46E5] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      leftIcon={<Lock className="w-4 h-4" />}
                      required
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full font-bold shadow-xs py-3 mt-2"
                  >
                    Log In
                  </Button>
                </form>

                <div className="pt-2 text-center text-xs text-[#71717A]">
                  Don&apos;t have an account yet?{" "}
                  <Link href="/signup" className="text-[#4F46E5] font-bold hover:underline">
                    Create a free account
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Trust Footer */}
        <div className="flex items-center justify-center gap-4 text-xs text-[#71717A]">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> 256-bit SSL Security
          </span>
          <span className="text-[#D4D4D8]">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Check className="w-3.5 h-3.5 text-[#4F46E5]" /> Session Encryption
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white p-6 space-y-4 shadow-xl border-[#E4E4E7]">
            <div className="flex items-center gap-3 text-[#4F46E5]">
              <div className="p-2 bg-[#EEF2FF] rounded-lg">
                <KeyRound className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <h3 className="text-lg font-bold text-[#09090B]">Reset Your Password</h3>
            </div>
            <p className="text-xs text-[#52525B]">
              Enter your account email address below and we will send you a password reset link.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                label="Account Email Address"
                type="email"
                placeholder="alex.morgan@career.ai"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
                autoFocus
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F4F4F5]">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  isLoading={resetLoading}
                  className="font-bold"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Toast Notification */}
      {(errorMessage || toastMessage) && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <Toast
            type={toastMessage ? toastMessage.type : "error"}
            title={toastMessage ? (toastMessage.type === "success" ? "Check Email" : "Error") : "Authentication Error"}
            message={toastMessage ? toastMessage.text : (errorMessage || "")}
            onClose={() => {
              setErrorMessage(null);
              setToastMessage(null);
            }}
          />
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-[#A1A1AA] py-4">
        © 2026 ResumeAI Inc. All rights reserved.
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
          <p className="text-xs font-semibold text-[#52525B]">Loading Login Page...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
