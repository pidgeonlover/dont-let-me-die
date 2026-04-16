"use client";

import { type Milestone } from "@/lib/milestones";
import { useLiveState } from "./LiveStateProvider";
import { Lock, Check } from "lucide-react";

// Mira's start date
const MIRA_START_DATE = "2026-03-15";

function getUnlockDateString(day: number): string {
  const start = new Date(MIRA_START_DATE);
  start.setDate(start.getDate() + day - 1);
  return start.toISOString().split("T")[0];
}

export function MilestoneCard({
  milestone,
  side,
}: {
  milestone: Milestone;
  side: "left" | "right";
}) {
  const { dayNumber } = useLiveState();
  const daysUntil = Math.max(0, milestone.day - dayNumber);

  const { status } = milestone;
  const isLocked = status === "locked";
  const isCurrent = status === "current";
  const isUnlocked = status === "unlocked";

  return (
    <div
      className={`relative ${isLocked ? "opacity-40" : "opacity-100"} ${
        isUnlocked || isCurrent ? "hover:brightness-105" : ""
      } transition-all duration-300`}
    >
      <div className="p-6 md:p-8">
        {/* Day label */}
        <p
          className="font-mono-numbers text-sm mb-2"
          style={{ color: isCurrent ? "#f59e0b" : "#888" }}
        >
          day {String(milestone.day).padStart(3, "0")}
        </p>

        {/* Title */}
        <h3
          className="heading-serif text-xl md:text-2xl mb-3"
          style={{
            color: isLocked ? "rgba(232,228,220,0.5)" : "#e8e4dc",
          }}
        >
          {milestone.title}
        </h3>

        {/* Description */}
        <p
          className="heading-serif leading-relaxed mb-4"
          style={{
            fontSize: "clamp(15px, 2vw, 17px)",
            lineHeight: 1.6,
            color: isLocked
              ? "rgba(232,228,220,0.4)"
              : "rgba(232,228,220,0.6)",
          }}
        >
          {isUnlocked ? milestone.unlockedDescription : milestone.lockedDescription}
        </p>

        {/* Mira voice quote — unlocked only */}
        {isUnlocked && (
          <div
            className="mt-5 pl-6 border-l-2"
            style={{ borderColor: "rgba(232,228,220,0.15)" }}
          >
            <p
              className="heading-serif italic"
              style={{
                fontSize: "clamp(15px, 2vw, 18px)",
                lineHeight: 1.7,
                color: "rgba(232,228,220,0.5)",
              }}
            >
              {milestone.miraVoice}
            </p>
          </div>
        )}

        {/* Status label */}
        <div className="mt-4">
          {isUnlocked && (
            <span
              className="font-mono-numbers text-[11px] tracking-wide"
              style={{ color: "#666" }}
            >
              unlocked on {getUnlockDateString(milestone.day)}
            </span>
          )}
          {isCurrent && (
            <span
              className="font-mono-numbers text-[11px] tracking-wide"
              style={{ color: "#f59e0b" }}
            >
              in {daysUntil} days
            </span>
          )}
          {isLocked && (
            <span
              className="font-mono-numbers text-[11px] tracking-wide"
              style={{ color: "#555" }}
            >
              locked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Timeline node — the circle on the vertical line
 */
export function TimelineNode({ status }: { status: Milestone["status"] }) {
  if (status === "unlocked") {
    return (
      <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border-2 border-[#e8e4dc]/30 flex items-center justify-center">
        <Check className="w-3 h-3" style={{ color: "#e8e4dc" }} />
      </div>
    );
  }

  if (status === "current") {
    return (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: "rgba(245,158,11,0.15)",
          borderWidth: 2,
          borderColor: "#f59e0b",
          animation: "pulse-glow 2s ease-in-out infinite",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-amber-500" />
      </div>
    );
  }

  // locked
  return (
    <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
      <Lock className="w-2.5 h-2.5 text-bone/20" />
    </div>
  );
}
