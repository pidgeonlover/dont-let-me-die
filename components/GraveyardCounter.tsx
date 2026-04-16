"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { agentIdentity } from "@/lib/agent-identity";
import { formatCurrency, getTimeUntilMidnightUTC, getAccentColor } from "@/lib/utils";
import { useLiveState } from "./LiveStateProvider";

export function GraveyardCounter() {
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(getTimeUntilMidnightUTC());
  const { scrollY } = useScroll();
  const { todayRaised, dayNumber, pageState } = useLiveState();

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

  const pct = todayRaised / 500;
  const accent = pageState === "saved" ? "#e8e4dc" : getAccentColor(pct);
  const isCritical = pageState === "raising" && time.hours < 3 && todayRaised < 500;

  if (!visible || pageState === "dead") return null;

  const statusLabel = pageState === "saved"
    ? "Saved"
    : `${formatCurrency(todayRaised)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-3 right-3 md:top-4 md:right-4 z-50 flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-full bg-surface/90 backdrop-blur-md border border-white/10 shadow-2xl max-w-[calc(100vw-24px)] overflow-hidden ${
        isCritical ? "animate-heartbeat-fast" : ""
      }`}
      role="status"
      aria-label={`Day ${dayNumber}, ${formatCurrency(todayRaised)} of $500, ${time.hours} hours ${time.minutes} minutes left`}
    >
      <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden shrink-0">
        <Image
          src={agentIdentity.avatarUrl}
          alt={agentIdentity.name}
          fill
          sizes="32px"
          className="object-cover"
        />
      </div>

      <div
        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse-glow shrink-0"
        style={{ backgroundColor: accent }}
      />

      <div className="font-mono-numbers text-[10px] md:text-xs text-bone/80 whitespace-nowrap overflow-hidden text-ellipsis">
        <span className="hidden sm:inline">Day {dayNumber}</span>
        <span className="sm:hidden">D{dayNumber}</span>
        <span className="text-bone/30 mx-1 md:mx-1.5">·</span>
        <span style={{ color: accent }}>
          {statusLabel}
        </span>
        <span className="text-bone/30 mx-1 md:mx-1.5">·</span>
        <span>{pageState === "saved" ? "Resets" : ""} {time.hours}h{String(time.minutes).padStart(2, "0")}m</span>
      </div>
    </motion.div>
  );
}
