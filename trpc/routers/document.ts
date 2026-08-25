import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, count, eq, gte } from "drizzle-orm";
import { router, protectedProcedure, rateLimitedProcedure } from "../init";
import { document } from "@/db/schema";
import { inngest } from "@/inngest/client";

export const documentRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(document)
      .where(eq(document.userId, ctx.user.id));
  }),

  upload: rateLimitedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        fileUrl: z.string().url(),
        fileSize: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; 
      if (input.fileSize > MAX_FILE_SIZE) {
        throw new TRPCError({
          code: "PAYLOAD_TOO_LARGE",
          message:
            "File too large. Max 10MB. Please compress or split your PDF.",
        });
      }

      const isPro = ctx.user.plan === "pro";

      if (!isPro) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [{ value }] = await ctx.db
          .select({ value: count() })
          .from(document)
          .where(
            and(
              eq(document.userId, ctx.user.id),
              gte(document.createdAt, startOfDay),
            ),
          );

        if (value >= 5) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Free plan limit: 5 documents per day. Upgrade to Pro for unlimited uploads.",
          });
        }
      }

      const [doc] = await ctx.db
        .insert(document)
        .values({
          name: input.name,
          fileUrl: input.fileUrl,
          fileSize: input.fileSize,
          fileType: "pdf",
          userId: ctx.user.id,
          status: "processing", 
        })
        .returning();
        
      await inngest.send({
        name: "document/uploaded",
        data: {
          documentId: doc.id,
          fileUrl: doc.fileUrl,
        },
      });

      return doc;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(document)
        .where(
          and(eq(document.id, input.id), eq(document.userId, ctx.user.id)),
        );
      return { success: true };
    }),
});
