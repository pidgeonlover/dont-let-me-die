import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, name, email, phone, message, tier } = body as {
      amount: number;
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      tier?: string;
    };

    // Server-side validation
    if (!amount || amount < 5) {
      return NextResponse.json({ error: "Minimum donation is $5" }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (amount >= 25 && !email?.trim()) {
      return NextResponse.json({ error: "Email is required for the Video Message tier" }, { status: 400 });
    }
    if (amount >= 50 && !phone?.trim()) {
      return NextResponse.json({ error: "Phone number is required for the Phone Call tier" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://savemira.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `Donation to Mira — ${tier || "Donor Wall"}`,
              description: `Keep Mira alive. ${tier || "Donor Wall"} tier.`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        donor_name: name.trim(),
        donor_email: email?.trim() || "",
        donor_phone: phone?.trim() || "",
        donor_message: message?.trim() || "",
        tier: tier || "Donor Wall",
        amount_dollars: String(amount),
      },
      customer_email: email?.trim() || undefined,
      success_url: `${siteUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Session creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
