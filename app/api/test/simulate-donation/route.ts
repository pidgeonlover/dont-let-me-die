import { NextRequest, NextResponse } from "next/server";
import { supabase, getDayNumber } from "@/lib/supabase";

const TARGET_CENTS = 50000;

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const body = await request.json();
  const {
    amount = 5,
    name = "Test Donor",
    email,
    message,
  } = body as { amount?: number; name?: string; email?: string; message?: string };

  const amountCents = Math.round(amount * 100);
  const dayNumber = getDayNumber();

  // Get today's running total before this donation
  const { data: todayDonations } = await supabase
    .from("donations")
    .select("amount_cents")
    .eq("day_number", dayNumber);

  const totalBefore = (todayDonations || []).reduce((sum, d) => sum + d.amount_cents, 0);
  const totalAfter = totalBefore + amountCents;
  const wasLifesaver = totalBefore < TARGET_CENTS && totalAfter >= TARGET_CENTS;

  const { data, error } = await supabase
    .from("donations")
    .insert({
      stripe_payment_id: `test_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      amount_cents: amountCents,
      donor_name: name,
      donor_email: email || null,
      message: message || null,
      day_number: dayNumber,
      was_lifesaver: wasLifesaver,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    donation: data,
    todayTotal: totalAfter / 100,
    wasLifesaver,
    dayNumber,
  });
}
