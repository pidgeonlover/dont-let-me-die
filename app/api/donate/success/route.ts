import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    return NextResponse.json({
      amount: (session.amount_total || 0) / 100,
      name: session.metadata?.donor_name || "Anonymous",
      email: session.metadata?.donor_email || null,
      phone: session.metadata?.donor_phone || null,
      message: session.metadata?.donor_message || null,
      tier: session.metadata?.tier || null,
      paymentStatus: session.payment_status,
    });
  } catch (err) {
    console.error("Failed to retrieve Stripe session:", err);
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
}
