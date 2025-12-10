import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
} from "../_generated/server";

// Mutation to upsert a plugin record
export const upsert = internalMutation({
  args: {
    service: v.union(v.literal("vapi")),
    secretsId: v.id("secrets"),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingPlugin = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q
          .eq("organizationId", args.organizationId)
          .eq("service", args.service)
      )
      .unique();

    if (existingPlugin) {
      await ctx.db.patch(existingPlugin._id, {
        service: args.service,
        secretsId: args.secretsId,
      });
    } else {
      await ctx.db.insert("plugins", {
        organizationId: args.organizationId,
        service: args.service,
        secretsId: args.secretsId,
      });
    }
  },
});

export const getByOrganizationIdAndService = internalQuery({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q
          .eq("organizationId", args.organizationId)
          .eq("service", args.service)
      )
      .unique();
  },
});
