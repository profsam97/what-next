"use client";

import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { OnboardingOverlay } from "@/components/onboarding/onboarding-overlay";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function GameLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_onboarded")
          .eq("id", user.id)
          .single();
        setNeedsOnboarding(!profile?.has_onboarded);
      }
      setChecked(true);
    }
    check();
  }, []);

  if (!checked) {
    return <>{children}</>;
  }

  return (
    <OnboardingProvider active={needsOnboarding}>
      {children}
      <OnboardingOverlay />
    </OnboardingProvider>
  );
}
