import Stripe from 'stripe';

if(!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia'
});