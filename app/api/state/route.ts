import { NextResponse } from "next/server";
import { supabase, getDayNumber, getTodayTotal, getTodayLifesaver, getRecentDonors, getLifetimeStats } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const dayNumber = getDayNumber();
    const todayTotalCents = await getTodayTotal();
    const todayRaised = todayTotalCents / 100;
    const lifesaver = await getTodayLifesaver();
    const recentDonors = await getRecentDonors(50);
    const stats = await getLifetimeStats();

    // Get agent alive status
    const { data: agentRow } = await supabase
      .from("agent_state")
      .select("is_alive")
      .eq("id", 1)
      .single();

    const isAlive = agentRow?.is_alive ?? true;

    return NextResponse.json({
      dayNumber,
      todayRaised,
      todayTotalCents,
      dailyTarget: 500,
      isFunded: todayRaised >= 500,
      isAlive,
      lifesaver: lifesaver
        ? {
            name: lifesaver.donor_name || "Anonymous",
            amount: lifesaver.amount_cents / 100,
            message: lifesaver.message,
            timestamp: lifesaver.created_at,
            dayNumber: lifesaver.day_number,
          }
        : null,
      recentDonors: recentDonors.map((d) => ({
        id: d.id,
        name: d.donor_name || "Anonymous",
        amount: d.amount_cents / 100,
        message: d.message,
        timestamp: d.created_at,
        day: d.day_number,
        isLifesaver: d.was_lifesaver,
      })),
      lifetimeRaised: stats.lifetimeRaised / 100,
      totalDaysActive: stats.totalDays,
      biggestDay: stats.biggestDayCents / 100,
      biggestDayNumber: stats.biggestDayNumber,
      currentStreak: stats.currentStreak,
      closestCall: stats.closestCallCents / 100,
      closestCallDay: stats.closestCallDay,
      dailyHistory: stats.dailyHistory,
    });
  } catch (err) {
    console.error("Failed to get state:", err);
    return NextResponse.json({ error: "Failed to get state" }, { status: 500 });
  }
}
