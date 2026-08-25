import "server-only";

import { cache } from "react";
import { getQueryClient as makeQueryClient } from "./query-client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createTRPCContext } from "./init";
import { headers } from "next/headers";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: async () =>
    createTRPCContext({
      headers: await headers(),
    }),
    router: appRouter,
    queryClient: getQueryClient,
});
