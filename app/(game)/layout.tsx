import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GameLayoutClient } from "./layout-client";

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("has_onboarded")
    .eq("id", user.id)
    .single();

  const needsOnboarding = !profile?.has_onboarded;

  return (
    <GameLayoutClient needsOnboarding={needsOnboarding}>
      {children}
    </GameLayoutClient>
  );
}
