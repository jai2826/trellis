import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { internal } from "../../_generated/api";
import { supportAgent } from "../ai/agents/supportAgent";

export const escalateConversation = createTool({
  description: "Escalate a conversation",
  args: z.object({}) as any,
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }
    await ctx.runMutation(
      internal.system.conversations.escalate,
      {
        threadId: ctx.threadId,
      }
    );

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content:
          "The conversation has been escalated to human operator.",
      },
    });
    return "Conversation escalated";
  },
});
