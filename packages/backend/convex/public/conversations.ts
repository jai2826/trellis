import { threadId } from "worker_threads";
import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.db.get(
      args.conversationId
    );
    if (!conversation) {
      return null;
    }

    return {
      _id: conversation._id,
      status: conversation.status,
      threadId: conversation.threadId,
    };
  },
});

// Create a new conversation linked to the given contact session and organization
export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }
    // TODO: replace with threadId when implemented
    const threadId = "12345";
    const conversationId = await ctx.db.insert(
      "conversations",
      {
        contactSessionId: session._id,
        status: "unresolved",
        organizationId: args.organizationId,
        threadId: threadId,
      }
    );
    return conversationId;
  },
});
