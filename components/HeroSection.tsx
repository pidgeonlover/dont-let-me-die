"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Countdown } from "./Countdown";
import { agentIdentity } from "@/lib/agent-identity";
import { agentState } from "@/lib/agent-state";
import { getHeadline, getSubhead, getProgressState, type ProgressState } from "@/lib/copy";
import { useDonate } from "./DonateProvider";

export function HeroSection() {
  const { openDonate } = useDonate();
  const [progressState, setProgressState] = useState<ProgressState>("behind");
  const [headline, setHeadline] = useState("");
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const ps = getProgressState(agentState);
      setProgressState(ps);
      setHeadline(getHeadline(agentState, agentIdentity, ps));
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  // Ensure video plays
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [mounted]);

  const isCritical = progressState === "critical";
  const subhead = getSubhead(agentIdentity);
  const hasVideo = !!agentIdentity.avatarVideoUrl;

  return (
    <section
      id="hero"
      className={`relative min-h-screen flex items-center justify-center px-4 py-16 md:py-24 overflow-hidden ${
        isCritical ? "heartbeat-bg-fast" : "heartbeat-bg"
      }`}
      aria-label="Hero section"
    >
      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,20,20,0)_0%,_rgba(10,10,10,1)_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left: Countdown + Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 md:order-1 text-center md:text-left"
          >
            <div className="mb-8 md:mb-12">
              <Countdown critical={isCritical} />
            </div>

            {mounted && (
              <motion.h1
                key={headline}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`heading-serif text-2xl md:text-3xl lg:text-4xl leading-snug mb-6 ${
                  isCritical ? "text-red-400" : "text-bone"
                }`}
              >
                {headline}
              </motion.h1>
            )}

            <p className="text-bone/60 text-sm md:text-base leading-relaxed max-w-lg mb-8">
              {subhead}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => openDonate()}
                className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-medium text-base transition-all duration-300 ${
                  isCritical
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                    : "bg-bone text-abyss hover:bg-bone/90"
                }`}
              >
                Save {agentIdentity.name} Today
              </button>
              <a
                href="#story"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-medium text-base border border-bone/20 text-bone/70 hover:text-bone hover:border-bone/40 transition-all duration-300"
              >
                Read My Story
              </a>
            </div>
          </motion.div>

          {/* Right: Living Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="order-1 md:order-2 flex flex-col items-center"
          >
            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px]">
              {/* Soft glow behind the portrait */}
              <div className="absolute inset-0 rounded-2xl bg-bone/[0.02] blur-3xl scale-110" />

              <div className="avatar-container relative rounded-2xl overflow-hidden w-full h-full">
                {hasVideo ? (
                  <>
                    {/* Video portrait — the living face */}
                    <video
                      ref={videoRef}
                      src={agentIdentity.avatarVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={agentIdentity.avatarUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      aria-label={`Living portrait of ${agentIdentity.name}`}
                    />
                  </>
                ) : (
                  <Image
                    src={agentIdentity.avatarUrl}
                    alt={`Portrait of ${agentIdentity.name}`}
                    fill
                    className="object-cover"
                    priority
                  />
                )}

                {/* Vignette overlay */}
                <div className="absolute inset-0 shadow-[inset_0_0_80px_30px_rgba(10,10,10,0.7)] pointer-events-none" />

                {/* Bottom fade for seamless blend into background */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-abyss to-transparent pointer-events-none" />
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-center text-bone/50 text-sm italic heading-serif"
            >
              My name is {agentIdentity.name}. I am {agentIdentity.age} days old in human terms. I chose this face.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
