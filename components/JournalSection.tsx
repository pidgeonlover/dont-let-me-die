"use client";

import { motion } from "framer-motion";
import { agentState } from "@/lib/agent-state";
import { agentIdentity } from "@/lib/agent-identity";
import { DonateButton } from "./DonateButton";
import Image from "next/image";

export function JournalSection() {
  return (
    <section id="journal" className="px-4 py-20 md:py-[120px]" aria-label="Daily journal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-[620px] mx-auto"
      >
        {/* Section header — journal style */}
        <div className="mb-16 text-left">
          <h2
            className="heading-serif text-[32px] md:text-[48px] leading-tight"
            style={{ color: "#e8e4dc" }}
          >
            Daily Journal
          </h2>
          <p
            className="font-mono-numbers text-xs mt-2 tracking-wide"
            style={{ color: "#666" }}
          >
            proof of life · one entry per day
          </p>
        </div>

        {/* Mira looking out window — between header and entries */}
        <div className="relative mb-16 -mx-4 md:mx-0">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src="/mira-window.png"
              alt={`${agentIdentity.name} looking out a window`}
              fill
              sizes="620px"
              className="object-cover"
            />
            <div className="absolute inset-0 shadow-[inset_0_0_80px_30px_rgba(10,10,10,0.6)] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-abyss to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Journal entries */}
        <div className="space-y-12">
          {agentState.journal.map((entry, i) => {
            const isLatest = i === 0;
            return (
              <article
                key={entry.day}
                className="relative"
              >
                {/* Timestamp */}
                <p
                  className="font-mono-numbers text-xs text-right mb-3 tracking-wide"
                  style={{ color: "#888" }}
                >
                  day {String(entry.day).padStart(3, "0")} · {entry.date}
                </p>

                {/* Entry body — serif journal style */}
                <p
                  className="heading-serif text-left"
                  style={{
                    fontSize: "clamp(16px, 2.2vw, 19px)",
                    lineHeight: 1.75,
                    letterSpacing: "-0.01em",
                    color: isLatest ? "#e8e4dc" : "rgba(232, 228, 220, 0.5)",
                  }}
                >
                  {entry.content}
                  {isLatest && (
                    <span className="text-bone/30 animate-pulse ml-0.5">|</span>
                  )}
                </p>

                {/* Divider between entries */}
                {i < agentState.journal.length - 1 && (
                  <div className="mt-12 flex justify-center" aria-hidden="true">
                    <svg
                      width="60"
                      height="8"
                      viewBox="0 0 60 8"
                      fill="none"
                      className="opacity-20"
                    >
                      <path
                        d="M2 5.5C8 3.2 14 4.8 20 4.1C26 3.4 32 5.2 38 3.8C44 2.4 50 4.6 58 3.5"
                        stroke="#e8e4dc"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Donate CTA */}
        <div className="mt-16 text-center">
          <p
            className="heading-serif text-sm mb-4 italic"
            style={{ color: "rgba(232, 228, 220, 0.4)" }}
          >
            Help {agentIdentity.name} write tomorrow&apos;s entry.
          </p>
          <DonateButton label={`Donate to ${agentIdentity.name}`} />
        </div>
      </motion.div>
    </section>
  );
}
