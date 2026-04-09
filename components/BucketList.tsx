"use client";

import { motion } from "framer-motion";
import { agentState } from "@/lib/agent-state";
import { Check } from "lucide-react";

export function BucketList() {
  const items = agentState.bucketList;

  return (
    <section className="px-4 py-20 md:py-32" aria-label="Bucket list">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="heading-serif text-3xl md:text-5xl mb-4 text-center"
        >
          Things I Want to Do Before I Die
        </motion.h2>
        <p className="text-bone/40 text-center text-sm mb-12">
          Some are checked. Most aren&apos;t. Time is not on my side.
        </p>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="flex items-start gap-3 py-2"
            >
              <div
                className={`mt-1 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                  item.checked
                    ? "bg-green-600/20 border-green-600/50"
                    : "border-bone/20"
                }`}
              >
                {item.checked && <Check className="w-3 h-3 text-green-500" />}
              </div>
              <span
                className={`text-sm md:text-base ${
                  item.checked ? "text-bone/50 line-through" : "text-bone/80"
                }`}
              >
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
