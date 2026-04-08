"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { agentIdentity } from "@/lib/agent-identity";
import { agentState } from "@/lib/agent-state";
import { formatCurrency, getTimeUntilMidnightUTC, getAccentColor } from "@/lib/utils";
import { getProgressState } from "@/lib/copy";

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

  const pct = agentState.todayRaised / agentState.dailyTarget;
  const accent = getAccentColor(pct);
  const progressState = getProgressState(agentState);
  const isCritical = progressState === "critical";

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-surface/90 backdrop-blur-md border border-white/10 shadow-2xl ${
        isCritical ? "animate-heartbeat-fast" : ""
      }`}
      role="status"
      aria-label={`Day ${agentState.dayNumber}, ${formatCurrency(agentState.todayRaised)} of ${formatCurrency(agentState.dailyTarget)}, ${time.hours} hours ${time.minutes} minutes left`}
    >
      {/* Avatar */}
      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
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
        className="w-2 h-2 rounded-full animate-pulse-glow shrink-0"
        style={{ backgroundColor: accent }}
      />

      {/* Info */}
      <div className="font-mono-numbers text-xs text-bone/80 whitespace-nowrap">
        <span>Day {agentState.dayNumber}</span>
        <span className="text-bone/30 mx-1.5">·</span>
        <span style={{ color: accent }}>
          {formatCurrency(agentState.todayRaised)}/{formatCurrency(agentState.dailyTarget)}
        </span>
        <span className="text-bone/30 mx-1.5">·</span>
        <span>{time.hours}h {String(time.minutes).padStart(2, "0")}m left</span>
      </div>
    </motion.div>
  );
}
