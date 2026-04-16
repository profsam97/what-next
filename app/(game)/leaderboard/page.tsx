"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/shared/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Loader2, Crown, User } from "lucide-react";
import type { Profile } from "@/lib/supabase/types";

type LeaderboardRow = {
  id: string;
  user_id: string;
  total_score: number;
  title: string;
  completed_at: string;
  profiles: { username: string } | null;
  categories: { name: string; slug: string; icon: string } | null;
};

const rankIcons = [
  <Crown key="1" className="w-5 h-5 text-amber-400" />,
  <Medal key="2" className="w-5 h-5 text-gray-300" />,
  <Medal key="3" className="w-5 h-5 text-amber-600" />,
];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardRow[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const playerRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (p) setProfile(p as Profile);
      }

      const { data } = await supabase
        .from("game_sessions")
        .select("id, user_id, total_score, title, completed_at, profiles(username), categories(name, slug, icon)")
        .order("total_score", { ascending: false })
        .limit(50);

      if (data) setEntries(data as unknown as LeaderboardRow[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    activeTab === "all"
      ? entries
      : entries.filter((e) => e.categories?.slug === activeTab);

  const playerRank = userId
    ? filtered.findIndex((e) => e.user_id === userId)
    : -1;

  const playerBestEntry = userId
    ? filtered.find((e) => e.user_id === userId)
    : null;

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

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Top scores from all players</p>
        </motion.div>

        {playerBestEntry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl p-5 border border-purple-400/30 flex items-center gap-4"
            style={{ background: "rgba(168,85,247,0.08)" }}
          >
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Your Best</p>
              <p className="font-bold">
                {profile?.username || "You"}{" "}
                <span className="text-muted-foreground font-normal">— {playerBestEntry.title}</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                #{playerRank + 1}
              </p>
              <p className="text-sm text-muted-foreground">{playerBestEntry.total_score} pts</p>
            </div>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="life">Life</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="popculture">Pop Culture</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filtered.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No scores yet. Be the first to play!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((entry, i) => {
                  const isPlayer = userId === entry.user_id;

                  return (
                    <motion.div
                      key={entry.id}
                      ref={isPlayer && !playerRowRef.current ? playerRowRef : undefined}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`rounded-xl p-4 flex items-center gap-4 transition-all ${
                        isPlayer
                          ? "ring-2 ring-purple-400/50 shadow-lg shadow-purple-500/10"
                          : i < 3
                          ? "glass glass-hover ring-1 ring-amber-400/20"
                          : "glass glass-hover"
                      }`}
                      style={isPlayer ? { background: "rgba(168,85,247,0.1)" } : undefined}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        {i < 3 ? (
                          rankIcons[i]
                        ) : (
                          <span className="text-sm font-bold text-muted-foreground">
                            {i + 1}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold truncate ${isPlayer ? "text-purple-300" : ""}`}>
                            {entry.profiles?.username || "Anonymous"}
                            {isPlayer && (
                              <span className="ml-1.5 text-[10px] uppercase tracking-widest text-purple-400 font-medium">
                                you
                              </span>
                            )}
                          </p>
                          {entry.categories?.icon && (
                            <span className="text-sm">{entry.categories.icon}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.title}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`text-lg font-bold ${isPlayer ? "text-purple-300" : ""}`}>
                          {entry.total_score}
                        </p>
                        <p className="text-xs text-muted-foreground">pts</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
