"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useOnboarding } from "./onboarding-provider";
import { ArrowRight } from "lucide-react";

type Rect = { top: number; left: number; width: number; height: number };

export function OnboardingOverlay() {
  const { isOnboarding, currentStep, stepIndex, totalSteps, advance } =
    useOnboarding();
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const measureTarget = useCallback(() => {
    if (!currentStep) return;
    const el = document.querySelector(currentStep.target);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    const padding = 16;
    setTargetRect({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    });

    const placement = currentStep.placement || "bottom";
    const tooltipWidth = 340;
    let top = 0;
    let left = 0;
    let transform: string | undefined;

    if (placement === "right") {
      top = rect.top + rect.height / 2;
      left = rect.right + padding + 20;
      transform = "translateY(-50%)";
      if (left + tooltipWidth > window.innerWidth - 20) {
        left = rect.left - padding - 20 - tooltipWidth;
        if (left < 20) left = 20;
      }
    } else if (placement === "left") {
      top = rect.top + rect.height / 2;
      left = rect.left - padding - 20 - tooltipWidth;
      transform = "translateY(-50%)";
      if (left < 20) {
        left = rect.right + padding + 20;
      }
    } else {
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      if (left < 20) left = 20;
      if (left + tooltipWidth > window.innerWidth - 20)
        left = window.innerWidth - 20 - tooltipWidth;

      const tooltipHeight = 160;
      if (placement === "bottom") {
        top = rect.bottom + padding + 20;
        if (top + tooltipHeight > window.innerHeight) {
          top = rect.top - padding - 20;
          transform = "translateY(-100%)";
          if (top - tooltipHeight < 0) {
            top = window.innerHeight - tooltipHeight - 20;
          }
        }
      } else if (placement === "top") {
        top = rect.top - padding - 20;
        transform = "translateY(-100%)";
        if (top - tooltipHeight < 0) {
          top = rect.bottom + padding + 20;
          transform = undefined;
          if (top + tooltipHeight > window.innerHeight) {
            top = window.innerHeight - tooltipHeight - 20;
            transform = undefined;
          }
        }
      }
    }

    setTooltipStyle({
      position: "fixed",
      top,
      left,
      width: tooltipWidth,
      ...(transform ? { transform } : {}),
    });
  }, [currentStep]);

  useEffect(() => {
    if (!isOnboarding || !currentStep) return;
    const timeout = setTimeout(measureTarget, 150);
    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget);
    };
  }, [isOnboarding, currentStep, measureTarget]);

  useEffect(() => {
    if (!isOnboarding || !currentStep) return;
    const timeout = setTimeout(measureTarget, 80);
    return () => clearTimeout(timeout);
  }, [stepIndex, isOnboarding, currentStep, measureTarget]);

  if (!isOnboarding || !currentStep) return null;

  const r = targetRect;
  const isClickTarget = currentStep.action === "click-target";
  const overlayColor = "rgba(0,0,0,0.8)";

  const handleDarkClick = () => {
    if (!isClickTarget) advance();
  };

  return (
    <AnimatePresence>
      <motion.div
        key={currentStep.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-9999"
        style={{ pointerEvents: "none" }}
      >
        {r ? (
          <>
            <div
              onClick={handleDarkClick}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: r.top,
                background: overlayColor,
                pointerEvents: "auto",
              }}
            />
            <div
              onClick={handleDarkClick}
              style={{
                position: "fixed",
                top: r.top,
                left: 0,
                width: r.left,
                height: r.height,
                background: overlayColor,
                pointerEvents: "auto",
              }}
            />
            <div
              onClick={handleDarkClick}
              style={{
                position: "fixed",
                top: r.top,
                left: r.left + r.width,
                right: 0,
                height: r.height,
                background: overlayColor,
                pointerEvents: "auto",
              }}
            />
            <div
              onClick={handleDarkClick}
              style={{
                position: "fixed",
                top: r.top + r.height,
                left: 0,
                right: 0,
                bottom: 0,
                background: overlayColor,
                pointerEvents: "auto",
              }}
            />

            <div
              className="fixed pointer-events-none"
              style={{
                top: r.top,
                left: r.left,
                width: r.width,
                height: r.height,
                borderRadius: 20,
                boxShadow:
                  "0 0 0 3px rgba(168,85,247,0.6), 0 0 50px 10px rgba(168,85,247,0.2)",
                zIndex: 1,
              }}
            />
          </>
        ) : (
          <div
            onClick={handleDarkClick}
            style={{
              position: "fixed",
              inset: 0,
              background: overlayColor,
              pointerEvents: "auto",
            }}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          style={{ ...tooltipStyle, zIndex: 10, pointerEvents: "auto" }}
        >
          <div
            className="rounded-2xl p-5 border border-purple-400/30 shadow-2xl shadow-purple-500/20"
            style={{
              background: "rgba(15, 8, 35, 0.95)",
              backdropFilter: "blur(20px)",
            }}
          >
            <h3 className="font-bold text-sm text-white mb-1.5">
              {currentStep.title}
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              {currentStep.description}
            </p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === stepIndex
                        ? "w-5 bg-purple-400"
                        : i < stepIndex
                        ? "w-2 bg-purple-400/40"
                        : "w-2 bg-white/15"
                    }`}
                  />
                ))}
              </div>

              {isClickTarget ? (
                <span className="text-[10px] text-purple-300 uppercase tracking-widest flex items-center gap-1">
                  Tap highlighted area
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-3 h-3" />
                  </motion.span>
                </span>
              ) : currentStep.action === "auto" ? (
                <motion.div
                  className="h-0.5 bg-purple-400/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{
                    duration: (currentStep.delay || 2500) / 1000,
                    ease: "linear",
                  }}
                />
              ) : (
                <button
                  onClick={advance}
                  className="text-[10px] text-purple-300 uppercase tracking-widest flex items-center gap-1 hover:text-purple-200 transition-colors"
                >
                  Next
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
