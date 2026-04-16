"use client";

import { TIMER_SECONDS } from "@/lib/game/scoring";

export function CircularTimer({ timeLeft }: { timeLeft: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / TIMER_SECONDS;
  const offset = circumference * (1 - progress);

  const color =
    timeLeft > 6
      ? "stroke-emerald-400"
      : timeLeft > 3
      ? "stroke-amber-400"
      : "stroke-red-400";

  const glowColor =
    timeLeft > 6
      ? "drop-shadow(0 0 8px rgba(52, 211, 153, 0.5))"
      : timeLeft > 3
      ? "drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))"
      : "drop-shadow(0 0 8px rgba(248, 113, 113, 0.5))";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg
        className="w-24 h-24 -rotate-90"
        viewBox="0 0 100 100"
        style={{ filter: glowColor }}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-border/30"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${color} transition-all duration-100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-2xl font-bold tabular-nums ${
            timeLeft <= 3 ? "text-red-400" : "text-foreground"
          }`}
        >
          {Math.ceil(timeLeft)}
        </span>
      </div>
    </div>
  );
}
