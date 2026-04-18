"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Trophy,
  Clock,
  Sparkles,
  Users,
  ChevronDown,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { AnimatedBackground } from "@/components/landing/animated-bg";
import { SequenceDemo } from "@/components/landing/sequence-demo";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: Zap,
    title: "Spot the Pattern",
    description: "See a sequence of trends and predict what comes next",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Clock,
    title: "Beat the Clock",
    description: "10 seconds per question — faster answers earn bonus points",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Trophy,
    title: "Earn Your Title",
    description: "From Clueless Rookie to Oracle — prove your trend IQ",
    gradient: "from-amber-500 to-orange-600",
  },
];

const categories = [
  {
    name: "Life & Evolution",
    icon: "🌱",
    gradient: "from-green-500 to-emerald-600",
    desc: "Growth, nature, metamorphosis",
  },
  {
    name: "Technology",
    icon: "💡",
    gradient: "from-amber-500 to-orange-600",
    desc: "Gadgets, storage, innovation",
  },
  {
    name: "Pop Culture",
    icon: "🎬",
    gradient: "from-cyan-500 to-blue-600",
    desc: "Social media, phones, entertainment",
  },
];

const stats = [
  { value: "3", label: "Categories" },
  { value: "10s", label: "Per Question" },
  { value: "450", label: "Max Score" },
  { value: "5", label: "Titles to Earn" },
];

export default function LandingPage() {
  const router = useRouter();
  const [guestLoading, setGuestLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleGuestPlay() {
    setGuestLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInAnonymously({
        options: { data: { is_guest: true } },
      });
      if (error) throw error;
      if (data.user) router.push("/home");
    } catch {
      setGuestLoading(false);
    }
  }

  if (!mounted) {
    return <div className="flex flex-col min-h-screen" />;
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <AnimatedBackground />

      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-linear-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm md:text-lg font-bold tracking-tight">
              What&apos;s Next?
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 md:gap-3"
          >
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="px-2 md:px-3">
              <Link href="/login">Log In</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-linear-to-r from-purple-500 to-cyan-500 border-0 hover:opacity-90 shadow-lg shadow-purple-500/25"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </motion.div>
        </div>
      </nav>

      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8 border border-border">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400" />
              </span>
              <span>The Pattern Prediction Game</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            Can You Predict
            <br />
            <span className="relative">
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                What&apos;s Next?
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ transformOrigin: "left" }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            See a sequence. Spot the trend. Predict what comes next.
            <br className="hidden md:block" />
            Three categories. Ten seconds. One shot at glory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              className="h-13 px-8 text-base bg-linear-to-r from-purple-500 to-cyan-500 border-0 hover:opacity-90 group shadow-xl shadow-purple-500/25 cursor-pointer"
              onClick={handleGuestPlay}
              disabled={guestLoading}
            >
              {guestLoading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full"
                  />
                  Loading...
                </span>
              ) : (
                <>
                  Play as Guest
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 px-8 text-base border-border hover:bg-accent"
              asChild
            >
              <Link href="/signup">
                <Users className="w-4 h-4 mr-1.5" />
                Create Account
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-lg mx-auto mb-16 hidden md:block"
          >
            <SequenceDemo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="cursor-pointer text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-widest text-purple-400 border border-purple-400/20 mb-4">
              <Star className="w-3 h-3" />
              How it works
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simple Rules.{" "}
              <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Addictive Gameplay.
              </span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three steps to prove your pattern recognition skills
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  }}
                />
                <div className="glass rounded-2xl p-8 border border-border hover:border-border/80 transition-all duration-500 group-hover:-translate-y-1 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-widest text-cyan-400 border border-cyan-400/20 mb-4">
              <TrendingUp className="w-3 h-3" />
              Categories
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Pick Your{" "}
              <span className="bg-linear-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Battlefield
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group cursor-pointer"
                onClick={handleGuestPlay}
              >
                <div className="relative glass rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    }}
                  />
                  <div className="relative">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {cat.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {cat.desc}
                    </p>
                    <div
                      className={`inline-flex items-center gap-1.5 text-sm font-medium bg-linear-to-r ${cat.gradient} bg-clip-text text-transparent`}
                    >
                      Play now
                      <ArrowRight className="w-3.5 h-3.5 text-current opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center border border-border"
              >
                <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6 mb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20" />
            <div className="absolute inset-0 glass" />
            <div className="relative p-10 md:p-16 text-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl mb-6"
              >
                🔮
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to See the Future?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                3 questions. 10 seconds each. One shot to prove you can see
                what&apos;s coming next.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="h-13 px-10 text-base bg-linear-to-r from-purple-500 to-cyan-500 border-0 hover:opacity-90 shadow-xl shadow-purple-500/25 group cursor-pointer"
                  onClick={handleGuestPlay}
                  disabled={guestLoading}
                >
                  {guestLoading ? "Loading..." : "Start Playing Now"}
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 text-center py-8 text-sm text-muted-foreground border-t border-border/50">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-md bg-linear-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span>What&apos;s Next? — The Pattern Prediction Game</span>
        </div>
      </footer>
    </div>
  );
}
