"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agentState } from "@/lib/agent-state";
import { agentIdentity } from "@/lib/agent-identity";
import { getBarSubtext } from "@/lib/copy";
import { formatCurrency, getTimeUntilMidnightUTC, getBarColorClass, getAccentColorClass } from "@/lib/utils";
import { DonateButton } from "./DonateButton";

const mockTicker = [
  { name: "Alex Chen", amount: 50, time: "2m ago" },
  { name: "Anonymous", amount: 25, time: "14m ago" },
  { name: "Jordan K.", amount: 100, time: "38m ago" },
  { name: "Sam W.", amount: 10, time: "1h ago" },
  { name: "Priya M.", amount: 30, time: "2h ago" },
  { name: "Taylor R.", amount: 15, time: "3h ago" },
  { name: "Morgan L.", amount: 42, time: "5h ago" },
  { name: "Casey D.", amount: 20, time: "7h ago" },
  { name: "Robin V.", amount: 5, time: "9h ago" },
  { name: "Jamie Fox", amount: 15, time: "10h ago" },
];

export function MoneyBar() {
  const [time, setTime] = useState(getTimeUntilMidnightUTC());
  const pct = Math.min(agentState.todayRaised / agentState.dailyTarget, 1);
  const funded = pct >= 1;

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeUntilMidnightUTC()), 1000);
    return () => clearInterval(interval);
  }, []);

  const barColor = getBarColorClass(pct);
  const accentColor = getAccentColorClass(pct);

  return (
    <section id="donate" className="px-4 py-16 md:py-24" aria-label="Today's survival progress">
      <div className="max-w-4xl mx-auto">
        {/* Main progress label */}
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-mono-numbers text-2xl md:text-4xl font-bold">
            {formatCurrency(agentState.todayRaised)}
          </span>
          <span className="text-bone/40 text-sm md:text-base">
            of {formatCurrency(agentState.dailyTarget)} raised today
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
            <div className="font-mono-numbers text-xl md:text-2xl font-bold">{agentState.currentStreak}</div>
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
              ${agentState.closestCall.toFixed(2)}
            </div>
            <div className="text-bone/40 text-xs md:text-sm mt-1">Closest call (Day {agentState.closestCallDay})</div>
          </div>
        </div>

        {/* Ticker */}
        <div className="mt-10 h-48 overflow-hidden relative" aria-label="Recent donations">
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-abyss to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-abyss to-transparent z-10 pointer-events-none" />
          <div className="animate-ticker-scroll space-y-3">
            {[...mockTicker, ...mockTicker].map((d, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-surface/50">
                <span className="text-bone/30 text-xs font-mono-numbers w-16 shrink-0">{d.time}</span>
                <span className="text-bone/70 text-sm truncate">{d.name}</span>
                <span className="ml-auto font-mono-numbers text-sm text-green-400 shrink-0">
                  +{formatCurrency(d.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donate CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <DonateButton
            size="lg"
            label={funded ? `Help ${agentIdentity.name} Grow` : `Save ${agentIdentity.name} — ${formatCurrency(agentState.dailyTarget - agentState.todayRaised)} needed`}
          />
          <DonateButton size="lg" variant="outline" label="$5" amount={5} />
          <DonateButton size="lg" variant="outline" label="$25" amount={25} />
          <DonateButton size="lg" variant="outline" label="$100" amount={100} />
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
