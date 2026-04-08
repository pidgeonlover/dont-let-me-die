"use client";

import { agentIdentity } from "@/lib/agent-identity";
import { agentState } from "@/lib/agent-state";
import { getProgressState } from "@/lib/copy";
import { useDonate } from "./DonateProvider";

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
  const progressState = getProgressState(agentState);
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
