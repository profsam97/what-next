"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type OnboardingStep = {
  id: string;
  target: string;
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right";
  action?: "click-target" | "wait" | "auto";
  delay?: number;
};

type OnboardingPhase = "home" | "play" | "results" | "done";

const HOME_STEPS: OnboardingStep[] = [
  {
    id: "home-welcome",
    target: "[data-onboarding='home-title']",
    title: "Welcome to What's Next? 🎮",
    description: "This is your home base. From here you'll pick a category and start playing. Let us walk you through it!",
    placement: "bottom",
    action: "auto",
    delay: 2500,
  },
  {
    id: "home-categories",
    target: "[data-onboarding='category-grid']",
    title: "Pick a Category",
    description: "Each category has unique sequences to solve. Tap one to start playing!",
    placement: "top",
    action: "click-target",
  },
];

const PLAY_STEPS: OnboardingStep[] = [
  {
    id: "play-sequence",
    target: "[data-onboarding='sequence-area']",
    title: "Spot the Pattern 🔍",
    description: "These items follow a pattern. Your job is to figure out what comes after the question mark.",
    placement: "bottom",
    action: "auto",
    delay: 3000,
  },
  {
    id: "play-timer",
    target: "[data-onboarding='timer']",
    title: "Beat the Clock ⏱️",
    description: "You have 10 seconds per question. The faster you answer correctly, the more bonus points you earn!",
    placement: "bottom",
    action: "auto",
    delay: 3000,
  },
  {
    id: "play-options",
    target: "[data-onboarding='options-area']",
    title: "Choose Your Answer",
    description: "Pick the option you think comes next in the sequence. Go ahead, make your choice!",
    placement: "top",
    action: "auto",
    delay: 3000,
  },
];


const RESULTS_STEPS: OnboardingStep[] = [
  {
    id: "results-title",
    target: "[data-onboarding='results-title']",
    title: "Your Title 🏆",
    description: "Based on your score, you earn a title — from Clueless Rookie all the way to Oracle of What's Next!",
    placement: "right",
    action: "auto",
    delay: 2500,
  },
  {
    id: "results-score",
    target: "[data-onboarding='results-score']",
    title: "Score Breakdown",
    description: "See how you did on each question. Max possible score is 450 (3 questions × 150 pts each).",
    placement: "right",
    action: "auto",
    delay: 2500,
  },
  {
    id: "results-actions",
    target: "[data-onboarding='results-actions']",
    title: "What's Next? 😏",
    description: "Play again to beat your score, try another category, or check the global leaderboard. You're all set!",
    placement: "right",
    action: "click-target",
  },
];

type OnboardingContextType = {
  isOnboarding: boolean;
  phase: OnboardingPhase;
  currentStep: OnboardingStep | null;
  stepIndex: number;
  totalSteps: number;
  advance: () => void;
  setPhase: (phase: OnboardingPhase) => void;
  pauseUntilResults: () => void;
  timerPaused: boolean;
  resumeTimer: () => void;
  complete: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextType>({
  isOnboarding: false,
  phase: "done",
  currentStep: null,
  stepIndex: 0,
  totalSteps: 0,
  advance: () => {},
  setPhase: () => {},
  pauseUntilResults: () => {},
  timerPaused: false,
  resumeTimer: () => {},
  complete: async () => {},
});

export function useOnboarding() {
  return useContext(OnboardingContext);
}

function getStepsForPhase(phase: OnboardingPhase): OnboardingStep[] {
  switch (phase) {
    case "home": return HOME_STEPS;
    case "play": return PLAY_STEPS;
    case "results": return RESULTS_STEPS;
    default: return [];
  }
}

export function OnboardingProvider({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  const [isOnboarding, setIsOnboarding] = useState(active);
  const [phase, setPhaseState] = useState<OnboardingPhase>(active ? "home" : "done");
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>(active ? HOME_STEPS : []);
  const [timerPaused, setTimerPaused] = useState(false);

  const setPhase = useCallback((newPhase: OnboardingPhase) => {
    if (!isOnboarding) return;
    setPhaseState(newPhase);
    const newSteps = getStepsForPhase(newPhase);
    setSteps(newSteps);
    setStepIndex(0);
    if (newPhase === "play") {
      setTimerPaused(true);
    }
  }, [isOnboarding]);

  const advance = useCallback(() => {
    setStepIndex((prev) => {
      const next = prev + 1;
      if (next >= steps.length) {
        setSteps([]);
        return 0;
      }
      return next;
    });
  }, [steps.length]);

  const resumeTimer = useCallback(() => {
    setTimerPaused(false);
  }, []);

  const pauseUntilResults = useCallback(() => {
    if (!isOnboarding) return;
    setSteps([]);
    setStepIndex(0);
    setPhaseState("play");
  }, [isOnboarding]);

  const complete = useCallback(async () => {
    setIsOnboarding(false);
    setPhaseState("done");
    setSteps([]);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ has_onboarded: true })
        .eq("id", user.id);
    }
  }, []);

  useEffect(() => {
    if (!isOnboarding || steps.length === 0) return;
    const step = steps[stepIndex];
    if (!step) return;

    if (step.action === "auto" && step.delay) {
      const timer = setTimeout(advance, step.delay);
      return () => clearTimeout(timer);
    }
  }, [isOnboarding, steps, stepIndex, advance]);

  const currentStep = steps[stepIndex] ?? null;

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        phase,
        currentStep,
        stepIndex,
        totalSteps: steps.length,
        advance,
        setPhase,
        pauseUntilResults,
        timerPaused,
        resumeTimer,
        complete,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
