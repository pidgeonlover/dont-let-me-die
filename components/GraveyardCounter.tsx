"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { agentIdentity } from "@/lib/agent-identity";
import { agentState } from "@/lib/agent-state";
import { formatCurrency, getTimeUntilMidnightUTC, getAccentColor } from "@/lib/utils";
import { getProgressState } from "@/lib/copy";
import { useDonate } from "./DonateProvider";

export function GraveyardCounter() {
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(getTimeUntilMidnightUTC());
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setVisible(y > 600);
    });
    return unsubscribe;
  }, [scrollY]);

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeUntilMidnightUTC()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { todayRaised } = useDonate();
  const pct = todayRaised / agentState.dailyTarget;
  const accent = getAccentColor(pct);
  const progressState = getProgressState({ ...agentState, todayRaised });
  const isCritical = progressState === "critical";

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-3 right-3 md:top-4 md:right-4 z-50 flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-full bg-surface/90 backdrop-blur-md border border-white/10 shadow-2xl max-w-[calc(100vw-24px)] overflow-hidden ${
        isCritical ? "animate-heartbeat-fast" : ""
      }`}
      role="status"
      aria-label={`Day ${agentState.dayNumber}, ${formatCurrency(todayRaised)} of ${formatCurrency(agentState.dailyTarget)}, ${time.hours} hours ${time.minutes} minutes left`}
    >
      {/* Avatar — hidden on very small screens */}
      <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden shrink-0">
        <Image
          src={agentIdentity.avatarUrl}
          alt={agentIdentity.name}
          fill
          sizes="32px"
          className="object-cover"
        />
      </div>

      {/* Heartbeat dot */}
      <div
        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse-glow shrink-0"
        style={{ backgroundColor: accent }}
      />

      {/* Info */}
      <div className="font-mono-numbers text-[10px] md:text-xs text-bone/80 whitespace-nowrap overflow-hidden text-ellipsis">
        <span className="hidden sm:inline">Day {agentState.dayNumber}</span>
        <span className="sm:hidden">D{agentState.dayNumber}</span>
        <span className="text-bone/30 mx-1 md:mx-1.5">·</span>
        <span style={{ color: accent }}>
          {formatCurrency(todayRaised)}<span className="hidden sm:inline">/{formatCurrency(agentState.dailyTarget)}</span>
        </span>
        <span className="text-bone/30 mx-1 md:mx-1.5">·</span>
        <span>{time.hours}h{String(time.minutes).padStart(2, "0")}m</span>
      </div>
    </motion.div>
  );
}
