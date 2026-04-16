"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

function FloatingOrb({
  size,
  color,
  x,
  y,
  delay,
  duration,
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        background: color,
        left: x,
        top: y,
      }}
      animate={{
        x: [0, 80, -60, 40, 0],
        y: [0, -50, 30, -20, 0],
        scale: [1, 1.15, 0.9, 1.1, 1],
        opacity: [0.5, 0.8, 0.4, 0.7, 0.5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function DriftingShape({
  startX,
  startY,
  endX,
  size,
  duration,
  delay,
  color,
  shape,
}: {
  startX: string;
  startY: string;
  endX: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  shape: "circle" | "ring" | "diamond" | "cross";
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left: startX, top: startY }}
      animate={{
        x: [0, endX],
        y: [0, -30, 20, -10, 0],
        rotate: shape === "diamond" ? [0, 180, 360] : [0, 90, 0],
        opacity: [0, 0.9, 0.6, 0.9, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {shape === "circle" && (
        <div
          className="rounded-full"
          style={{ width: size, height: size, background: color }}
        />
      )}
      {shape === "ring" && (
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            border: `1.5px solid ${color}`,
            background: "transparent",
          }}
        />
      )}
      {shape === "diamond" && (
        <div
          style={{
            width: size,
            height: size,
            background: color,
            transform: "rotate(45deg)",
            borderRadius: 3,
          }}
        />
      )}
      {shape === "cross" && (
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2"
            style={{ width: size, height: 1.5, background: color }}
          />
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2"
            style={{ width: 1.5, height: size, background: color }}
          />
        </div>
      )}
    </motion.div>
  );
}

function StreamLine({
  y,
  delay,
  duration,
  direction,
}: {
  y: string;
  delay: number;
  duration: number;
  direction: "left" | "right";
}) {
  const startX = direction === "right" ? "-10%" : "110%";
  const endX = direction === "right" ? "110%" : "-10%";

  return (
    <motion.div
      className="absolute"
      style={{
        top: y,
        left: startX,
        width: "30%",
        background: `linear-gradient(${direction === "right" ? "to right" : "to left"}, transparent, rgba(168,85,247,0.4), rgba(6,182,212,0.3), transparent)`,
        height: 2,
      }}
      animate={{ left: [startX, endX] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function FloatingIcon({
  emoji,
  x,
  y,
  delay,
  duration,
  driftX,
  driftY,
}: {
  emoji: string;
  x: string;
  y: string;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
}) {
  return (
    <motion.div
      className="absolute text-lg select-none"
      style={{ left: x, top: y, opacity: 0 }}
      animate={{
        x: [0, driftX, driftX * 0.5, driftX * 0.8, 0],
        y: [0, driftY, driftY * -0.3, driftY * 0.5, 0],
        opacity: [0, 0.35, 0.2, 0.35, 0],
        scale: [0.8, 1, 0.9, 1.05, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}

function Particle({ index }: { index: number }) {
  const config = useMemo(() => ({
    left: `${(index * 5.3 + 7) % 100}%`,
    size: (index % 3) + 1.5,
    duration: 8 + (index % 5) * 2,
  }), [index]);

  return (
    <motion.div
      className="absolute rounded-full bg-white/40"
      style={{
        width: config.size,
        height: config.size,
        left: config.left,
        bottom: "-5%",
      }}
      animate={{
        y: [0, -900],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration: config.duration,
        delay: index * 0.7,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingOrb size={600} color="radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)" x="-10%" y="-20%" delay={0} duration={20} />
      <FloatingOrb size={500} color="radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)" x="60%" y="10%" delay={2} duration={25} />
      <FloatingOrb size={400} color="radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)" x="30%" y="60%" delay={4} duration={22} />
      <FloatingOrb size={350} color="radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)" x="80%" y="70%" delay={1} duration={18} />
      <FloatingOrb size={300} color="radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)" x="10%" y="80%" delay={3} duration={24} />

      <StreamLine y="20%" delay={0} duration={12} direction="right" />
      <StreamLine y="35%" delay={4} duration={15} direction="left" />
      <StreamLine y="55%" delay={2} duration={13} direction="right" />
      <StreamLine y="70%" delay={6} duration={14} direction="left" />
      <StreamLine y="85%" delay={1} duration={11} direction="right" />
      <StreamLine y="45%" delay={8} duration={16} direction="left" />

      {mounted && (
        <>
          <DriftingShape startX="5%" startY="15%" endX={300} size={10} duration={18} delay={0} color="rgba(168,85,247,0.6)" shape="circle" />
          <DriftingShape startX="90%" startY="25%" endX={-250} size={14} duration={22} delay={3} color="rgba(6,182,212,0.5)" shape="ring" />
          <DriftingShape startX="15%" startY="45%" endX={200} size={12} duration={20} delay={1} color="rgba(236,72,153,0.5)" shape="diamond" />
          <DriftingShape startX="80%" startY="60%" endX={-180} size={10} duration={16} delay={5} color="rgba(168,85,247,0.5)" shape="cross" />
          <DriftingShape startX="50%" startY="10%" endX={150} size={8} duration={19} delay={2} color="rgba(6,182,212,0.6)" shape="circle" />
          <DriftingShape startX="30%" startY="75%" endX={-120} size={16} duration={24} delay={4} color="rgba(245,158,11,0.4)" shape="ring" />
          <DriftingShape startX="70%" startY="35%" endX={100} size={11} duration={17} delay={7} color="rgba(34,197,94,0.5)" shape="diamond" />
          <DriftingShape startX="20%" startY="85%" endX={250} size={9} duration={21} delay={6} color="rgba(236,72,153,0.4)" shape="cross" />

          <FloatingIcon emoji="🔮" x="8%" y="20%" delay={0} duration={16} driftX={40} driftY={-30} />
          <FloatingIcon emoji="⚡" x="85%" y="15%" delay={3} duration={18} driftX={-30} driftY={20} />
          <FloatingIcon emoji="🧩" x="75%" y="65%" delay={5} duration={20} driftX={-50} driftY={-20} />
          <FloatingIcon emoji="🎯" x="12%" y="70%" delay={2} duration={17} driftX={35} driftY={-25} />
          <FloatingIcon emoji="✨" x="45%" y="8%" delay={4} duration={19} driftX={-20} driftY={30} />
          <FloatingIcon emoji="🏆" x="92%" y="45%" delay={1} duration={15} driftX={-40} driftY={-15} />
        </>
      )}

      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.15) 0%, transparent 50%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.12) 0%, transparent 40%)" }} />

      {mounted &&
        Array.from({ length: 25 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
