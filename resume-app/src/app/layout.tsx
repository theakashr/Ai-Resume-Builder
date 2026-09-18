import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ResumeAI — AI Resume Builder, ATS Optimizer & Mock Interview",
    template: "%s | ResumeAI",
  },
  description:
    "Build ATS-friendly resumes with AI, optimize them for job descriptions, and practice realistic mock interviews with personalized feedback.",
  keywords: [
    "AI Resume Builder",
    "ATS Resume Optimizer",
    "AI Mock Interview",
    "Career Profile",
    "Interview Simulator",
  ],
  authors: [{ name: "ResumeAI Team" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://resume-app-ten-nu.vercel.app"),
  alternates: {
    canonical: "https://resume-app-ten-nu.vercel.app",
  },
  openGraph: {
    title: "ResumeAI — AI Resume Builder, ATS Optimizer & Mock Interview",
    description:
      "Build ATS-friendly resumes with AI, optimize them for job descriptions, and practice realistic mock interviews with personalized feedback.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://resume-app-ten-nu.vercel.app",
    siteName: "ResumeAI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeAI — AI Resume Builder, ATS Optimizer & Mock Interview",
    description:
      "Build ATS-friendly resumes with AI, optimize them for job descriptions, and practice realistic mock interviews with personalized feedback.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-[#09090B]">{children}</body>
    </html>
  );
}
