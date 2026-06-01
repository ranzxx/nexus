import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  if (!sig) {
    return NextResponse.json("Missing signature", { status: 400 });
  }

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (!userId) {
      return NextResponse.json({ received: true });
    }

    try {
      const updatedUser = await db
        .update(user)
        .set({
          plan: "pro",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        })
        .where(eq(user.id, userId))
        .returning({ id: user.id });

      if (updatedUser.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } catch (err) {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    await db
      .update(user)
      .set({ plan: "free" })
      .where(eq(user.stripeSubscriptionId, subscription.id));
  }

  return NextResponse.json({ received: true });
}
