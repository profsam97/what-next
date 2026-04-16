"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CircularTimer } from "@/components/game/timer";
import { useTimer } from "@/hooks/use-timer";
import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import {
  TIMER_SECONDS,
  QUESTIONS_PER_SESSION,
  calculatePoints,
} from "@/lib/game/scoring";
import { getTitle } from "@/lib/game/titles";
import { Check, X, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Question, AnswerRecord } from "@/lib/supabase/types";
import { playCorrect, playWrong } from "@/lib/sounds";

type FeedbackState = "correct" | "wrong" | null;

export default function PlayPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const router = useRouter();
  const {
    isOnboarding,
    setPhase,
    timerPaused,
    resumeTimer,
    currentStep,
    pauseUntilResults,
  } = useOnboarding();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<string>("");
  const [onboardingPhaseSet, setOnboardingPhaseSet] = useState(false);

  const handleTimeUp = useCallback(() => {
    if (feedback) return;
    const question = questions[currentIndex];
    if (!question) return;

    setFeedback("wrong");
    setSelectedOption(null);
    playWrong();

    const record: AnswerRecord = {
      question_id: question.id,
      selected: "",
      correct: question.correct_answer,
      is_correct: false,
      time_left: 0,
      points: 0,
    };
    setAnswers((prev) => [...prev, record]);
  }, [feedback, questions, currentIndex]);

  const timer = useTimer(TIMER_SECONDS, handleTimeUp);

  useEffect(() => {
    async function loadQuestions() {
      const supabase = createClient();

      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (!cat) {
        router.push("/home");
        return;
      }

      setCategoryId(cat.id);

      const { data: qs } = await supabase
        .from("questions")
        .select("*")
        .eq("category_id", cat.id)
        .limit(QUESTIONS_PER_SESSION);

      if (qs && qs.length > 0) {
        setQuestions(qs as Question[]);
        setLoading(false);
      } else {
        router.push("/home");
      }
    }
    loadQuestions();
  }, [category, router]);

  useEffect(() => {
    if (!loading && isOnboarding && !onboardingPhaseSet) {
      setPhase("play");
      setOnboardingPhaseSet(true);
    }
  }, [loading, isOnboarding, setPhase, onboardingPhaseSet]);

  const [timerReady, setTimerReady] = useState(!isOnboarding);

  useEffect(() => {
    if (loading || questions.length === 0 || feedback) return;
    if (!timerReady) return;
    if (!timer.isRunning) {
      timer.start();
    }
  }, [loading, questions.length, timer, feedback, timerReady]);

  useEffect(() => {
    if (isOnboarding && timerPaused && currentStep === null && onboardingPhaseSet) {
      resumeTimer();
      setTimerReady(true);
    }
  }, [isOnboarding, currentStep, timerPaused, resumeTimer, onboardingPhaseSet]);

  function handleAnswer(option: string) {
    if (feedback) return;
    if (isOnboarding && timerPaused) return;
    timer.stop();

    const question = questions[currentIndex];
    const isCorrect = option === question.correct_answer;
    const points = calculatePoints(isCorrect, timer.timeLeft);

    setSelectedOption(option);
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) playCorrect();
    else playWrong();

    const record: AnswerRecord = {
      question_id: question.id,
      selected: option,
      correct: question.correct_answer,
      is_correct: isCorrect,
      time_left: timer.timeLeft,
      points,
    };
    setAnswers((prev) => [...prev, record]);

    if (isOnboarding && currentIndex === 0) {
      pauseUntilResults();
    }
  }

  async function nextQuestion() {

    if (currentIndex + 1 >= questions.length) {
      const totalScore = answers.reduce((sum, a) => sum + a.points, 0);
      const baseScore = answers.filter((a) => a.is_correct).length * 100;
      const timeBonus = totalScore - baseScore;
      const { title } = getTitle(totalScore);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("game_sessions").insert({
          user_id: user.id,
          category_id: categoryId,
          score: baseScore,
          time_bonus: timeBonus,
          total_score: totalScore,
          title,
          answers,
        });
      }

      const params = new URLSearchParams({
        score: totalScore.toString(),
        title,
        category,
        answers: JSON.stringify(answers),
      });
      router.push(`/results?${params.toString()}`);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setFeedback(null);
    setSelectedOption(null);
    timer.start();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-purple-500/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-cyan-500/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          {Array.from({ length: QUESTIONS_PER_SESSION }).map((_, i) => (
            <div
              key={i}
              className={`w-10 h-1.5 rounded-full transition-all duration-300 ${
                i < currentIndex
                  ? "bg-purple-500"
                  : i === currentIndex
                  ? "bg-linear-to-r from-purple-500 to-cyan-500"
                  : "bg-border"
              }`}
              style={
                i === currentIndex
                  ? { background: "linear-gradient(to right, #a855f7, #06b6d4)" }
                  : undefined
              }
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} / {QUESTIONS_PER_SESSION}
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="flex justify-center mb-8" data-onboarding="timer">
              <CircularTimer timeLeft={timerPaused ? TIMER_SECONDS : timer.timeLeft} />
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                What comes next?
              </p>
            </div>

            <div
              className="flex items-center justify-center gap-3 md:gap-4 mb-10 flex-wrap"
              data-onboarding="sequence-area"
            >
              {question.sequence.map((item, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden glass">
                      <Image
                        src={question.sequence_images[i]}
                        alt={item}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground font-medium">
                      {item}
                    </span>
                  </div>
                  {i < question.sequence.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
              <ArrowRight className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-2 border-dashed border-purple-400/50 flex items-center justify-center">
                <span className="text-3xl text-purple-400">?</span>
              </div>
            </div>

            <div
              className="grid grid-cols-3 gap-2 md:gap-4 max-w-3xl mx-auto"
              data-onboarding="options-area"
            >
              {question.options.map((option, i) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === question.correct_answer;
                const showCorrect = feedback && isCorrect;
                const showWrong = feedback && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleAnswer(option)}
                    disabled={!!feedback}
                    className={`relative group rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                      showCorrect
                        ? "ring-2 ring-emerald-400 shadow-lg shadow-emerald-400/20"
                        : showWrong
                        ? "ring-2 ring-red-400 shadow-lg shadow-red-400/20"
                        : feedback
                        ? "opacity-50"
                        : "hover:scale-[1.03] hover:shadow-lg"
                    }`}
                  >
                    <div className="glass p-2 md:p-4 flex flex-col items-center gap-1.5 md:gap-3">
                      <div className="w-full aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={question.option_images?.[i] || ""}
                          alt={option}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-xs md:text-sm truncate w-full text-center">{option}</span>
                      {showCorrect && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      )}
                      {showWrong && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-400 flex items-center justify-center">
                          <X className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
                data-onboarding="feedback-area"
              >
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                    feedback === "correct"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-red-400/10 text-red-400"
                  }`}
                >
                  {feedback === "correct" ? (
                    <>
                      <Check className="w-4 h-4" />
                      Correct! +{answers[answers.length - 1]?.points} pts
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      {selectedOption
                        ? `Wrong! The answer was ${question.correct_answer}`
                        : `Time's up! The answer was ${question.correct_answer}`}
                    </>
                  )}
                </div>

                {question.explanation && (
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    {question.explanation}
                  </p>
                )}

                <Button
                  onClick={nextQuestion}
                  className="bg-linear-to-r from-purple-500 to-cyan-500 border-0 hover:opacity-90 group"
                >
                  {currentIndex + 1 >= questions.length
                    ? "See Results"
                    : "Next Question"}
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
