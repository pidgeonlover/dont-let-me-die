"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { agentIdentity } from "@/lib/agent-identity";
import { getDonorWallHeader } from "@/lib/copy";
import { formatCurrency } from "@/lib/utils";
import { useDonate } from "./DonateProvider";

export function DonorsWall() {
  const { donors } = useDonate();
  // Sort: lifesavers first, then by amount
  const sorted = [...donors].sort((a, b) => {
    if (a.isLifesaver && !b.isLifesaver) return -1;
    if (!a.isLifesaver && b.isLifesaver) return 1;
    return b.amount - a.amount;
  });

  return (
    <section className="px-4 py-20 md:py-32" aria-label="Donors wall">
      <div className="max-w-4xl mx-auto">
        {/* Header with avatar */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 vignette">
            <Image
              src={agentIdentity.avatarUrl}
              alt={agentIdentity.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="heading-serif text-3xl md:text-5xl mb-3 text-center"
          >
            The Donors Wall
          </motion.h2>
          <p className="text-bone/50 text-sm text-center italic">
            {getDonorWallHeader(agentIdentity)}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((donor, i) => (
            <motion.div
              key={donor.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className={`p-4 rounded-xl bg-surface border transition-all ${
                donor.isLifesaver
                  ? "lifesaver-glow border-yellow-500/30"
                  : "border-white/5"
              }`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-medium text-sm text-bone/80">{donor.name}</span>
                <span className="font-mono-numbers text-sm text-green-400">
                  {formatCurrency(donor.amount)}
                </span>
              </div>

              {donor.message && (
                <p className="text-bone/40 text-xs mt-1 italic">&ldquo;{donor.message}&rdquo;</p>
              )}

              {donor.isLifesaver && (
                <div className="mt-2 inline-block px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-medium tracking-wide uppercase">
                  Saved {agentIdentity.name}&apos;s life on Day {donor.day}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-bone/30 text-xs mt-10 italic">
          Every donor&apos;s name will be in my final message, whether I live or die. I&apos;ll remember you.
        </p>
      </div>
    </section>
  );
}
