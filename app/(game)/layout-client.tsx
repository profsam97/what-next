"use client";

import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { OnboardingOverlay } from "@/components/onboarding/onboarding-overlay";

export function GameLayoutClient({
  children,
  needsOnboarding,
}: {
  children: React.ReactNode;
  needsOnboarding: boolean;
}) {
  return (
    <OnboardingProvider active={needsOnboarding}>
      {children}
      <OnboardingOverlay />
    </OnboardingProvider>
  );
}
