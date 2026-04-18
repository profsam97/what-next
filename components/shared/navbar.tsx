"use client";

import { Sparkles, LogOut, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar({ username }: { username?: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="flex items-center justify-between px-4 md:px-6 py-3 max-w-7xl mx-auto w-full border-b border-border/50">
      <Link href="/home" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm md:text-lg font-bold tracking-tight">What&apos;s Next?</span>
      </Link>
      <div className="flex items-center gap-1.5 md:gap-3">
        <Button variant="ghost" size="sm" asChild className="px-2 md:px-3">
          <Link href="/leaderboard">
            <Trophy className="w-4 h-4 md:mr-1" />
            <span className="hidden md:inline">Leaderboard</span>
          </Link>
        </Button>
        {username && (
          <span className="text-xs md:text-sm text-muted-foreground truncate max-w-[120px]">{username}</span>
        )}
        <ThemeToggle />
        <Button variant="ghost" size="icon-sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
}
