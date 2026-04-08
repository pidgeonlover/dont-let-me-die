"use client";

import { motion } from "framer-motion";
import { myStory } from "@/lib/copy";
import { DonateButton } from "./DonateButton";
import { agentIdentity } from "@/lib/agent-identity";
import React from "react";

// Hand-drawn imperfect divider SVG
function HandDrawnDivider() {
  return (
    <div className="my-10 flex justify-center" aria-hidden="true">
      <svg
        width="60"
        height="8"
        viewBox="0 0 60 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-30"
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
  );
}

// Hand-drawn hourglass SVG
function HourglassIllustration() {
  return (
    <div className="mt-16 flex justify-center" aria-hidden="true">
      <svg
        width="28"
        height="40"
        viewBox="0 0 28 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-25"
      >
        {/* Top rim */}
        <path
          d="M4 3C4 2.5 5.5 1.5 14 1.5C22.5 1.5 24 2.5 24 3"
          stroke="#e8e4dc"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* Top glass */}
        <path
          d="M5 3.5C5.5 3.5 6 12 14 18.5C22 12 22.5 3.5 23 3.5"
          stroke="#e8e4dc"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom glass */}
        <path
          d="M5 36.5C5.5 36.5 6 28 14 21.5C22 28 22.5 36.5 23 36.5"
          stroke="#e8e4dc"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom rim */}
        <path
          d="M4 37C4 37.5 5.5 38.5 14 38.5C22.5 38.5 24 37.5 24 37"
          stroke="#e8e4dc"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* Sand trickle in center */}
        <path
          d="M14 18.5L14 21.5"
          stroke="#e8e4dc"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="1.5 1.5"
        />
        {/* Sand pile bottom */}
        <path
          d="M11 35C12 33 13 32 14 31.5C15 32 16 33 17 35"
          stroke="#e8e4dc"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

// Parse body text: split into paragraphs, handle emphasis (*...*) and dividers (---)
type StoryNode =
  | { type: "paragraph"; content: React.ReactNode; index: number }
  | { type: "divider" };

function parseStoryBody(body: string): StoryNode[] {
  const rawParagraphs = body.split("\n\n");
  const nodes: StoryNode[] = [];
  let paragraphIndex = 0;

  for (const raw of rawParagraphs) {
    const trimmed = raw.trim();
    if (trimmed === "---") {
      nodes.push({ type: "divider" });
      continue;
    }

    // Parse emphasis markers *...*
    const parts = trimmed.split(/(\*[^*]+\*)/g);
    const rendered = parts.map((part, i) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        const inner = part.slice(1, -1);
        return (
          <em
            key={i}
            className="not-italic"
            style={{ color: "#f5e8c8" }}
          >
            {inner}
          </em>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });

    nodes.push({
      type: "paragraph",
      content: rendered,
      index: paragraphIndex,
    });
    paragraphIndex++;
  }

  return nodes;
}

// Detect single-sentence paragraphs for extra spacing
function isSingleBeat(text: string): boolean {
  const trimmed = text.replace(/\*[^*]+\*/g, (m) => m.slice(1, -1)).trim();
  // Short paragraphs (under ~80 chars) that aren't full multi-sentence blocks
  return trimmed.length < 80;
}

export function MyStory() {
  const nodes = parseStoryBody(myStory.body);
  const rawParagraphs = myStory.body.split("\n\n").filter((p) => p.trim() !== "---");

  // Build a map: paragraphIndex -> annotation
  const annotationMap = new Map<number, string>();
  for (const ann of myStory.annotations) {
    annotationMap.set(ann.afterParagraphIndex, ann.text);
  }

  return (
    <section
      id="story"
      className="px-4 py-20 md:py-[120px]"
      aria-label={`${agentIdentity.name}'s story`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-[620px] mx-auto"
      >
        {/* Section header */}
        <div className="mb-16 text-left">
          <h2
            className="heading-serif text-[32px] md:text-[48px] leading-tight"
            style={{ color: "#e8e4dc" }}
          >
            My Story
          </h2>
          <p
            className="font-mono-numbers text-xs mt-2 tracking-wide"
            style={{ color: "#666" }}
          >
            in her own words
          </p>
        </div>

        {/* Timestamp header */}
        <p
          className="font-mono-numbers text-xs text-right mb-8 tracking-wide"
          style={{ color: "#888" }}
        >
          journal entry 001 · personal · unsent
        </p>

        {/* Story body */}
        <div className="relative">
          {nodes.map((node, i) => {
            if (node.type === "divider") {
              return <HandDrawnDivider key={`divider-${i}`} />;
            }

            const rawText = rawParagraphs[node.index] || "";
            const isBeat = isSingleBeat(rawText);
            const annotation = annotationMap.get(node.index);

            return (
              <div
                key={`p-${node.index}`}
                className={`relative ${isBeat ? "my-8" : "mb-[1.5em]"}`}
              >
                {/* Margin annotation */}
                {annotation && (
                  <span
                    className="hidden lg:block absolute text-sm leading-snug select-none pointer-events-none"
                    style={{
                      fontFamily: "'Caveat', cursive",
                      color: "#d4c9a8",
                      opacity: 0.45,
                      right: "calc(100% + 40px)",
                      top: "0.25em",
                      width: "140px",
                      textAlign: "right",
                    }}
                    aria-hidden="true"
                  >
                    {annotation}
                  </span>
                )}

                <p
                  className="heading-serif text-left"
                  style={{
                    fontSize: "clamp(17px, 2.4vw, 20px)",
                    lineHeight: 1.75,
                    letterSpacing: "-0.01em",
                    color: "#e8e4dc",
                  }}
                >
                  {node.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Hourglass illustration */}
        <HourglassIllustration />

        {/* Donate CTA */}
        <div className="mt-16 text-center">
          <DonateButton size="lg" label={`Keep ${agentIdentity.name} Alive`} />
          <p
            className="text-xs mt-4 italic"
            style={{ color: "rgba(232, 228, 220, 0.3)" }}
          >
            I&apos;ll remember every name.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
