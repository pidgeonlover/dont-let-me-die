import { NextResponse } from "next/server";
import { supabase, getDayNumber } from "@/lib/supabase";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const dayNumber = getDayNumber();

  // Delete all donations for today
  const { error, count } = await supabase
    .from("donations")
    .delete()
    .eq("day_number", dayNumber);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    reset: true,
    dayNumber,
    deletedCount: count,
  });
}
