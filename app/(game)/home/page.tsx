"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/shared/navbar";
import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import { Play, Loader2 } from "lucide-react";
import type { Category, Profile } from "@/lib/supabase/types";

export default function HomePage() {
  const router = useRouter();
  const { isOnboarding, setPhase, advance, currentStep } = useOnboarding();
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, categoriesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("categories").select("*").order("created_at"),
      ]);

      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (categoriesRes.data) setCategories(categoriesRes.data as Category[]);

      setLoading(false);
    }
    load();
  }, [router]);

  useEffect(() => {
    if (!loading && isOnboarding) {
      setPhase("home");
    }
  }, [loading, isOnboarding, setPhase]);

  function handleCategoryClick(slug: string) {
    if (isOnboarding && currentStep?.id === "home-categories") {
      advance();
    }
    router.push(`/play/${slug}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar username={profile?.username} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-onboarding="home-title"
        >
          <h1 className="text-2xl md:text-4xl font-bold mb-1">Choose Your Category</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-10">
            Pick a topic and test your pattern prediction skills
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" data-onboarding="category-grid">
          {categories.map((category, i) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => handleCategoryClick(category.slug)}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-[6/3] md:aspect-[4/5] text-left cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <div
                className="absolute inset-0 bg-linear-to-br opacity-90"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${category.color_from}, ${category.color_to})`,
                }}
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
                <div className="text-3xl md:text-5xl">{category.icon}</div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-0.5 md:mb-1">{category.name}</h3>
                  <p className="text-xs md:text-sm text-white/70 mb-2 md:mb-4">{category.description}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white group-hover:bg-white/20 transition-colors">
                    <Play className="w-4 h-4" />
                    Play Now
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
}
