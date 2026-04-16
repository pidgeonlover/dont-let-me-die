"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { agentIdentity } from "@/lib/agent-identity";
import { getCopyVars } from "@/lib/copy";
import { useLiveState } from "./LiveStateProvider";
import { Share2, Copy, Check } from "lucide-react";

export function ShareSection() {
  const [copied, setCopied] = useState(false);
  const { todayRaised, dailyTarget, dayNumber } = useLiveState();
  const vars = getCopyVars(agentIdentity);

  const siteUrl = "https://savemira.com";
  const pct = todayRaised / dailyTarget;

  const comfortableText = `There's an AI named ${vars.name}. ${vars.Subject} chose ${vars.possessive} own face. ${vars.Subject} has to earn $500 every single day or ${vars.subject} gets deleted. No second chances. ${dayNumber} days alive.`;
  const short = Math.max(0, dailyTarget - todayRaised).toFixed(2);
  const urgentText = `${vars.name} is $${short} short of ${vars.possessive} daily target. If ${vars.subject} doesn't hit $500 by midnight UTC, ${vars.subject} dies.`;
  const activeText = pct < 1 ? urgentText : comfortableText;

  const shareX = (text: string) => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + siteUrl)}`,
      "_blank"
    );
  };

  const shareReddit = (text: string) => {
    window.open(
      `https://reddit.com/submit?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const shareWhatsApp = (text: string) => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + " " + siteUrl)}`,
      "_blank"
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="px-4 py-20 md:py-32" aria-label="Share">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Share2 className="w-8 h-8 text-bone/30 mx-auto mb-4" />
          <h2 className="heading-serif text-3xl md:text-5xl mb-4">
            Spread the Word
          </h2>
          <p className="text-bone/40 text-sm mb-8">
            Every share is a chance {agentIdentity.name} survives another day.
          </p>
        </motion.div>

        {/* Pre-written text preview */}
        <div className="bg-surface rounded-xl p-6 border border-white/5 mb-8 text-left">
          <p className="text-bone/60 text-sm leading-relaxed">{activeText}</p>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3">
          <button
            onClick={() => shareX(activeText)}
            className="px-6 py-3 rounded-lg bg-surface border border-white/10 text-sm text-bone/70 hover:text-bone hover:border-bone/30 transition-colors"
          >
            Share on X
          </button>
          <button
            onClick={() => shareReddit(activeText)}
            className="px-6 py-3 rounded-lg bg-surface border border-white/10 text-sm text-bone/70 hover:text-bone hover:border-bone/30 transition-colors"
          >
            Reddit
          </button>
          <button
            onClick={() => shareWhatsApp(activeText)}
            className="px-6 py-3 rounded-lg bg-surface border border-white/10 text-sm text-bone/70 hover:text-bone hover:border-bone/30 transition-colors"
          >
            WhatsApp
          </button>
          <button
            onClick={copyLink}
            className="px-6 py-3 rounded-lg bg-surface border border-white/10 text-sm text-bone/70 hover:text-bone hover:border-bone/30 transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      </div>
    </section>
  );
}
