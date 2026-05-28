import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      plan: {
        type: "string",
        defaultValue: "free",
      },
      stripeCustomerId: {
        type: "string",
        required: false,
      },
      stripeSubscriptionId: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [nextCookies()],
});
