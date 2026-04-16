import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getTimeUntilMidnightUTC(): {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
} {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCDate(midnight.getUTCDate() + 1);
  midnight.setUTCHours(0, 0, 0, 0);
  const totalMs = Math.max(0, midnight.getTime() - now.getTime());
  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds, totalMs };
}

export function getAccentColor(pct: number): string {
  if (pct >= 1) return "#c9a84c"; // gold
  if (pct >= 0.75) return "#22c55e"; // green
  if (pct >= 0.25) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

export function getAccentColorClass(pct: number): string {
  if (pct >= 1) return "text-yellow-500";
  if (pct >= 0.75) return "text-green-500";
  if (pct >= 0.25) return "text-amber-500";
  return "text-red-500";
}

export function getBarColorClass(pct: number): string {
  if (pct >= 1) return "bg-yellow-500";
  if (pct >= 0.75) return "bg-green-500";
  if (pct >= 0.25) return "bg-amber-500";
  return "bg-red-500";
}

export function getRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}
