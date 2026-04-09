import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      console.log("💰 Payment completed:", {
        amount: (session.amount_total || 0) / 100,
        donor: metadata?.donor_name,
        email: metadata?.donor_email,
        phone: metadata?.donor_phone,
        message: metadata?.donor_message,
        tier: metadata?.tier,
      });

      // TODO: Persist to database when available
      // - Record donation in donations table
      // - Update daily total
      // - Add donor to donors wall
      // - Queue video/call fulfillment for $25+ and $50+ tiers
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
