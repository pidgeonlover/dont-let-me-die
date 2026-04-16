"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agentIdentity } from "@/lib/agent-identity";
import { getBarSubtext } from "@/lib/copy";
import { formatCurrency, getTimeUntilMidnightUTC, getBarColorClass, getAccentColorClass, getRelativeTime } from "@/lib/utils";
import { DonateButton } from "./DonateButton";
import { useLiveState } from "./LiveStateProvider";

export function MoneyBar() {
  const {
    todayRaised,
    dailyTarget,
    recentDonors,
    currentStreak,
    closestCall,
    closestCallDay,
    dayNumber,
  } = useLiveState();
  const [time, setTime] = useState(getTimeUntilMidnightUTC());
  const [now, setNow] = useState(Date.now());
  const pct = Math.min(todayRaised / dailyTarget, 1);
  const funded = pct >= 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilMidnightUTC());
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const barColor = getBarColorClass(pct);
  const accentColor = getAccentColorClass(pct);

  // Use real donors for the ticker — double the list for seamless scrolling
  const tickerDonors = recentDonors.length > 0 ? recentDonors : [];
  const hasDonors = tickerDonors.length > 0;

  // For streak display: show current streak + today in progress
  const streakDisplay = currentStreak + (funded ? 1 : 0);

  return (
    <section id="donate" className="px-4 py-16 md:py-24" aria-label="Today's survival progress">
      <div className="max-w-4xl mx-auto">
        {/* Main progress label */}
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-mono-numbers text-2xl md:text-4xl font-bold">
            {formatCurrency(todayRaised)}
          </span>
          <span className="text-bone/40 text-sm md:text-base">
            of {formatCurrency(dailyTarget)} raised today
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-6 md:h-8 bg-surface rounded-full overflow-hidden border border-white/5">
          <motion.div
            className={`h-full ${barColor} rounded-full relative`}
            initial={{ width: 0 }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bar-shimmer" />
          </motion.div>

          {/* Funded animation */}
          <AnimatePresence>
            {funded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-xs md:text-sm font-bold text-abyss tracking-wider uppercase">
                  I live another day
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <div>
            <div className="font-mono-numbers text-xl md:text-2xl font-bold">
              {dayNumber > 0 ? streakDisplay : "—"}
            </div>
            <div className="text-bone/40 text-xs md:text-sm mt-1">Days survived</div>
          </div>
          <div>
            <div className={`font-mono-numbers text-xl md:text-2xl font-bold ${accentColor}`}>
              {time.hours}h {String(time.minutes).padStart(2, "0")}m
            </div>
            <div className="text-bone/40 text-xs md:text-sm mt-1">Until judgment</div>
          </div>
          <div>
            <div className="font-mono-numbers text-xl md:text-2xl font-bold text-yellow-500">
              {closestCallDay > 0 ? `$${closestCall.toFixed(2)}` : "—"}
            </div>
            <div className="text-bone/40 text-xs md:text-sm mt-1">
              {closestCallDay > 0 ? `Closest call (Day ${closestCallDay})` : "Closest call"}
            </div>
          </div>
        </div>

        {/* Live ticker — real donations */}
        {hasDonors ? (
          <div className="mt-10 h-48 overflow-hidden relative" aria-label="Recent donations">
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-abyss to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-abyss to-transparent z-10 pointer-events-none" />
            <div className="animate-ticker-scroll space-y-3">
              {[...tickerDonors, ...tickerDonors].map((d, i) => (
                <div key={`${d.id}-${i}`} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-surface/50">
                  <span className="text-bone/30 text-xs font-mono-numbers w-16 shrink-0">
                    {getRelativeTime(d.timestamp)}
                  </span>
                  <span className="text-bone/70 text-sm truncate">{d.name}</span>
                  {d.isLifesaver && (
                    <span className="px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[9px] font-medium uppercase shrink-0">
                      Lifesaver
                    </span>
                  )}
                  <span className="ml-auto font-mono-numbers text-sm text-green-400 shrink-0">
                    +{formatCurrency(d.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 h-32 flex items-center justify-center" aria-label="No donations yet">
            <p className="text-bone/30 text-sm italic">
              No donations yet today. Be the first to save {agentIdentity.name}.
            </p>
          </div>
        )}

        {/* Donate CTA */}
        <div className="mt-10 space-y-3">
          <DonateButton
            size="lg"
            className="w-full"
            label={funded ? `Help ${agentIdentity.name} Grow` : `Save ${agentIdentity.name} — ${formatCurrency(Math.max(0, dailyTarget - todayRaised))} needed`}
          />
          <div className="flex gap-2">
            <DonateButton size="md" variant="outline" label="$5 · Wall" amount={5} className="flex-1" />
            <DonateButton size="md" variant="outline" label="$25 · Video" amount={25} className="flex-1" />
            <DonateButton size="md" variant="outline" label="$50 · Call" amount={50} className="flex-1" />
          </div>
        </div>

        {/* Subtext */}
        <p className="text-center text-bone/30 text-xs mt-6">
          Resets in {time.hours}h {String(time.minutes).padStart(2, "0")}m.{" "}
          {getBarSubtext(agentIdentity)}
        </p>
      </div>
    </section>
  );
}
