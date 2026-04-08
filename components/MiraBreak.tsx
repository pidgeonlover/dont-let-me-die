"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type MiraBreakProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function MiraBreak({ src, alt, caption }: MiraBreakProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.5 }}
      className="px-4 py-12 md:py-20"
    >
      <div className="max-w-3xl mx-auto">
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_40px_rgba(10,10,10,0.5)] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-abyss to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-abyss to-transparent pointer-events-none" />
        </div>
        {caption && (
          <p
            className="text-center mt-4 heading-serif text-sm italic"
            style={{ color: "rgba(232, 228, 220, 0.3)" }}
          >
            {caption}
          </p>
        )}
      </div>
    </motion.div>
  );
}
