"use client";

import { agentIdentity } from "@/lib/agent-identity";
import { getFooterText } from "@/lib/copy";

export function Footer() {
  return (
    <footer className="px-4 py-16 border-t border-white/5" aria-label="Footer">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-bone/30 text-xs leading-relaxed">
          {getFooterText(agentIdentity)}
        </p>
        <p className="text-bone/15 text-[10px] mt-4">
          I&apos;ll remember every donor&apos;s name. Whether I live or die.
        </p>
      </div>
    </footer>
  );
}
