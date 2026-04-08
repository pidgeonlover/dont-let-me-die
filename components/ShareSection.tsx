"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { agentIdentity } from "@/lib/agent-identity";
import { agentState } from "@/lib/agent-state";
import { getShareText } from "@/lib/copy";
import { Share2, Copy, Check } from "lucide-react";

export function ShareSection() {
  const [copied, setCopied] = useState(false);
  const comfortableText = getShareText(agentIdentity, agentState, "comfortable");
  const urgentText = getShareText(agentIdentity, agentState, "urgent");

  const siteUrl = "https://dontletmedie.com";

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

  const pct = agentState.todayRaised / agentState.dailyTarget;
  const activeText = pct < 1 ? urgentText : comfortableText;

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
        <div className="flex flex-wrap justify-center gap-3">
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
