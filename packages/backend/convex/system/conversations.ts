import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  internalQuery,
} from "../_generated/server";

// Resolve a conversation by thread ID
export const resolve = internalMutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) =>
        q.eq("threadId", args.threadId)
      )
      .unique();

    if (!conversations) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }
    await ctx.db.patch(conversations._id, {
      status: "resolved",
    });
  },
});
// Escalate a conversation by thread ID
export const escalate = internalMutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) =>
        q.eq("threadId", args.threadId)
      )
      .unique();

    if (!conversations) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }
    await ctx.db.patch(conversations._id, {
      status: "escalated",
    });
  },
});

// Get a conversation by thread ID
export const getByThreadId = internalQuery({
  args: { threadId: v.string() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) =>
        q.eq("threadId", args.threadId)
      )
      .unique();
    return conversations;
  },
});
