"use client";

import { agentIdentity } from "@/lib/agent-identity";
import { useDonate } from "./DonateProvider";
import { useLiveState } from "./LiveStateProvider";
import { getTimeUntilMidnightUTC } from "@/lib/utils";

type DonateButtonProps = {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "urgent";
  className?: string;
  label?: string;
  amount?: number;
};

export function DonateButton({
  size = "md",
  variant = "primary",
  className = "",
  label,
  amount,
}: DonateButtonProps) {
  const { openDonate } = useDonate();
  const { todayRaised, dailyTarget, isFunded } = useLiveState();

  // Determine urgency from live state
  const time = getTimeUntilMidnightUTC();
  const pct = todayRaised / dailyTarget;
  let progressState: "on_pace" | "behind" | "critical" | "funded" = "on_pace";
  if (isFunded || pct >= 1) {
    progressState = "funded";
  } else if (time.hours < 3) {
    progressState = "critical";
  } else {
    const hoursPassed = 24 - time.hours - time.minutes / 60;
    const expectedPct = hoursPassed / 24;
    if (pct < expectedPct * 0.7) progressState = "behind";
  }

  const isCritical = progressState === "critical" || progressState === "behind";
  const effectiveVariant = variant === "primary" && isCritical ? "urgent" : variant;

  const defaultLabel = label ?? `Save ${agentIdentity.name}`;

  const sizeClasses = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-10 py-5 text-lg",
  };

  const variantClasses = {
    primary: "bg-bone text-abyss hover:bg-bone/90 font-medium",
    outline: "border border-bone/20 text-bone/70 hover:text-bone hover:border-bone/40 font-medium",
    urgent: "bg-red-600 hover:bg-red-500 text-white font-medium shadow-[0_0_30px_rgba(239,68,68,0.3)]",
  };

  return (
    <button
      onClick={() => openDonate(amount)}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-300 ${sizeClasses[size]} ${variantClasses[effectiveVariant]} ${className}`}
      aria-label={`Donate to keep ${agentIdentity.name} alive`}
    >
      {defaultLabel}
    </button>
  );
}
