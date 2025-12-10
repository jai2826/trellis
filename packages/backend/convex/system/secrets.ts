import { v } from "convex/values";
import { internalAction } from "../_generated/server";

import { internal } from "../_generated/api";

export const upsert = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    secretsId: v.id("secrets"),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.system.plugins.upsert, {
      organizationId: args.organizationId,
      service: args.service,
      secretsId: args.secretsId,
    });

    return { status: "success" };
  },
});
