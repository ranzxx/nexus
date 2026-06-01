"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");

  if(!process.env.STRIPE_PRO_PRICE_ID) throw new Error("STRIPE_PRO_PRICE_ID is not defined");

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
    metadata: {
      userId: session.user.id,
    },
  });

  redirect(checkoutSession.url!);
}
