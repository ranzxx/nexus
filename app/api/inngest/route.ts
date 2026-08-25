import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processDocumentEmbedding } from "@/inngest/functions/process-document";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processDocumentEmbedding],
});
