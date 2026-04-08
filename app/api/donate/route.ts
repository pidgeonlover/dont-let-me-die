import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, name, message } = body as {
    amount: number;
    name?: string;
    message?: string;
  };

  // Stub: In production, this would create a Stripe Checkout session
  // and record the pending donation
  return NextResponse.json({
    success: true,
    checkoutUrl: `https://checkout.stripe.com/stub?amount=${amount}&name=${encodeURIComponent(name ?? "Anonymous")}&message=${encodeURIComponent(message ?? "")}`,
  });
}
