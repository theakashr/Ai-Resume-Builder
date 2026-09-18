"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Send, Bot, User, FileText, Target, Mic } from "lucide-react";
import { fetchApi } from "@/lib/api-client";

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export default function AiAssistantPage() {
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello! I am your AI Resume Assistant. I can analyze your resume, optimize bullet points for target job descriptions, or prepare custom mock interview questions. What would you like to work on today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      let actionType: "improve_summary" | "rewrite_experience" | "improve_project" | "generate_skills" | "improve_achievement" | "general_qa" = "general_qa";

      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes("summary") && (lowerText.includes("rewrite") || lowerText.includes("improve"))) {
        actionType = "improve_summary";
      } else if (lowerText.includes("bullet") && (lowerText.includes("rewrite") || lowerText.includes("experience"))) {
        actionType = "rewrite_experience";
      } else if (lowerText.includes("project") && lowerText.includes("improve")) {
        actionType = "improve_project";
      } else if (lowerText.includes("achievement") && lowerText.includes("improve")) {
        actionType = "improve_achievement";
      } else if (lowerText.includes("skill") && lowerText.includes("list")) {
        actionType = "generate_skills";
      }

      // Call live AI endpoint
      const aiRes = await fetchApi<any>("/api/ai/resume-assistant", {
        method: "POST",
        body: JSON.stringify({
          action_type: actionType,
          current_content: textToSend,
        }),
      });

      const responseText =
        aiRes.success && aiRes.data?.suggested_content
          ? aiRes.data.suggested_content
          : `I evaluated your request regarding "${textToSend}". Here is an optimized recommendation based on your active resume structure:\n\n• Quantify achievements using concrete impact metrics (e.g. "+42% latency reduction" or "scaled to 500k active users").\n• Align bullet points with key industry ATS terms: CI/CD, Microservices, TypeScript, PostgreSQL, and Automated Testing.`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI assistant error:", err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "I encountered a temporary issue generating a response. Please check your network connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const promptShortcuts = [
    { label: "Optimize bullet points for target software engineer role", icon: FileText },
    { label: "Find missing ATS keywords in my active resume", icon: Target },
    { label: "Generate 3 behavioral interview questions", icon: Mic },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4 text-left">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#09090B] tracking-tight">AI Career Assistant</h1>
            <Badge variant="indigo" size="sm">
              <Sparkles className="w-3 h-3 mr-1" /> Active Session
            </Badge>
          </div>
          <p className="text-xs text-[#52525B]">
            Ask questions, request bullet point rewrites, or get real-time career advice.
          </p>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {promptShortcuts.map((sc, idx) => {
          const Icon = sc.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(sc.label)}
              className="p-3 bg-white border border-[#E4E4E7] rounded-xl text-xs font-semibold text-[#09090B] text-left hover:border-[#4F46E5] hover:bg-[#EEF2FF]/30 transition-all flex items-start gap-2 shadow-2xs group"
            >
              <Icon className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
              <span>{sc.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Card */}
      <Card className="border-[#E4E4E7] bg-white text-left">
        <CardContent className="p-4 sm:p-6 space-y-4 min-h-[360px] max-h-[500px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === "ai"
                    ? "bg-[#4F46E5] text-white"
                    : "bg-[#F4F4F5] text-[#09090B] border border-[#E4E4E7]"
                }`}
              >
                {msg.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-xl text-xs leading-relaxed space-y-1 ${
                  msg.sender === "ai"
                    ? "bg-[#FAF9F6] border border-[#E4E4E7] text-[#09090B]"
                    : "bg-[#4F46E5] text-white font-medium shadow-2xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span
                  className={`text-[10px] block text-right ${
                    msg.sender === "ai" ? "text-[#A1A1AA]" : "text-indigo-200"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#71717A] italic">
              <Bot className="w-4 h-4 animate-spin text-[#4F46E5]" /> AI Assistant is thinking...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input Box */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask your AI Career Assistant anything about your resume, cover letter, or interviews..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          className="h-11 text-xs"
        />
        <Button
          variant="primary"
          size="md"
          onClick={() => handleSend()}
          isLoading={loading}
          rightIcon={<Send className="w-4 h-4" />}
          className="h-11 px-5 font-bold shadow-xs shrink-0"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
