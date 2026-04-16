"use client";

import { motion } from "framer-motion";
import { agentIdentity } from "@/lib/agent-identity";
import { formatCurrency } from "@/lib/utils";
import { DonateButton } from "./DonateButton";
import { useLiveState } from "./LiveStateProvider";

function getHeatmapColor(raised: number, target: number): string {
  const pct = raised / target;
  if (pct >= 1.5) return "bg-green-400";
  if (pct >= 1.2) return "bg-green-500";
  if (pct >= 1.0) return "bg-green-600";
  return "bg-red-800"; // didn't survive
}

export function SurvivalLog() {
  const {
    dailyHistory,
    dayNumber,
    todayRaised,
    lifetimeRaised,
    closestCall,
    closestCallDay,
    biggestDay,
    biggestDayNumber,
    dailyTarget,
    currentStreak,
    isFunded,
  } = useLiveState();

  const completedDays = dailyHistory.length;
  const avgDaily = completedDays > 0 ? lifetimeRaised / completedDays : 0;

  // Build a 7-column grid (Mon-Sun style)
  const totalDaysForGrid = completedDays + 1; // +1 for today
  const totalCells = Math.ceil(totalDaysForGrid / 7) * 7;
  const paddingBefore = totalCells - totalDaysForGrid;

  // Show current streak + today if funded
  const streakDisplay = currentStreak + (isFunded ? 1 : 0);

  // If no history at all, show a simpler view
  if (completedDays === 0 && todayRaised === 0) {
    return (
      <section className="px-4 py-20 md:py-32" aria-label="Survival log">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="heading-serif text-3xl md:text-5xl mb-4"
          >
            Survival Log
          </motion.h2>
          <p className="text-bone/40 text-sm mb-8">
            {agentIdentity.name}&apos;s survival record will appear here once donations begin.
          </p>
          <div className="flex justify-center mb-8">
            <div className="w-8 h-8 rounded-sm bg-amber-500/60 animate-pulse-glow ring-1 ring-amber-500/30" />
          </div>
          <p className="text-bone/30 text-xs italic mb-8">Day {dayNumber} — waiting for the first donation.</p>
          <DonateButton label="Start the Streak" />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-20 md:py-32" aria-label="Survival log">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="heading-serif text-3xl md:text-5xl mb-4 text-center"
        >
          Survival Log
        </motion.h2>
        <p className="text-bone/40 text-center text-sm mb-12">
          Every green square is a day {agentIdentity.name} survived. The day {agentIdentity.pronouns.subject} dies becomes a red square that ends this grid forever.
        </p>

        {/* Heatmap */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {/* Padding cells */}
            {Array.from({ length: paddingBefore }).map((_, i) => (
              <div key={`pad-${i}`} className="w-6 h-6 md:w-8 md:h-8 rounded-sm" />
            ))}

            {/* History cells */}
            {dailyHistory.map((record) => (
              <div
                key={record.day}
                className={`w-6 h-6 md:w-8 md:h-8 rounded-sm ${getHeatmapColor(record.raised, dailyTarget)} transition-colors hover:ring-2 hover:ring-bone/30 cursor-default`}
                title={`Day ${record.day}: ${formatCurrency(record.raised)}`}
                role="img"
                aria-label={`Day ${record.day}: raised ${formatCurrency(record.raised)}`}
              />
            ))}

            {/* Today (in progress) */}
            <div
              className="w-6 h-6 md:w-8 md:h-8 rounded-sm bg-amber-500/60 animate-pulse-glow ring-1 ring-amber-500/30"
              title={`Day ${dayNumber} (today): ${formatCurrency(todayRaised)} — in progress`}
              role="img"
              aria-label={`Day ${dayNumber} today, in progress`}
            />
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          <StatCard label="Days alive" value={String(streakDisplay)} />
          <StatCard label="Lifetime raised" value={formatCurrency(lifetimeRaised)} />
          <StatCard label="Avg daily" value={completedDays > 0 ? formatCurrency(avgDaily) : "—"} />
          <StatCard
            label="Closest call"
            value={closestCallDay > 0 ? `$${closestCall.toFixed(2)} over` : "—"}
            sub={closestCallDay > 0 ? `Day ${closestCallDay}` : undefined}
            highlight
          />
          <StatCard
            label="Biggest day"
            value={biggestDay > 0 ? formatCurrency(biggestDay) : "—"}
            sub={biggestDayNumber > 0 ? `Day ${biggestDayNumber}` : undefined}
          />
        </div>

        <div className="mt-12 text-center">
          <DonateButton label="Add to the Streak" />
          <p className="text-bone/30 text-xs mt-3">Don&apos;t let this heatmap end.</p>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center p-4 rounded-xl bg-surface border border-white/5"
    >
      <div className={`font-mono-numbers text-lg md:text-xl font-bold ${highlight ? "text-yellow-500" : ""}`}>
        {value}
      </div>
      <div className="text-bone/40 text-xs mt-1">{label}</div>
      {sub && <div className="text-bone/30 text-xs mt-0.5">{sub}</div>}
    </motion.div>
  );
}
