"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTitleColor } from "@/lib/game/titles";
import { MAX_POSSIBLE_SCORE } from "@/lib/game/scoring";
import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import { Trophy, RotateCcw, Home, ArrowRight, Check, X } from "lucide-react";
import { Suspense, useEffect } from "react";
import type { AnswerRecord } from "@/lib/supabase/types";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isOnboarding, setPhase, complete, currentStep, advance } = useOnboarding();

  const score = parseInt(searchParams.get("score") || "0");
  const title = searchParams.get("title") || "Clueless Rookie";
  const category = searchParams.get("category") || "";
  const answersRaw = searchParams.get("answers") || "[]";
  const answers: AnswerRecord[] = JSON.parse(answersRaw);

  const percentage = Math.round((score / MAX_POSSIBLE_SCORE) * 100);
  const correct = answers.filter((a) => a.is_correct).length;
  const titleGradient = getTitleColor(title);

  useEffect(() => {
    if (isOnboarding) {
      setPhase("results");
    }
  }, [isOnboarding, setPhase]);

  function handleAction(path: string) {
    if (isOnboarding && currentStep?.id === "results-actions") {
      advance();
      complete();
    }
    router.push(path);
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-6"
        >
          <Trophy className="w-10 h-10 text-purple-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
          data-onboarding="results-title"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Your Title
          </p>
          <h1
            className={`text-4xl md:text-5xl font-bold bg-linear-to-r ${titleGradient} bg-clip-text text-transparent mb-2`}
          >
            {title}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-8 w-full max-w-md mb-8"
          data-onboarding="results-score"
        >
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-1">{score}</div>
            <p className="text-sm text-muted-foreground">
              out of {MAX_POSSIBLE_SCORE} points ({percentage}%)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="glass rounded-xl p-3">
              <div className="text-xl font-bold text-emerald-400">{correct}</div>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-xl font-bold text-red-400">
                {answers.length - correct}
              </div>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-xl font-bold text-amber-400">
                {answers.reduce((sum, a) => sum + (a.is_correct ? a.points - 100 : 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Time Bonus</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-md mb-8 space-y-3"
        >
          <p className="text-sm text-muted-foreground mb-3">Question Breakdown</p>
          {answers.map((answer, i) => (
            <div
              key={i}
              className={`glass rounded-xl p-4 flex items-center justify-between ${
                answer.is_correct
                  ? "ring-1 ring-emerald-400/30"
                  : "ring-1 ring-red-400/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    answer.is_correct
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-red-400/10 text-red-400"
                  }`}
                >
                  {answer.is_correct ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">Question {i + 1}</p>
                  <p className="text-xs text-muted-foreground">
                    {answer.is_correct
                      ? `Answered: ${answer.selected}`
                      : answer.selected
                      ? `Your answer: ${answer.selected}`
                      : "Time ran out"}
                  </p>
                </div>
              </div>
              <div className="text-sm font-bold">
                {answer.is_correct ? (
                  <span className="text-emerald-400">+{answer.points}</span>
                ) : (
                  <span className="text-red-400">0</span>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center gap-3"
          data-onboarding="results-actions"
        >
          <Button
            onClick={() => handleAction(`/play/${category}`)}
            className="bg-linear-to-r from-purple-500 to-cyan-500 border-0 hover:opacity-90 group"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Play Again
          </Button>
          <Button variant="outline" onClick={() => handleAction("/home")}>
            <Home className="w-4 h-4 mr-1" />
            Choose Category
          </Button>
          <Button variant="outline" onClick={() => handleAction("/leaderboard")}>
            <Trophy className="w-4 h-4 mr-1" />
            Leaderboard
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
