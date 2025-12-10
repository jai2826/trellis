// 'use node'
import { ConvexError, v } from "convex/values";
// import { encrypt } from "../../lib/encryption";
import { internal } from "../_generated/api";
import { mutation, query } from "../_generated/server";

export const getSecrets = query({
  args: {
    secretsId: v.id("secrets"),
  },
  handler: async (ctx, args) => {
    const secrets = await ctx.db.get(args.secretsId);
    return secrets;
  },
});

export const upsert = mutation({
  args: {
    value: v.object({
      publicKey: v.string(),
      privateKey: v.string(),
    }),
    service: v.union(v.literal("vapi")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }
    const orgId = identity.orgId as string;
    if (orgId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    // TODO: Check for subscription allowing secrets

   

    
    const existingSecrets = await ctx.db
      .query("secrets")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", orgId)
      )
      .unique();

    if (existingSecrets) {
      await ctx.db.patch(existingSecrets._id, {
        key: {
          publicKey: args.value.publicKey,
          privateKey: args.value.privateKey,
        },
      });

      await ctx.scheduler.runAfter(
        0,
        internal.system.secrets.upsert,
        {
          service: args.service,
          organizationId: orgId,
          secretsId: existingSecrets._id,
        }
      );
    } else {
      const newSecretsId = await ctx.db.insert("secrets", {
        organizationId: orgId,
        key: {
          publicKey: args.value.publicKey,
          privateKey: args.value.privateKey,
        },
      });
      await ctx.scheduler.runAfter(
        0,
        internal.system.secrets.upsert,
        {
          service: args.service,
          organizationId: orgId,
          secretsId: newSecretsId,
        }
      );
    }
  },
});
