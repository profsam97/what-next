"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const demos = [
  {
    sequence: ["🥚", "🐛", "🫘"],
    answer: "🦋",
    labels: ["Egg", "Caterpillar", "Cocoon", "Butterfly"],
    color: "from-green-400 to-emerald-500",
  },
  {
    sequence: ["📼", "💿", "🔌"],
    answer: "☁️",
    labels: ["VHS", "CD", "USB", "Cloud"],
    color: "from-amber-400 to-orange-500",
  },
  {
    sequence: ["👶", "🧒", "🧑‍🎓"],
    answer: "🧑‍💼",
    labels: ["Baby", "Child", "Teen", "Adult"],
    color: "from-purple-400 to-pink-500",
  },
];

export function SequenceDemo() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [demoIndex]);

  useEffect(() => {
    if (step === 3) {
      const timeout = setTimeout(() => setShowAnswer(true), 600);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  useEffect(() => {
    if (showAnswer) {
      const timeout = setTimeout(() => {
        setShowAnswer(false);
        setStep(0);
        setDemoIndex((prev) => (prev + 1) % demos.length);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [showAnswer]);

  const demo = demos[demoIndex];

  return (
    <div className="relative">
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
          <span className="text-[10px] text-muted-foreground ml-2 uppercase tracking-widest">Live Preview</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={demoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 md:gap-4">
              {demo.sequence.map((emoji, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                      step > i
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl glass flex items-center justify-center text-2xl md:text-3xl">
                      {emoji}
                    </div>
                    <span className="text-[10px] md:text-xs text-muted-foreground">
                      {demo.labels[i]}
                    </span>
                  </motion.div>
                  {i < demo.sequence.length - 1 && step > i && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </motion.div>
                  )}
                </div>
              ))}

              {step >= 3 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </motion.div>
              )}

              <AnimatePresence>
                {step >= 3 && !showAnswer && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.1, 1] }}
                    exit={{ scale: 0 }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 border-dashed border-purple-400/50 flex items-center justify-center"
                  >
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="text-xl text-purple-400"
                    >
                      ?
                    </motion.span>
                  </motion.div>
                )}
                {showAnswer && (
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl bg-linear-to-br ${demo.color} shadow-lg`}>
                      {demo.answer}
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] md:text-xs text-emerald-400 font-medium">
                        {demo.labels[3]}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-1.5 mt-5">
          {demos.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === demoIndex ? "w-6 bg-purple-400" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
