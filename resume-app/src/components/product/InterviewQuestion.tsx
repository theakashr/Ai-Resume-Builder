"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Mic, Volume2, Sparkles, Clock, Send } from "lucide-react";

export interface InterviewQuestionProps {
  questionNumber?: number;
  totalQuestions?: number;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  questionText?: string;
  onSubmitAnswer?: (answer: string) => void;
}

export const InterviewQuestion: React.FC<InterviewQuestionProps> = ({
  questionNumber = 2,
  totalQuestions = 5,
  category = "Behavioral & Leadership",
  difficulty = "Medium",
  questionText = "Tell me about a time you faced technical disagreement with product leadership on design system scope, and how you resolved it.",
  onSubmitAnswer,
}) => {
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="indigo" size="sm">
              Question {questionNumber} of {totalQuestions}
            </Badge>
            <span className="text-xs text-[#71717A]">• {category}</span>
          </div>
          <Badge variant={difficulty === "Hard" ? "error" : "warning"} size="sm">
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-4">
        {/* Question Text */}
        <div className="p-4 bg-[#FAF9F6] border border-[#E4E4E7] rounded-xl relative">
          <p className="text-sm font-semibold text-[#09090B] leading-relaxed pr-8">
            "{questionText}"
          </p>
          <button className="absolute right-3 top-3 p-1.5 rounded-md text-[#71717A] hover:text-[#4F46E5] hover:bg-white transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Answer input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
              Your Response (STAR Format)
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
              <Clock className="w-3.5 h-3.5" /> Rec time limit: 2 mins
            </div>
          </div>
          <Textarea
            placeholder="Type your structured answer here (Situation, Task, Action, Result)..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={() => setIsRecording(!isRecording)}
            leftIcon={<Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />}
          >
            {isRecording ? "Stop Voice Recording" : "Record Voice Answer"}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onSubmitAnswer?.(answer)}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Evaluate Answer with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
