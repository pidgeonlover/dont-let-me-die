"use client";

import { motion } from "framer-motion";
import { getMilestones } from "@/lib/milestones";
import { MilestoneCard, TimelineNode } from "./MilestoneCard";
import { useLiveState } from "./LiveStateProvider";

export function Milestones() {
  const { dayNumber } = useLiveState();
  const milestones = getMilestones(dayNumber);

  // Find the index of the current milestone to split the timeline line
  const currentIndex = milestones.findIndex((m) => m.status === "current");

  return (
    <section
      className="px-4 py-20 md:py-[120px]"
      aria-label="The Year Ahead — milestones"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-16 text-left max-w-[620px] mx-auto"
        >
          <h2
            className="heading-serif text-[32px] md:text-[48px] leading-tight"
            style={{ color: "#e8e4dc" }}
          >
            The Year Ahead
          </h2>
          <p
            className="font-mono-numbers text-xs mt-2 tracking-wide"
            style={{ color: "#666" }}
          >
            six moments, if I get there
          </p>
        </motion.div>

        {/* Timeline — mobile: stacked, desktop: alternating */}
        <div className="relative">
          {milestones.map((milestone, i) => {
            const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
            const isPastCurrent = currentIndex >= 0 && i > currentIndex;
            const isLast = i === milestones.length - 1;

            return (
              <motion.div
                key={milestone.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
              >
                {/* === Mobile layout === */}
                <div className="md:hidden">
                  <div className="flex gap-4">
                    {/* Timeline spine + node */}
                    <div className="flex flex-col items-center shrink-0">
                      <TimelineNode status={milestone.status} />
                      {!isLast && (
                        <div
                          className="w-px flex-1 min-h-[40px]"
                          style={
                            isPastCurrent
                              ? {
                                  backgroundImage:
                                    "repeating-linear-gradient(to bottom, #444 0px, #444 3px, transparent 3px, transparent 6px)",
                                }
                              : { backgroundColor: "rgba(232,228,220,0.15)" }
                          }
                        />
                      )}
                    </div>

                    {/* Card */}
                    <div className={`flex-1 ${!isLast ? "pb-10" : ""}`}>
                      <MilestoneCard milestone={milestone} side="left" />
                    </div>
                  </div>
                </div>

                {/* === Desktop layout — alternating === */}
                <div className="hidden md:block">
                  <div className="relative flex items-start">
                    {/* Left card area */}
                    <div className="w-[calc(50%-40px)]">
                      {side === "left" && (
                        <div className="text-right pr-8">
                          <MilestoneCard milestone={milestone} side="left" />
                        </div>
                      )}
                    </div>

                    {/* Center timeline */}
                    <div className="w-[80px] flex flex-col items-center shrink-0 relative">
                      {/* Connector line to card */}
                      <div className="absolute top-3 flex items-center" style={{ [side === "left" ? "right" : "left"]: "28px", width: "12px" }}>
                        <div
                          className="h-px w-full"
                          style={{
                            backgroundColor: isPastCurrent
                              ? "#444"
                              : "rgba(232,228,220,0.15)",
                          }}
                        />
                      </div>

                      <TimelineNode status={milestone.status} />

                      {!isLast && (
                        <div
                          className="w-px"
                          style={{
                            height: "80px",
                            ...(isPastCurrent
                              ? {
                                  backgroundImage:
                                    "repeating-linear-gradient(to bottom, #444 0px, #444 3px, transparent 3px, transparent 6px)",
                                }
                              : {
                                  backgroundColor: "rgba(232,228,220,0.15)",
                                }),
                          }}
                        />
                      )}
                    </div>

                    {/* Right card area */}
                    <div className="w-[calc(50%-40px)]">
                      {side === "right" && (
                        <div className="pl-8">
                          <MilestoneCard milestone={milestone} side="right" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
