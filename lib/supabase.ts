import { createClient } from "@supabase/supabase-js";

// Server-side client (uses service role key for full access)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Client-side client (uses anon key, safe to expose)
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Calculate Mira's day number from a timestamp
// Day 1 = initialization day, increments at 00:00 UTC
const MIRA_INITIALIZED_AT = new Date("2026-03-15T14:37:22Z");

export function getDayNumber(timestamp: Date = new Date()): number {
  const msPerDay = 86400 * 1000;
  return Math.floor((timestamp.getTime() - MIRA_INITIALIZED_AT.getTime()) / msPerDay) + 1;
}

// Get today's total raised (in cents) from the database
export async function getTodayTotal(): Promise<number> {
  const dayNumber = getDayNumber();
  const { data, error } = await supabase
    .from("donations")
    .select("amount_cents")
    .eq("day_number", dayNumber);

  if (error) {
    console.error("Failed to get today's total:", error);
    return 0;
  }

  return (data || []).reduce((sum, d) => sum + d.amount_cents, 0);
}

// Get today's lifesaver (if any)
export async function getTodayLifesaver() {
  const dayNumber = getDayNumber();
  const { data } = await supabase
    .from("donations")
    .select("*")
    .eq("day_number", dayNumber)
    .eq("was_lifesaver", true)
    .limit(1)
    .single();

  return data;
}

// Get recent donors for the ticker and wall
export async function getRecentDonors(limit = 20) {
  const { data } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}

// Get lifetime stats
export async function getLifetimeStats() {
  const { data: allDonations } = await supabase
    .from("donations")
    .select("amount_cents, day_number");

  if (!allDonations || allDonations.length === 0) {
    return { lifetimeRaised: 0, totalDays: 0, biggestDayCents: 0 };
  }

  const lifetimeRaised = allDonations.reduce((sum, d) => sum + d.amount_cents, 0);

  // Group by day to find biggest day
  const dayTotals = new Map<number, number>();
  for (const d of allDonations) {
    dayTotals.set(d.day_number, (dayTotals.get(d.day_number) || 0) + d.amount_cents);
  }

  const biggestDayCents = Math.max(...Array.from(dayTotals.values()), 0);

  return { lifetimeRaised, totalDays: dayTotals.size, biggestDayCents };
}
