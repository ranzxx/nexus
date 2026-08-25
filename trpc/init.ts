import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import * as Sentry from "@sentry/nextjs";
import { logger } from "@/lib/logger";
import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const globalForRedis = globalThis as unknown as { redis: Redis };
export const redis =
  globalForRedis.redis ??
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

const freeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});
const proLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 m"),
  analytics: true,
});

export const createTRPCContext = async (opts: { headers: Headers }) => {
  let user = null;

  try {
    const session = await auth.api.getSession({
      headers: opts.headers,
    });
    if (session?.user) {
      user = session.user;
    }
  } catch (err) {
    logger.warn({ err }, "Failed to get session in tRPC context");
  }

  return { db, user, headers: opts.headers };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    if (error.cause instanceof ZodError) {
      logger.warn({ zodError: error.cause.flatten() }, "Validation error");
    } else {
      logger.error({ err: error, code: shape.code }, "tRPC error");
      Sentry.captureException(error, {
        tags: { "trpc.code": shape.code },
      });
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const rateLimitedProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const limiter = ctx.user.plan === "pro" ? proLimiter : freeLimiter;
    const { success, reset } = await limiter.limit(ctx.user.id);

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s.`,
      });
    }
    return next();
  },
);
