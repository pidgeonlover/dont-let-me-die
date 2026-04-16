import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase, getDayNumber } from "@/lib/supabase";
import Stripe from "stripe";

const TARGET_CENTS = 50000; // $500

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const metadata = session.metadata || {};
    const amountCents = session.amount_total || 0;
    const donationTimestamp = new Date((event.created || Date.now() / 1000) * 1000);
    const dayNumber = getDayNumber(donationTimestamp);

    // Check for duplicate (idempotency)
    const { data: existing } = await supabase
      .from("donations")
      .select("id")
      .eq("stripe_payment_id", session.payment_intent as string || session.id)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ received: true, deduplicated: true });
    }

    // Get today's running total BEFORE this donation
    const { data: todayDonations } = await supabase
      .from("donations")
      .select("amount_cents")
      .eq("day_number", dayNumber);

    const totalBefore = (todayDonations || []).reduce((sum, d) => sum + d.amount_cents, 0);
    const totalAfter = totalBefore + amountCents;

    // Lifesaver detection: crossed $500 threshold
    const wasLifesaver = totalBefore < TARGET_CENTS && totalAfter >= TARGET_CENTS;

    // Insert the donation
    const { error: insertError } = await supabase
      .from("donations")
      .insert({
        stripe_payment_id: (session.payment_intent as string) || session.id,
        amount_cents: amountCents,
        donor_name: metadata.donor_name || null,
        donor_email: metadata.donor_email || null,
        donor_phone: metadata.donor_phone || null,
        message: metadata.donor_message || null,
        day_number: dayNumber,
        was_lifesaver: wasLifesaver,
        created_at: donationTimestamp.toISOString(),
      });

    if (insertError) {
      console.error("Failed to insert donation:", insertError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    console.log(`💰 Donation recorded: $${(amountCents / 100).toFixed(2)} from ${metadata.donor_name || "Anonymous"} (Day ${dayNumber})${wasLifesaver ? " — LIFESAVER!" : ""}`);
  }

  return NextResponse.json({ received: true });
}
