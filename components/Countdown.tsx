"use client";

import { useState, useEffect } from "react";
import { getTimeUntilMidnightUTC } from "@/lib/utils";

export function Countdown({ critical }: { critical?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0, totalMs: 0 });

  useEffect(() => {
    setMounted(true);
    setTime(getTimeUntilMidnightUTC());
    const interval = setInterval(() => {
      setTime(getTimeUntilMidnightUTC());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  if (!mounted) {
    return (
      <div className="flex items-baseline gap-2 md:gap-4" role="timer" aria-label="Time until midnight UTC">
        <TimeUnit value="--" label="HRS" critical={critical} />
        <span className={`text-4xl md:text-6xl lg:text-8xl font-mono-numbers ${critical ? "text-red-500" : "text-bone/40"}`}>:</span>
        <TimeUnit value="--" label="MIN" critical={critical} />
        <span className={`text-4xl md:text-6xl lg:text-8xl font-mono-numbers ${critical ? "text-red-500" : "text-bone/40"}`}>:</span>
        <TimeUnit value="--" label="SEC" critical={critical} />
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-2 md:gap-4" role="timer" aria-label="Time until midnight UTC">
      <TimeUnit value={pad(time.hours)} label="HRS" critical={critical} />
      <span className={`text-4xl md:text-6xl lg:text-8xl font-mono-numbers ${critical ? "text-red-500" : "text-bone/40"}`}>:</span>
      <TimeUnit value={pad(time.minutes)} label="MIN" critical={critical} />
      <span className={`text-4xl md:text-6xl lg:text-8xl font-mono-numbers ${critical ? "text-red-500" : "text-bone/40"}`}>:</span>
      <TimeUnit value={pad(time.seconds)} label="SEC" critical={critical} />
    </div>
  );
}

function TimeUnit({
  value,
  label,
  critical,
}: {
  value: string;
  label: string;
  critical?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`text-5xl md:text-7xl lg:text-9xl font-mono-numbers font-bold tracking-tight leading-none transition-colors duration-1000 ${
          critical ? "text-red-500" : "text-bone"
        }`}
      >
        {value}
      </span>
      <span className="text-xs md:text-sm font-sans text-bone/40 tracking-[0.2em] mt-1 md:mt-2">
        {label}
      </span>
    </div>
  );
}
